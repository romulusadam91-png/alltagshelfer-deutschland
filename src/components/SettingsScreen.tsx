import React from 'react';
import { UserSubscription } from '../types';
import { PlanUpgradeView } from './PlanUpgradeView';
import {
  HardDrive,
  Download,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SettingsScreenProps {
  subscription: UserSubscription;
  entriesCount: number;
  onOpenUpgradeModal: () => void;
  onResetData: () => void;
  onExportAllData: () => void;
  onToggleSubscriptionTier: () => void;
  onUpdateSubscription: (updated: UserSubscription) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  subscription,
  entriesCount,
  onResetData,
  onExportAllData,
  onUpdateSubscription,
}) => {
  return (
    <div className="flex flex-col gap-6 pb-28">
      {/* Primary Plan / Upgrade Experience */}
      <PlanUpgradeView
        subscription={subscription}
        onUpdateSubscription={onUpdateSubscription}
        isModal={false}
      />

      {/* Auxiliary Settings: Local Device Storage & Backup */}
      <div className="px-4 max-w-md mx-auto w-full flex flex-col gap-4">
        <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span>Local Device Storage</span>
          </div>

          <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/80">
            <span className="text-zinc-300">Journal Memories Saved:</span>
            <span className="font-semibold text-zinc-100 tabular-nums">
              {entriesCount} photos
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {/* Export JSON backup */}
            <button
              onClick={onExportAllData}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-zinc-400" />
                <span>Export Journal Metadata (JSON)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>

            {/* Reset sample data */}
            <button
              onClick={onResetData}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-zinc-500" />
                <span>Reset Sample Entries</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-2 flex flex-col items-center gap-1 text-[11px] text-zinc-500">
          <span className="font-editorial italic text-xs text-zinc-400">
            Muse — Private AI Photo Journal
          </span>
          <span>Version 1.0 · Designed for personal reflection</span>
        </div>
      </div>
    </div>
  );
};
