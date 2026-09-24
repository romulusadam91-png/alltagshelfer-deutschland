import React, { useState, useEffect } from 'react';
import { UserSubscription } from '../types';
import {
  Crown,
  Check,
  X as XIcon,
  ShieldCheck,
  Zap,
  Palette,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface PlanUpgradeViewProps {
  subscription: UserSubscription;
  onUpdateSubscription: (updated: UserSubscription) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const PlanUpgradeView: React.FC<PlanUpgradeViewProps> = ({
  subscription,
  onUpdateSubscription,
  onClose,
  isModal = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  
  // Dynamic counter with persistent storage so it feels authentic across visits
  const [spotsLeft, setSpotsLeft] = useState(() => {
    try {
      const stored = localStorage.getItem('muse_launch_spots_left');
      if (stored) {
        const num = parseInt(stored, 10);
        if (!isNaN(num) && num > 0) return num;
      }
    } catch {}
    return 47;
  });

  // Minor simulated live activity on spots counter
  useEffect(() => {
    try {
      localStorage.setItem('muse_launch_spots_left', spotsLeft.toString());
    } catch {}
  }, [spotsLeft]);

  const isPro = subscription.tier === 'premium';
  const usedCount = subscription.monthlyGenerationsUsed ?? 2;
  const limitCount = subscription.tier === 'free' ? 3 : subscription.monthlyGenerationsLimit;

  // Features bullet list requested below the CTA button
  const LAUNCH_BENEFITS = [
    'Unlimited generations for 30 days',
    'No watermark',
    'High-res export',
    'Full prompt history',
  ];

  const handleStartFreeTrial = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Decrement spots count if available
      setSpotsLeft((prev) => Math.max(1, prev - 1));

      onUpdateSubscription({
        ...subscription,
        tier: 'premium',
        monthlyGenerationsLimit: 9999,
        planPeriod: 'annual',
        subscribedAt: new Date().toISOString(),
      });
      setIsProcessing(false);
      if (onClose) onClose();
    }, 600);
  };

  const handleDowngrade = () => {
    onUpdateSubscription({
      ...subscription,
      tier: 'free',
      monthlyGenerationsLimit: 3,
      monthlyGenerationsUsed: 2, // '2/3 free generations used this month'
      planPeriod: undefined,
      subscribedAt: undefined,
    });
  };

  const handleRestorePurchase = () => {
    setRestoreMessage('Verifying App Store receipt...');
    setTimeout(() => {
      onUpdateSubscription({
        ...subscription,
        tier: 'premium',
        monthlyGenerationsLimit: 9999,
        planPeriod: 'annual',
        subscribedAt: new Date().toISOString(),
      });
      setRestoreMessage('Purchases restored! 30-day launch pass is active.');
      setTimeout(() => setRestoreMessage(null), 3500);
    }, 600);
  };

  return (
    <div className={`flex flex-col gap-6 ${isModal ? 'p-5 sm:p-6' : 'px-4 pt-3 pb-28 max-w-md mx-auto w-full'} bg-[#0d0d0f] text-zinc-100`}>
      {/* Top Bar for Modal or Screen */}
      <div className="flex items-center justify-between">
        {/* Serif 'Muse' logo */}
        <div className="flex items-center gap-2">
          <span className="font-editorial text-2xl font-bold tracking-tight text-zinc-100 italic">
            Muse
          </span>
          <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25">
            Launch Pass
          </span>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Hero Header Zone */}
      <div className="flex flex-col items-center text-center gap-3">
        {/* Launch Offer Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold shadow-lg shadow-amber-500/5">
          <span className="text-sm">🎉</span>
          <span>Launch offer — first 100 accounts only</span>
        </div>

        {/* Dynamic Counter Card */}
        <div className="w-full bg-[#141417] border border-zinc-800/90 rounded-2xl p-4 flex flex-col gap-2.5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Early Adopter Allocation</span>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono tracking-wide border border-amber-500/30">
              {spotsLeft}/100 spots left
            </div>
          </div>

          {/* Progress bar visual for spots left */}
          <div className="w-full h-2 bg-zinc-800/80 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${((100 - spotsLeft) / 100) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>{100 - spotsLeft} claimed</span>
            <span className="text-amber-400/90 font-medium">Claim yours today</span>
          </div>
        </div>

        {/* Subtext Showing Usage */}
        <div className="px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
          {isPro ? (
            <span className="text-amber-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Muse Pro active · Unlimited AI generations unlocked
            </span>
          ) : (
            <span>
              You've used{' '}
              <strong className="text-amber-400 tabular-nums">
                {usedCount}/{limitCount} free generations
              </strong>{' '}
              this month
            </span>
          )}
        </div>
      </div>

      {/* Action Zone: Main CTA Button & Benefits List */}
      <div className="bg-[#141417] border border-zinc-800/90 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
        {isPro ? (
          <div className="flex flex-col gap-2.5">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Your 30-Day Launch Pass is Active</span>
            </div>

            <button
              onClick={handleDowngrade}
              className="w-full py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              Reset to Free Tier (demo 2/3 generations used)
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Main CTA button (gold) */}
            <button
              onClick={handleStartFreeTrial}
              disabled={isProcessing}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Crown className="w-5 h-5 text-zinc-950" />
                  <span>Start free for 30 days</span>
                  <ArrowRight className="w-4 h-4 text-zinc-950 ml-1" />
                </>
              )}
            </button>

            {/* Small text below button: 'No card required · Cancel anytime' */}
            <div className="text-center text-xs text-zinc-400 font-medium pt-1">
              No card required · Cancel anytime
            </div>
          </div>
        )}

        {/* Bullet list below button */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-2.5">
          <div className="text-xs font-semibold text-zinc-300">
            Included in your 30-day pass:
          </div>

          <div className="grid grid-cols-1 gap-2">
            {LAUNCH_BENEFITS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-200">
                <div className="w-4 h-4 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Small gray text below bullet list */}
        <div className="pt-1 text-[11px] text-zinc-400 leading-relaxed text-center border-t border-zinc-800/60">
          After your free month: €2.99/month for the first 3 months, then €6.99/month. Cancel anytime, no commitment.
        </div>

        {/* Restore Purchases / Secondary Link */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
          <button
            onClick={handleRestorePurchase}
            className="hover:text-zinc-300 underline cursor-pointer transition-colors"
          >
            Restore purchase
          </button>
        </div>

        {restoreMessage && (
          <div className="text-[11px] text-amber-300 text-center animate-fade-in bg-amber-500/10 border border-amber-500/20 py-1.5 px-3 rounded-lg">
            {restoreMessage}
          </div>
        )}
      </div>

      {/* Three Trust Bullet Points at the Bottom with Icons */}
      <div className="pt-1 grid grid-cols-1 gap-3">
        {/* 1. Private & secure */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-100">
              Private & secure
            </span>
            <span className="text-[11px] text-zinc-400 leading-relaxed">
              Your photos and personal art timeline remain 100% private on your device with no social feed or public profiles.
            </span>
          </div>
        </div>

        {/* 2. Instant generations */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-100">
              Instant generations
            </span>
            <span className="text-[11px] text-zinc-400 leading-relaxed">
              High-speed neural artistic rendering in seconds with no queuing or monthly quotas.
            </span>
          </div>
        </div>

        {/* 3. New styles monthly */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
            <Palette className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-100">
              New styles monthly
            </span>
            <span className="text-[11px] text-zinc-400 leading-relaxed">
              Curated master painter palettes, analog film stock, and digital aesthetics added continuously to your vault.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
