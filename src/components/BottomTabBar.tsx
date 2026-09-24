import React from 'react';
import { BookOpen, Sparkles, History, Crown } from 'lucide-react';

export type TabId = 'timeline' | 'upload' | 'prompts' | 'settings';

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isPro: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  isPro,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#121214]/95 backdrop-blur-lg border-t border-zinc-800/90 pb-[max(env(safe-area-inset-bottom),8px)] pt-1 max-w-md mx-auto">
      <div className="grid grid-cols-4 items-center h-14">
        {/* Tab 1: Timeline */}
        <button
          onClick={() => onTabChange('timeline')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'timeline' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Timeline"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px] tracking-tight mt-1">Timeline</span>
        </button>

        {/* Tab 2: Create / Upload (Primary Center Action) */}
        <button
          onClick={() => onTabChange('upload')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'upload' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Create stylized photo"
        >
          <div className={`p-1 rounded-full ${activeTab === 'upload' ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-400/40' : ''}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5">Create</span>
        </button>

        {/* Tab 3: Prompt Vault */}
        <button
          onClick={() => onTabChange('prompts')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'prompts' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Prompt Vault"
        >
          <History className="w-5 h-5" />
          <span className="text-[11px] tracking-tight mt-1">Prompts</span>
        </button>

        {/* Tab 4: Membership / Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'settings' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-label="Membership and settings"
        >
          <div className="relative">
            <Crown className="w-5 h-5" />
            {isPro && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1">{isPro ? 'Pro' : 'Plan'}</span>
        </button>
      </div>
    </nav>
  );
};
