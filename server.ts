import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  // Allow high-res images in base64
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Initialize Gemini SDK with User-Agent as required by guideline
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Status check endpoint
  app.get('/api/health', (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      status: 'ok',
      hasApiKey: hasKey,
      appName: 'Muse – Private AI Photo Journal',
    });
  });

  // Photo Stylization API
  app.post('/api/generate-style', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', prompt, styleStrength = 80 } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'Image is required' });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.status(200).json({
          success: false,
          fallbackRequired: true,
          message: 'No GEMINI_API_KEY configured. Falling back to client-side neural art engine.',
        });
      }

      // Extract raw base64 data without data-uri prefix
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

      // Try image-to-image stylization
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: mimeType || 'image/jpeg',
                },
              },
              {
                text: `Transform this photograph into the requested art style: "${prompt}". Preserve the underlying subject, identity, framing, and emotional heart of the photo, but completely reimagine the artistic medium, textures, palette, lighting, and rendering style according to "${prompt}". Output only the generated artistic image.`,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: '4:3',
              imageSize: '1K',
            },
          },
        });

        let outputImageUrl: string | null = null;
        let responseText = '';

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              outputImageUrl = `data:${mime};base64,${part.inlineData.data}`;
              break;
            } else if (part.text) {
              responseText += part.text;
            }
          }
        }

        if (outputImageUrl) {
          return res.json({
            success: true,
            imageUrl: outputImageUrl,
            model: 'gemini-3.1-flash-image',
            notes: responseText || undefined,
          });
        }

        // If nano banana didn't return an image part (e.g. text rejection), signal fallback
        return res.json({
          success: false,
          fallbackRequired: true,
          message: responseText || 'Image model generated non-image response. Using visual synthesizer.',
        });
      } catch (geminiError: any) {
        console.warn('Gemini image generation warning:', geminiError?.message || geminiError);
        return res.json({
          success: false,
          fallbackRequired: true,
          error: geminiError?.message || 'Gemini image generation unavailable',
        });
      }
    } catch (err: any) {
      console.error('Server error during style generation:', err);
      res.status(500).json({
        error: err.message || 'Internal style processing error',
      });
    }
  });

  // Mount Vite middleware for dev or serve static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Muse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
