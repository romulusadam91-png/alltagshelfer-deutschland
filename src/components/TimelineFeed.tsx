import React, { useState, useMemo } from 'react';
import { JournalEntry, SubscriptionTier } from '../types';
import { JournalCard } from './JournalCard';
import { Search, Calendar, Sparkles, Filter, X } from 'lucide-react';

interface TimelineFeedProps {
  entries: JournalEntry[];
  userTier: SubscriptionTier;
  onExport: (entry: JournalEntry) => void;
  onSelect: (entry: JournalEntry) => void;
  onReusePrompt: (promptText: string) => void;
  onDelete: (entryId: string) => void;
  onNavigateToUpload: () => void;
  onOpenUpgradeModal: () => void;
}

export const TimelineFeed: React.FC<TimelineFeedProps> = ({
  entries,
  userTier,
  onExport,
  onSelect,
  onReusePrompt,
  onDelete,
  onNavigateToUpload,
  onOpenUpgradeModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        entry.prompt.toLowerCase().includes(q) ||
        (entry.note && entry.note.toLowerCase().includes(q)) ||
        entry.monthLabel.toLowerCase().includes(q);

      const matchesMonth =
        selectedMonthFilter === 'all' || entry.monthLabel === selectedMonthFilter;

      return matchesSearch && matchesMonth;
    });
  }, [entries, searchQuery, selectedMonthFilter]);

  // Group filtered entries by Month/Year
  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: JournalEntry[] } = {};
    for (const entry of filteredEntries) {
      const key = entry.monthLabel || 'Archived Memories';
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    }
    return groups;
  }, [filteredEntries]);

  // Distinct months for filter bar
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => set.add(e.monthLabel));
    return Array.from(set);
  }, [entries]);

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-3 max-w-md mx-auto w-full">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search prompts, notes, or styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Month Filter Selector (if multiple months exist) */}
        {availableMonths.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none no-scrollbar">
            <button
              onClick={() => setSelectedMonthFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedMonthFilter === 'all'
                  ? 'bg-zinc-800 text-amber-400 border border-amber-500/30'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              All Months ({entries.length})
            </button>
            {availableMonths.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonthFilter(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedMonthFilter === m
                    ? 'bg-zinc-800 text-amber-400 border border-amber-500/30'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chronological Feed */}
      {filteredEntries.length === 0 ? (
        <div className="py-16 px-4 text-center flex flex-col items-center justify-center gap-3 bg-[#151518] rounded-2xl border border-zinc-800/60">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-xl font-medium text-zinc-100">
            {searchQuery ? 'No matching memories found' : 'Your private journal is ready'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
            {searchQuery
              ? 'Try searching for another style name like "watercolor", "film", or "polaroid".'
              : 'Upload a personal photograph and transform it with a custom AI art style prompt.'}
          </p>
          <button
            onClick={onNavigateToUpload}
            className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs tracking-tight transition-all shadow-md shadow-amber-500/15 cursor-pointer"
          >
            Create First Journal Entry
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(groupedEntries).map(([monthLabel, monthEntries]) => (
            <section key={monthLabel} className="flex flex-col gap-3">
              {/* Chronological Month Group Header */}
              <div className="flex items-center justify-between px-1 sticky top-14 z-20 bg-[#121214]/90 backdrop-blur-md py-2 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400/90" />
                  <h2 className="font-editorial text-lg font-semibold text-zinc-100 tracking-tight">
                    {monthLabel}
                  </h2>
                </div>
                <span className="text-xs text-zinc-400 tabular-nums">
                  {monthEntries.length} {monthEntries.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              {/* Feed Cards for this Month */}
              <div className="flex flex-col gap-4">
                {monthEntries.map((entry) => (
                  <JournalCard
                    key={entry.id}
                    entry={entry}
                    userTier={userTier}
                    onExport={onExport}
                    onSelect={onSelect}
                    onReusePrompt={onReusePrompt}
                    onDelete={onDelete}
                    onOpenUpgradeModal={onOpenUpgradeModal}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
