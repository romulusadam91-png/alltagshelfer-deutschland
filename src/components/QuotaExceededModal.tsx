import React from 'react';
import { Crown, Sparkles, X, ArrowRight, ShieldCheck, Zap, Image as ImageIcon } from 'lucide-react';

interface QuotaExceededModalProps {
  usedGenerations: number;
  totalLimit: number;
  onClose: () => void;
  onNavigateToPlan: () => void;
}

export const QuotaExceededModal: React.FC<QuotaExceededModalProps> = ({
  usedGenerations,
  totalLimit,
  onClose,
  onNavigateToPlan,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-[#121215] border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 flex flex-col gap-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Serif Wordmark & Crown */}
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-b from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
              <Crown className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px]">
              PRO
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-editorial text-xs text-amber-400 font-semibold tracking-wider uppercase">
              Free Limit Reached
            </span>
            <h3 className="font-editorial text-2xl font-bold text-zinc-100">
              You've used all free generations
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mt-1">
              You have used <strong className="text-amber-400 tabular-nums">{usedGenerations}/{totalLimit} free generations</strong> for this month. Upgrade to continue crafting private AI artwork with no limits.
            </p>
          </div>
        </div>

        {/* Feature Highlights Mini Grid */}
        <div className="bg-[#16161a] border border-zinc-800/80 rounded-2xl p-3.5 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-semibold text-zinc-200">Unlimited</span>
            <span className="text-[10px] text-zinc-400">Generations</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-zinc-800/80 px-1">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-semibold text-zinc-200">No Watermark</span>
            <span className="text-[10px] text-zinc-400">4K Ultra Export</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-semibold text-zinc-200">Full History</span>
            <span className="text-[10px] text-zinc-400">Prompt Vault</span>
          </div>
        </div>

        {/* Price in EUR & Upgrade Action */}
        <div className="flex flex-col gap-2.5">
          {/* Price Callout */}
          <div className="text-center py-1">
            <span className="text-xs font-semibold text-amber-400">
              Upgrade to Premium — from €4.49/month
            </span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              Billed annually at €53.99/year · Cancel anytime
            </span>
          </div>

          {/* Button Linking to Full Plan Screen */}
          <button
            onClick={() => {
              onClose();
              onNavigateToPlan();
            }}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Crown className="w-4 h-4 text-zinc-950" />
            <span>View Full Plan & Upgrade</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </button>

          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-200 py-1 transition-colors cursor-pointer text-center"
          >
            Maybe later
          </button>
        </div>

        {/* Privacy Note */}
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% private & secure. Stored locally on your device.</span>
        </div>
      </div>
    </div>
  );
};
