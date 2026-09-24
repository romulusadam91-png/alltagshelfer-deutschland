import React, { useState } from 'react';
import { JournalEntry, SubscriptionTier } from '../types';
import { Download, Sparkles, Trash2, Maximize2, Repeat2, Eye } from 'lucide-react';

interface JournalCardProps {
  entry: JournalEntry;
  userTier: SubscriptionTier;
  onExport: (entry: JournalEntry) => void;
  onSelect: (entry: JournalEntry) => void;
  onReusePrompt: (promptText: string) => void;
  onDelete: (entryId: string) => void;
  onOpenUpgradeModal: () => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  entry,
  userTier,
  onExport,
  onSelect,
  onReusePrompt,
  onDelete,
  onOpenUpgradeModal,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date and time
  const dateObj = new Date(entry.createdAt);
  const dateStr = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isWatermarked = entry.isWatermarked && userTier === 'free';

  return (
    <article className="relative bg-[#161619] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-sm transition-all hover:border-zinc-700/80">
      {/* Photo Frame Container with Before/After Touch Interaction */}
      <div
        className="relative aspect-[4/3] w-full bg-zinc-900 cursor-pointer overflow-hidden select-none"
        onMouseDown={() => setShowOriginal(true)}
        onMouseUp={() => setShowOriginal(false)}
        onMouseLeave={() => setShowOriginal(false)}
        onTouchStart={() => setShowOriginal(true)}
        onTouchEnd={() => setShowOriginal(false)}
        onClick={() => onSelect(entry)}
      >
        {/* Stylized Image */}
        <img
          src={showOriginal ? entry.originalImageUrl : entry.stylizedImageUrl}
          alt={entry.prompt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-opacity duration-150"
        />

        {/* Free tier signature watermark overlay */}
        {isWatermarked && !showOriginal && (
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-zinc-300 tracking-wide">
                Created with Muse
              </span>
            </div>
          </div>
        )}

        {/* Interactive Hold-to-Compare Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-zinc-200">
          <Eye className="w-3 h-3 text-amber-400" />
          <span>{showOriginal ? 'Original Photo' : 'Hold to compare'}</span>
        </div>

        {/* Fullscreen icon trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(entry);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 hover:text-white border border-white/10 transition-colors"
          title="View high-res"
          aria-label="Expand image"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col gap-3">
        {/* Unboxed Metadata Line (No pills, clean typographic separators as per constitution) */}
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-300 font-medium">{dateStr}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{timeStr}</span>
          </div>

          {/* Model info or watermark status */}
          {isWatermarked ? (
            <button
              onClick={onOpenUpgradeModal}
              className="text-[11px] text-amber-400/90 hover:text-amber-300 font-medium transition-colors cursor-pointer"
            >
              Watermarked · Remove
            </button>
          ) : (
            <span className="text-[11px] text-zinc-500 font-mono">
              Unwatermarked
            </span>
          )}
        </div>

        {/* Prompt Quote */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Style Prompt
          </span>
          <p className="font-editorial italic text-base text-zinc-100 leading-snug line-clamp-2">
            "{entry.prompt}"
          </p>
        </div>

        {/* Optional Journal Note */}
        {entry.note && (
          <p className="text-xs text-zinc-300 font-normal leading-relaxed bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60">
            {entry.note}
          </p>
        )}

        {/* Action Controls */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Quick Reuse Prompt */}
            <button
              onClick={() => onReusePrompt(entry.prompt)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
              title="Use this prompt in creator"
            >
              <Repeat2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Reuse</span>
            </button>

            {/* Export / Download */}
            <button
              onClick={() => onExport(entry)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
              title="Save or export high-res"
            >
              <Download className="w-3.5 h-3.5 text-zinc-300" />
              <span>Export</span>
            </button>
          </div>

          {/* Delete Action */}
          {isDeleting ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-rose-400">Delete?</span>
              <button
                onClick={() => onDelete(entry.id)}
                className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 text-xs font-medium hover:bg-rose-500/30"
              >
                Yes
              </button>
              <button
                onClick={() => setIsDeleting(false)}
                className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs hover:text-zinc-200"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsDeleting(true)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800/60 transition-colors"
              title="Delete journal entry"
              aria-label="Delete entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
