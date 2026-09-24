import React from 'react';
import { ShieldCheck, X, Lock, EyeOff, ServerOff, Check } from 'lucide-react';

interface PrivacyInfoModalProps {
  onClose: () => void;
}

export const PrivacyInfoModal: React.FC<PrivacyInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      <div className="bg-[#161619] border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-editorial text-xl font-semibold text-zinc-100">
              Private Architecture
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <EyeOff className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-200">
                No Social Network & No Public Feeds
              </span>
              <span className="text-[11px] text-zinc-400 leading-relaxed">
                Muse is built exclusively for intimate personal reflection. There are no followers, likes, comments, or public profile pages.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-200">
                Single-User Encrypted Storage
              </span>
              <span className="text-[11px] text-zinc-400 leading-relaxed">
                Your uploaded photos, prompt history, and journal notes live on your device in your browser's private database.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <ServerOff className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-200">
                Zero Image Scraping
              </span>
              <span className="text-[11px] text-zinc-400 leading-relaxed">
                Photos are never indexed, crawled, or shared with third-party advertisers.
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors mt-1 cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
