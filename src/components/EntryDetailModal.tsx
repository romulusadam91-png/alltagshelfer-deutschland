import React, { useState } from 'react';
import { JournalEntry, SubscriptionTier } from '../types';
import {
  X,
  Download,
  Repeat2,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Trash2,
  Eye,
  Crown
} from 'lucide-react';

interface EntryDetailModalProps {
  entry: JournalEntry | null;
  userTier: SubscriptionTier;
  onClose: () => void;
  onExport: (entry: JournalEntry) => void;
  onReusePrompt: (promptText: string) => void;
  onDelete: (id: string) => void;
  onOpenUpgradeModal: () => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  userTier,
  onClose,
  onExport,
  onReusePrompt,
  onDelete,
  onOpenUpgradeModal,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!entry) return null;

  const isPro = userTier === 'premium';
  const isWatermarked = entry.isWatermarked && !isPro;

  const dateFormatted = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatted = new Date(entry.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(entry.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      <div className="bg-[#141416] border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[95vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Top bar */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between sticky top-0 bg-[#141416]/90 backdrop-blur-md z-10">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">{dateFormatted}</span>
            <span className="text-[11px] text-zinc-500 font-mono">{timeFormatted}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo View with Before/After Compare */}
        <div className="relative aspect-[4/3] w-full bg-black overflow-hidden select-none">
          <img
            src={showOriginal ? entry.originalImageUrl : entry.stylizedImageUrl}
            alt={entry.prompt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />

          {/* Watermark overlay on preview if Free */}
          {isWatermarked && !showOriginal && (
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 text-[10px] text-zinc-300 font-medium">
                Created with Muse
              </div>
            </div>
          )}

          {/* Hold to compare button / indicator */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <button
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              onTouchStart={() => setShowOriginal(true)}
              onTouchEnd={() => setShowOriginal(false)}
              className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 active:bg-amber-500/80 active:text-zinc-950 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showOriginal ? 'Showing Original' : 'Hold for Original'}</span>
            </button>
          </div>
        </div>

        {/* Details & Information */}
        <div className="p-5 flex flex-col gap-4">
          {/* Prompt Quote */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Style Prompt
              </span>
              <button
                onClick={handleCopyPrompt}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-editorial italic text-lg text-zinc-100 leading-snug">
              "{entry.prompt}"
            </p>
          </div>

          {/* Optional Note */}
          {entry.note && (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Memory Note
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                {entry.note}
              </p>
            </div>
          )}

          {/* Tier status indicator */}
          <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-zinc-400">Watermark Status:</span>
            {isWatermarked ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenUpgradeModal();
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Free Signature · Upgrade</span>
                <Crown className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-emerald-400 font-medium">Clean · Watermark Free</span>
            )}
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Reuse in Creator */}
            <button
              onClick={() => {
                onReusePrompt(entry.prompt);
                onClose();
              }}
              className="h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Repeat2 className="w-4 h-4 text-amber-400" />
              <span>Reuse Style</span>
            </button>

            {/* Export */}
            <button
              onClick={() => {
                onClose();
                onExport(entry);
              }}
              className="h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export High-Res</span>
            </button>
          </div>

          {/* Delete Action */}
          <div className="pt-2 border-t border-zinc-800/80 flex justify-end">
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400">Permanently delete?</span>
                <button
                  onClick={() => {
                    onDelete(entry.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:text-zinc-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsDeleting(true)}
                className="text-xs text-zinc-500 hover:text-rose-400 flex items-center gap-1 p-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Entry</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
