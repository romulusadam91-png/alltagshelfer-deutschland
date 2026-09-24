import React, { useState } from 'react';
import { PromptHistoryItem, SubscriptionTier } from '../types';
import {
  History,
  Sparkles,
  Search,
  Star,
  Copy,
  Check,
  Crown,
  Repeat2,
  Trash2
} from 'lucide-react';

interface PromptVaultProps {
  prompts: PromptHistoryItem[];
  userTier: SubscriptionTier;
  onUsePrompt: (promptText: string) => void;
  onToggleFavorite: (promptId: string) => void;
  onDeletePrompt: (promptId: string) => void;
  onOpenUpgradeModal: () => void;
}

export const PromptVault: React.FC<PromptVaultProps> = ({
  prompts,
  userTier,
  onUsePrompt,
  onToggleFavorite,
  onDeletePrompt,
  onOpenUpgradeModal,
}) => {
  const [search, setSearch] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isPro = userTier === 'premium';

  // In Free tier, limit visible history to 5 items as per spec:
  // "Free tier: ... Premium subscription: ... full prompt history"
  const visiblePrompts = isPro ? prompts : prompts.slice(0, 5);

  const filtered = visiblePrompts.filter((item) => {
    const matchesSearch = item.text.toLowerCase().includes(search.toLowerCase());
    const matchesFav = !filterFavorites || Boolean(item.isFavorite);
    return matchesSearch && matchesFav;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col gap-5 pb-28 px-4 pt-3 max-w-md mx-auto w-full">
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="font-editorial text-2xl font-semibold text-zinc-100">
              Prompt Vault
            </h2>
          </div>
          <span className="text-xs text-zinc-400 tabular-nums">
            {prompts.length} {prompts.length === 1 ? 'style' : 'styles'}
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          Your personal archive of artistic styles. Tap any prompt to reuse it instantly.
        </p>
      </div>

      {/* Free Tier Limit Callout */}
      {!isPro && (
        <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/25 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Limited to 5 recent prompts on Free Tier</span>
            </div>
            <span className="text-[11px] text-amber-400 font-medium">From €4.49/mo</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Upgrade to Premium to unlock your entire prompt history archive, global search, and favorite pinning.
          </p>
          <button
            onClick={onOpenUpgradeModal}
            className="self-start px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
          >
            Upgrade to Premium — from €4.49/month
          </button>
        </div>
      )}

      {/* Search & Favorites Toggle (enabled for Pro, or basic search for Free) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search saved styles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Favorite toggle button */}
        <button
          onClick={() => {
            if (!isPro) {
              onOpenUpgradeModal();
            } else {
              setFilterFavorites(!filterFavorites);
            }
          }}
          className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs cursor-pointer ${
            filterFavorites
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          title={isPro ? 'Filter favorites' : 'Favorites (Pro feature)'}
        >
          <Star className={`w-4 h-4 ${filterFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      </div>

      {/* List of Prompts */}
      {filtered.length === 0 ? (
        <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-2 bg-[#161619] rounded-2xl border border-zinc-800">
          <Sparkles className="w-6 h-6 text-zinc-600 mb-1" />
          <h4 className="font-editorial text-base font-medium text-zinc-200">
            No prompts found
          </h4>
          <p className="text-xs text-zinc-500 max-w-xs">
            {search ? 'Try clearing your search query.' : 'Create an artwork to start building your style archive.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => {
            const dateStr = new Date(item.lastUsed).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={item.id}
                className="bg-[#161619] border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 hover:border-zinc-700 transition-colors"
              >
                {/* Prompt Quote */}
                <p className="font-editorial italic text-sm text-zinc-100 leading-snug">
                  "{item.text}"
                </p>

                {/* Metadata & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span>Used {item.usageCount}×</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>Last: {dateStr}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Star Favorite */}
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Favorite style"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          item.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>

                    {/* Copy Text */}
                    <button
                      onClick={() => handleCopy(item.id, item.text)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                      title="Copy prompt text"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* 1-Tap Use in Creator */}
                    <button
                      onClick={() => onUsePrompt(item.text)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Repeat2 className="w-3.5 h-3.5" />
                      <span>Use Style</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
