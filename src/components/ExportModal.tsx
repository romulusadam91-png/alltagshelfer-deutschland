import React, { useState, useEffect } from 'react';
import { ExportLayout, JournalEntry, SubscriptionTier } from '../types';
import { renderExportCanvas, triggerFileDownload } from '../utils/canvasRenderer';
import { Download, X, Crown, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

interface ExportModalProps {
  entry: JournalEntry | null;
  userTier: SubscriptionTier;
  onClose: () => void;
  onOpenUpgradeModal: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  entry,
  userTier,
  onClose,
  onOpenUpgradeModal,
}) => {
  const [layout, setLayout] = useState<ExportLayout>('stylized-only');
  const [quality, setQuality] = useState<'standard' | 'high-res'>('high-res');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const isPro = userTier === 'premium';
  const isWatermarked = !isPro || (entry ? entry.isWatermarked : false);

  // Render preview whenever layout or entry changes
  useEffect(() => {
    if (!entry) return;
    let isCancelled = false;

    const generatePreview = async () => {
      setIsRendering(true);
      try {
        const url = await renderExportCanvas({
          entry,
          layout,
          tier: userTier,
          quality: 'standard', // quick standard preview
        });
        if (!isCancelled) {
          setPreviewUrl(url);
        }
      } catch (err) {
        console.error('Failed to generate export preview:', err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    };

    generatePreview();
    return () => {
      isCancelled = true;
    };
  }, [entry, layout, userTier]);

  if (!entry) return null;

  const handleDownload = async () => {
    try {
      setIsRendering(true);
      const highResDataUrl = await renderExportCanvas({
        entry,
        layout,
        tier: userTier,
        quality: isPro ? 'high-res' : 'standard',
      });

      const dateSlug = new Date(entry.createdAt).toISOString().split('T')[0];
      const filename = `muse_${layout}_${dateSlug}.jpg`;
      triggerFileDownload(highResDataUrl, filename);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2500);
    } catch (err) {
      console.error('Download export failed:', err);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      {/* Modal Card */}
      <div className="bg-[#161619] border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#161619]/95 backdrop-blur-md p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-400" />
            <h3 className="font-editorial text-lg font-semibold text-zinc-100">
              Export Artwork
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          {/* Live Preview Display */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black/50 border border-zinc-800 flex items-center justify-center">
            {isRendering && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Export preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-xs text-zinc-500">Preparing preview...</div>
            )}
          </div>

          {/* Format / Layout Selection */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Select Export Format
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLayout('stylized-only')}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  layout === 'stylized-only'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Artwork Only</span>
                <span className="text-[10px] text-zinc-500">Pure Image</span>
              </button>

              <button
                type="button"
                onClick={() => setLayout('polaroid-card')}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  layout === 'polaroid-card'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Journal Card</span>
                <span className="text-[10px] text-zinc-500">Prompt & Frame</span>
              </button>

              <button
                type="button"
                onClick={() => setLayout('before-after-diptych')}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  layout === 'before-after-diptych'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Before & After</span>
                <span className="text-[10px] text-zinc-500">Split Comparison</span>
              </button>
            </div>
          </div>

          {/* Watermark Banner */}
          {isWatermarked ? (
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-zinc-200 font-medium">Free Tier Export (Watermarked)</span>
                <span className="text-[11px] text-amber-300">Upgrade to Premium — from €4.49/month</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenUpgradeModal();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-[11px] transition-colors cursor-pointer shrink-0"
              >
                View Plan
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-300 font-medium">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Muse Pro · 100% Watermark-Free High-Res Export</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleDownload}
            disabled={isRendering}
            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs tracking-tight flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 transition-all active:scale-[0.98] cursor-pointer"
          >
            {isDownloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>Saved to Photos!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>
                  {isPro ? 'Download High-Res (No Watermark)' : 'Download Artwork'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
