import { ExportLayout, JournalEntry, SubscriptionTier } from '../types';

interface ExportOptions {
  entry: JournalEntry;
  layout: ExportLayout;
  tier: SubscriptionTier;
  quality?: 'standard' | 'high-res';
}

// Helper to load image as HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

// Helper to draw clean text with word wrapping
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 3
): number {
  const words = text.split(' ');
  let line = '';
  let linesCount = 0;
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      linesCount++;
      if (linesCount >= maxLines - 1 && n < words.length - 1) {
        line += '...';
        break;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

export async function renderExportCanvas({
  entry,
  layout,
  tier,
  quality = 'high-res',
}: ExportOptions): Promise<string> {
  const isFree = tier === 'free' || entry.isWatermarked;
  const scale = quality === 'high-res' ? 2 : 1;

  const stylizedImg = await loadImage(entry.stylizedImageUrl);
  let originalImg: HTMLImageElement | null = null;
  if (layout === 'before-after-diptych') {
    try {
      originalImg = await loadImage(entry.originalImageUrl);
    } catch {
      originalImg = stylizedImg;
    }
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  if (layout === 'stylized-only') {
    // Pure photo export
    const targetWidth = (quality === 'high-res' ? 2048 : 1200);
    const targetHeight = Math.round((targetWidth / stylizedImg.width) * stylizedImg.height);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(stylizedImg, 0, 0, targetWidth, targetHeight);

    // Apply watermark only for Free tier
    if (isFree) {
      drawWatermark(ctx, targetWidth, targetHeight, scale);
    }

    return canvas.toDataURL('image/jpeg', 0.94);
  }

  if (layout === 'polaroid-card') {
    // Gallery Polaroid card with museum border
    const photoWidth = (quality === 'high-res' ? 1600 : 1000);
    const photoHeight = Math.round((photoWidth / stylizedImg.width) * stylizedImg.height);

    const marginHorizontal = Math.round(photoWidth * 0.08);
    const marginTop = Math.round(photoWidth * 0.08);
    const marginBottom = Math.round(photoWidth * 0.22); // Extra room for prompt and date

    const canvasWidth = photoWidth + marginHorizontal * 2;
    const canvasHeight = photoHeight + marginTop + marginBottom;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Card background: Gallery warm ivory/white
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Subtle inner shadow / border for photo
    ctx.fillStyle = '#00000008';
    ctx.fillRect(marginHorizontal - 2, marginTop - 2, photoWidth + 4, photoHeight + 4);

    // Draw photo
    ctx.drawImage(stylizedImg, marginHorizontal, marginTop, photoWidth, photoHeight);

    // Typeset prompt & metadata below photo
    const textY = marginTop + photoHeight + Math.round(photoWidth * 0.05);

    // Prompt in elegant italic serif
    ctx.fillStyle = '#1c1917';
    ctx.font = `italic 600 ${Math.round(28 * scale)}px 'Fraunces', Georgia, serif`;
    const lastY = wrapText(ctx, `"${entry.prompt}"`, marginHorizontal, textY, photoWidth * 0.85, 38 * scale, 2);

    // Date & location/note
    ctx.fillStyle = '#78716c';
    ctx.font = `500 ${Math.round(18 * scale)}px 'Plus Jakarta Sans', sans-serif`;
    const dateFormatted = new Date(entry.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.fillText(`${dateFormatted}${entry.note ? ` · ${entry.note}` : ''}`, marginHorizontal, lastY + 8 * scale);

    // Right side brand monogram
    ctx.textAlign = 'right';
    if (isFree) {
      ctx.fillStyle = '#a8a29e';
      ctx.font = `600 ${Math.round(15 * scale)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillText('MUSE · FREE TIER', canvasWidth - marginHorizontal, lastY + 8 * scale);
    } else {
      ctx.fillStyle = '#b45309';
      ctx.font = `italic 700 ${Math.round(20 * scale)}px 'Fraunces', serif`;
      ctx.fillText('Muse', canvasWidth - marginHorizontal, lastY + 8 * scale);
    }
    ctx.textAlign = 'left';

    return canvas.toDataURL('image/jpeg', 0.95);
  }

  if (layout === 'before-after-diptych') {
    // Before & After Diptych side-by-side
    const halfWidth = (quality === 'high-res' ? 1024 : 600);
    const photoHeight = Math.round((halfWidth / stylizedImg.width) * stylizedImg.height);
    const gutter = 12 * scale;
    const padding = 32 * scale;
    const footerHeight = 110 * scale;

    const canvasWidth = halfWidth * 2 + gutter + padding * 2;
    const canvasHeight = photoHeight + footerHeight + padding * 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Dark sleek gallery background
    ctx.fillStyle = '#141416';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Left: Original
    if (originalImg) {
      ctx.drawImage(originalImg, padding, padding, halfWidth, photoHeight);
    }
    // Tag on Original
    drawTag(ctx, 'ORIGINAL PHOTO', padding + 16 * scale, padding + 28 * scale, scale);

    // Right: Stylized
    ctx.drawImage(stylizedImg, padding + halfWidth + gutter, padding, halfWidth, photoHeight);
    // Tag on Stylized
    drawTag(ctx, 'AI STYLIZED', padding + halfWidth + gutter + 16 * scale, padding + 28 * scale, scale, true);

    // Footer info
    const footerY = padding + photoHeight + 36 * scale;
    ctx.fillStyle = '#f4f4f5';
    ctx.font = `italic 600 ${Math.round(24 * scale)}px 'Fraunces', serif`;
    wrapText(ctx, `Style: "${entry.prompt}"`, padding, footerY, canvasWidth - padding * 2 - 200 * scale, 32 * scale, 2);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#a1a1aa';
    ctx.font = `500 ${Math.round(16 * scale)}px 'Plus Jakarta Sans', sans-serif`;
    const dateFormatted = new Date(entry.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    ctx.fillText(dateFormatted, canvasWidth - padding, footerY);

    if (isFree) {
      ctx.fillStyle = '#71717a';
      ctx.font = `600 ${Math.round(13 * scale)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillText('Muse Private Journal', canvasWidth - padding, footerY + 24 * scale);
    }
    ctx.textAlign = 'left';

    return canvas.toDataURL('image/jpeg', 0.94);
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

// Subtle watermark for free tier
function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) {
  const text = 'Created with Muse';
  const fontSize = Math.round(Math.max(14, width * 0.022));
  ctx.font = `600 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
  const metrics = ctx.measureText(text);

  const padX = fontSize * 1.0;
  const padY = fontSize * 0.6;
  const boxWidth = metrics.width + padX * 2;
  const boxHeight = fontSize + padY * 2;

  const posX = width - boxWidth - Math.round(width * 0.035);
  const posY = height - boxHeight - Math.round(width * 0.035);

  // Translucent backdrop pill
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  ctx.beginPath();
  ctx.roundRect(posX, posY, boxWidth, boxHeight, 8 * scale);
  ctx.fill();

  // Watermark text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.fillText(text, posX + padX, posY + padY + fontSize * 0.82);
  ctx.restore();
}

function drawTag(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  scale: number,
  highlight = false
) {
  ctx.save();
  const fontSize = Math.round(12 * scale);
  ctx.font = `700 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
  const metrics = ctx.measureText(text);
  const padX = 10 * scale;
  const padY = 5 * scale;
  const w = metrics.width + padX * 2;
  const h = fontSize + padY * 2;

  ctx.fillStyle = highlight ? 'rgba(245, 158, 11, 0.85)' : 'rgba(0, 0, 0, 0.65)';
  ctx.beginPath();
  ctx.roundRect(x, y - h / 2, w, h, 6 * scale);
  ctx.fill();

  ctx.fillStyle = highlight ? '#000000' : '#ffffff';
  ctx.fillText(text, x + padX, y + fontSize * 0.35);
  ctx.restore();
}

// Download helper
export function triggerFileDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
