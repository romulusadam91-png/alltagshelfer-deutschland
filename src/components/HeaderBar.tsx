import React from 'react';
import { UserSubscription } from '../types';
import { Sparkles, Crown, ShieldCheck } from 'lucide-react';

interface HeaderBarProps {
  subscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
  onOpenQuotaModal?: () => void;
  onOpenPrivacyInfo?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  subscription,
  onOpenSubscriptionModal,
  onOpenQuotaModal,
  onOpenPrivacyInfo,
}) => {
  const isPro = subscription.tier === 'premium';
  const remaining = Math.max(0, subscription.monthlyGenerationsLimit - subscription.monthlyGenerationsUsed);

  const handleQuotaClick = () => {
    if (remaining === 0 && onOpenQuotaModal) {
      onOpenQuotaModal();
    } else {
      onOpenSubscriptionModal();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#121214]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
      {/* Brand Zone: Single editorial wordmark */}
      <div className="flex items-center gap-2">
        <h1 className="font-editorial text-2xl tracking-tight text-zinc-100 font-semibold italic">
          Muse
        </h1>
        <span className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase">
          Private Journal
        </span>
      </div>

      {/* Action Zone: Subscription status / quota pill */}
      <div className="flex items-center gap-2">
        {isPro ? (
          <button
            onClick={onOpenSubscriptionModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-500/50 transition-colors cursor-pointer"
            title="Muse Pro Member"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>PRO</span>
          </button>
        ) : (
          <button
            onClick={handleQuotaClick}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs transition-colors cursor-pointer"
          >
            <span className="text-zinc-400">Free:</span>
            <span className={`font-semibold tabular-nums ${remaining === 0 ? 'text-rose-400' : 'text-amber-400'}`}>
              {remaining}/3 left
            </span>
            <span className="text-amber-400 text-[11px] font-medium ml-0.5">
              {remaining === 0 ? 'Limit' : 'Upgrade'}
            </span>
          </button>
        )}

        {/* Private Vault icon indicator */}
        <button
          onClick={onOpenPrivacyInfo}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          title="100% Private & Single-User. No feeds or tracking."
          aria-label="Privacy status"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </header>
  );
};
