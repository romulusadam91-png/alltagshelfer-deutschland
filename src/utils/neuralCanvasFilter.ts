// Client-side artistic canvas engine
// Transforms photos based on prompt keywords when server indicates fallback

export async function applyArtisticFilter(
  imageSource: string | HTMLImageElement,
  prompt: string,
  intensity: number = 85
): Promise<string> {
  let img: HTMLImageElement;
  if (typeof imageSource === 'string') {
    img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = imageSource;
    });
  } else {
    img = imageSource;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas context unavailable');

  // Limit processing size to 1600px for speed while maintaining high quality
  const maxDim = 1600;
  let w = img.width;
  let h = img.height;
  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = Math.round((h * maxDim) / w);
      w = maxDim;
    } else {
      w = Math.round((w * maxDim) / h);
      h = maxDim;
    }
  }

  canvas.width = w;
  canvas.height = h;

  // Draw base image
  ctx.drawImage(img, 0, 0, w, h);

  const lowerPrompt = prompt.toLowerCase();
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Detect style archetype from prompt
  const isWesAnderson = lowerPrompt.includes('wes anderson') || lowerPrompt.includes('pastel');
  const isWatercolor = lowerPrompt.includes('watercolor') || lowerPrompt.includes('sumi') || lowerPrompt.includes('ink');
  const isY2K = lowerPrompt.includes('y2k') || lowerPrompt.includes('digital camera') || lowerPrompt.includes('digicam') || lowerPrompt.includes('flash');
  const isMonet = lowerPrompt.includes('monet') || lowerPrompt.includes('impressionist') || lowerPrompt.includes('oil');
  const isCyberpunk = lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon');
  const isFilm = lowerPrompt.includes('film') || lowerPrompt.includes('polaroid') || lowerPrompt.includes('kodachrome') || lowerPrompt.includes('35mm');

  const strength = Math.max(0.2, Math.min(1.0, intensity / 100));

  // Pixel-level artistic transformation
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    if (isWesAnderson) {
      // Warm yellow/pastel rose color grade, lifted blacks, storybook saturation
      r = r * 1.15 + 18;
      g = g * 1.08 + 12;
      b = b * 0.88 + 8;
      // Soft pastel curve
      r = Math.min(255, r * 0.9 + luminance * 0.15 + 15);
      g = Math.min(255, g * 0.9 + luminance * 0.12 + 10);
    } else if (isWatercolor) {
      // Soft translucent pigment washes, sumi ink darks, textured wash
      if (luminance < 70) {
        // Deep ink pooling
        r = r * 0.75;
        g = g * 0.78;
        b = b * 0.85;
      } else {
        // Paper wash bleeding
        r = r * 1.08 + 20;
        g = g * 1.05 + 18;
        b = b * 0.98 + 12;
      }
    } else if (isY2K) {
      // Direct flash highlight blowout, cool sensor noise, crushed deep blacks
      if (luminance > 180) {
        r = Math.min(255, r * 1.25);
        g = Math.min(255, g * 1.25);
        b = Math.min(255, b * 1.28);
      } else {
        r = r * 0.95;
        g = g * 0.98;
        b = b * 1.05;
      }
    } else if (isCyberpunk) {
      // Deep blue/purple shadows, electric magenta/cyan highlights
      if (luminance < 110) {
        r = r * 0.6 + 10;
        g = g * 0.7 + 15;
        b = b * 1.2 + 35;
      } else {
        r = Math.min(255, r * 1.2 + 30);
        g = g * 0.9;
        b = Math.min(255, b * 1.15 + 20);
      }
    } else if (isMonet) {
      // Impressionist chromatic vibration
      r = r * 1.05 + 10;
      g = g * 1.12 + 12;
      b = b * 0.95;
    } else if (isFilm) {
      // Vintage analog Kodachrome/Polaroid tones
      r = r * 1.12 + 14;
      g = g * 1.04;
      b = b * 0.92 + 6;
      if (luminance < 50) {
        // Cyan faded blacks
        b += 14;
        g += 6;
      }
    } else {
      // Editorial cinema grade
      r = r * 1.08 + 10;
      g = g * 1.02;
      b = b * 0.96;
    }

    // Blend with original according to strength
    data[i] = Math.max(0, Math.min(255, Math.round(data[i] * (1 - strength) + r * strength)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] * (1 - strength) + g * strength)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] * (1 - strength) + b * strength)));
  }

  ctx.putImageData(imgData, 0, 0);

  // Secondary layer: artistic texture, grain, and vignette
  if (isWatercolor) {
    applyPaperTexture(ctx, w, h);
  } else if (isWesAnderson || isFilm) {
    applyFilmGrain(ctx, w, h, 0.08);
    applyVignette(ctx, w, h, 0.25);
  } else if (isY2K) {
    applyY2KFlashGlow(ctx, w, h);
  } else if (isMonet) {
    applyBrushImpasto(ctx, w, h);
  }

  return canvas.toDataURL('image/jpeg', 0.94);
}

function applyFilmGrain(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 256;
  grainCanvas.height = 256;
  const gCtx = grainCanvas.getContext('2d');
  if (!gCtx) return;

  const gData = gCtx.createImageData(256, 256);
  for (let i = 0; i < gData.data.length; i += 4) {
    const val = (Math.random() - 0.5) * 255 * amount;
    gData.data[i] = 128 + val;
    gData.data[i + 1] = 128 + val;
    gData.data[i + 2] = 128 + val;
    gData.data[i + 3] = 40;
  }
  gCtx.putImageData(gData, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat') || '#00000000';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function applyVignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  ctx.save();
  const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, `rgba(18,14,10,${strength})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function applyPaperTexture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(250, 245, 235, 0.25)';
  ctx.fillRect(0, 0, w, h);

  // Subtle border bleed vignette
  const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.max(w, h) * 0.8);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(235,225,210,0.4)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function applyY2KFlashGlow(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  // Central flash hotspot
  const grad = ctx.createRadialGradient(w * 0.48, h * 0.45, 10, w * 0.48, h * 0.45, Math.min(w, h) * 0.6);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function applyBrushImpasto(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = 'rgba(255, 240, 210, 0.2)';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
