import React, { useState, useEffect } from 'react';
import {
  JournalEntry,
  PromptHistoryItem,
  UserSubscription
} from './types';
import {
  loadJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
  loadPromptHistory,
  recordUsedPrompt,
  savePromptHistory,
  loadUserSubscription,
  saveUserSubscription,
  incrementGenerationCount
} from './utils/storage';
import { HeaderBar } from './components/HeaderBar';
import { BottomTabBar, TabId } from './components/BottomTabBar';
import { TimelineFeed } from './components/TimelineFeed';
import { UploadScreen } from './components/UploadScreen';
import { PromptVault } from './components/PromptVault';
import { SettingsScreen } from './components/SettingsScreen';
import { ExportModal } from './components/ExportModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { EntryDetailModal } from './components/EntryDetailModal';
import { PrivacyInfoModal } from './components/PrivacyInfoModal';
import { QuotaExceededModal } from './components/QuotaExceededModal';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabId>('timeline');

  // Application Data State
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription>(loadUserSubscription());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & Navigation Helpers
  const [selectedEntryForDetail, setSelectedEntryForDetail] = useState<JournalEntry | null>(null);
  const [selectedEntryForExport, setSelectedEntryForExport] = useState<JournalEntry | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');

  // Initial Load from Persistent Storage
  useEffect(() => {
    async function initData() {
      try {
        const loadedEntries = await loadJournalEntries();
        setEntries(loadedEntries);
        const loadedPrompts = loadPromptHistory();
        setPromptHistory(loadedPrompts);
        const loadedSub = loadUserSubscription();
        setSubscription(loadedSub);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // Handler: When an artwork generation completes
  const handleGenerateSuccess = async (entryData: {
    originalImageUrl: string;
    stylizedImageUrl: string;
    prompt: string;
    note?: string;
    isWatermarked: boolean;
  }) => {
    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now.toISOString(),
      originalImageUrl: entryData.originalImageUrl,
      stylizedImageUrl: entryData.stylizedImageUrl,
      prompt: entryData.prompt,
      note: entryData.note,
      aspectRatio: '4:3',
      isWatermarked: entryData.isWatermarked,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      monthLabel,
      isFavorite: false,
      modelUsed: 'gemini-3.1-flash-image',
    };

    // Save to database
    await saveJournalEntry(newEntry);
    setEntries((prev) => [newEntry, ...prev]);

    // Record prompt into vault
    const updatedPrompts = recordUsedPrompt(entryData.prompt);
    setPromptHistory(updatedPrompts);

    // Increment generation count
    const updatedSub = incrementGenerationCount();
    setSubscription(updatedSub);

    // If user has reached their free quota limit, show the upsell modal
    if (updatedSub.tier === 'free' && updatedSub.monthlyGenerationsUsed >= updatedSub.monthlyGenerationsLimit) {
      setTimeout(() => {
        setIsQuotaModalOpen(true);
      }, 900);
    }

    // Clear prefilled prompt and switch to timeline
    setPrefilledPrompt('');
    setActiveTab('timeline');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Reuse Prompt in Creator
  const handleReusePrompt = (promptText: string) => {
    setPrefilledPrompt(promptText);
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Delete an entry
  const handleDeleteEntry = async (id: string) => {
    await deleteJournalEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (selectedEntryForDetail?.id === id) {
      setSelectedEntryForDetail(null);
    }
  };

  // Handler: Update Subscription (Upgrade / Downgrade)
  const handleUpdateSubscription = (updated: UserSubscription) => {
    saveUserSubscription(updated);
    setSubscription(updated);
  };

  // Handler: Toggle Subscription Tier (Quick testing switcher)
  const handleToggleSubscriptionTier = () => {
    if (subscription.tier === 'premium') {
      handleUpdateSubscription({
        ...subscription,
        tier: 'free',
        monthlyGenerationsLimit: 3,
        monthlyGenerationsUsed: 1,
      });
    } else {
      handleUpdateSubscription({
        ...subscription,
        tier: 'premium',
        monthlyGenerationsLimit: 9999,
        subscribedAt: new Date().toISOString(),
      });
    }
  };

  // Handler: Toggle prompt favorite
  const handleToggleFavoritePrompt = (promptId: string) => {
    const updated = promptHistory.map((p) =>
      p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
    );
    savePromptHistory(updated);
    setPromptHistory(updated);
  };

  // Handler: Delete prompt
  const handleDeletePrompt = (promptId: string) => {
    const updated = promptHistory.filter((p) => p.id !== promptId);
    savePromptHistory(updated);
    setPromptHistory(updated);
  };

  // Handler: Reset sample data
  const handleResetData = async () => {
    localStorage.removeItem('muse_entries_fallback');
    localStorage.removeItem('muse_prompt_history_v1');
    localStorage.removeItem('muse_user_subscription_v1');
    window.location.reload();
  };

  // Handler: Export all journal metadata
  const handleExportAllData = () => {
    const backupData = {
      app: 'Muse – Private AI Photo Journal',
      exportDate: new Date().toISOString(),
      totalEntries: entries.length,
      entries: entries.map((e) => ({
        id: e.id,
        createdAt: e.createdAt,
        prompt: e.prompt,
        note: e.note,
        monthLabel: e.monthLabel,
        isWatermarked: e.isWatermarked,
      })),
      promptHistory,
      subscription,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `muse_journal_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex justify-center text-zinc-100 antialiased selection:bg-amber-500/20 selection:text-amber-200">
      {/* Mobile Shell Container (Max 430px, centered on desktop) */}
      <div className="w-full max-w-md min-h-screen bg-[#121214] flex flex-col relative shadow-2xl border-x border-zinc-900">
        {/* Header App Bar */}
        <HeaderBar
          subscription={subscription}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          onOpenQuotaModal={() => setIsQuotaModalOpen(true)}
          onOpenPrivacyInfo={() => setIsPrivacyModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-x-hidden">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-zinc-500 font-editorial italic">
                Opening private journal...
              </span>
            </div>
          ) : (
            <>
              {activeTab === 'timeline' && (
                <TimelineFeed
                  entries={entries}
                  userTier={subscription.tier}
                  onExport={(entry) => setSelectedEntryForExport(entry)}
                  onSelect={(entry) => setSelectedEntryForDetail(entry)}
                  onReusePrompt={handleReusePrompt}
                  onDelete={handleDeleteEntry}
                  onNavigateToUpload={() => setActiveTab('upload')}
                  onOpenUpgradeModal={() => setIsSubscriptionModalOpen(true)}
                />
              )}

              {activeTab === 'upload' && (
                <UploadScreen
                  subscription={subscription}
                  promptHistory={promptHistory}
                  prefilledPrompt={prefilledPrompt}
                  onGenerateSuccess={handleGenerateSuccess}
                  onOpenUpgradeModal={() => setIsSubscriptionModalOpen(true)}
                  onOpenQuotaModal={() => setIsQuotaModalOpen(true)}
                  onClearPrefilledPrompt={() => setPrefilledPrompt('')}
                />
              )}

              {activeTab === 'prompts' && (
                <PromptVault
                  prompts={promptHistory}
                  userTier={subscription.tier}
                  onUsePrompt={handleReusePrompt}
                  onToggleFavorite={handleToggleFavoritePrompt}
                  onDeletePrompt={handleDeletePrompt}
                  onOpenUpgradeModal={() => setIsSubscriptionModalOpen(true)}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsScreen
                  subscription={subscription}
                  entriesCount={entries.length}
                  onOpenUpgradeModal={() => setIsSubscriptionModalOpen(true)}
                  onResetData={handleResetData}
                  onExportAllData={handleExportAllData}
                  onToggleSubscriptionTier={handleToggleSubscriptionTier}
                  onUpdateSubscription={handleUpdateSubscription}
                />
              )}
            </>
          )}
        </main>

        {/* Fixed Mobile Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isPro={subscription.tier === 'premium'}
        />

        {/* High-Res Export Modal */}
        {selectedEntryForExport && (
          <ExportModal
            entry={selectedEntryForExport}
            userTier={subscription.tier}
            onClose={() => setSelectedEntryForExport(null)}
            onOpenUpgradeModal={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {/* Fullscreen Photo Detail Modal */}
        {selectedEntryForDetail && (
          <EntryDetailModal
            entry={selectedEntryForDetail}
            userTier={subscription.tier}
            onClose={() => setSelectedEntryForDetail(null)}
            onExport={(entry) => setSelectedEntryForExport(entry)}
            onReusePrompt={handleReusePrompt}
            onDelete={handleDeleteEntry}
            onOpenUpgradeModal={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {/* Subscription / Paywall Modal */}
        {isSubscriptionModalOpen && (
          <SubscriptionModal
            subscription={subscription}
            onUpdateSubscription={handleUpdateSubscription}
            onClose={() => setIsSubscriptionModalOpen(false)}
          />
        )}

        {/* Out of Free Generations Upsell Modal */}
        {isQuotaModalOpen && (
          <QuotaExceededModal
            usedGenerations={subscription.monthlyGenerationsUsed}
            totalLimit={subscription.monthlyGenerationsLimit}
            onClose={() => setIsQuotaModalOpen(false)}
            onNavigateToPlan={() => {
              setIsQuotaModalOpen(false);
              setActiveTab('settings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Privacy Assurance Modal */}
        {isPrivacyModalOpen && (
          <PrivacyInfoModal onClose={() => setIsPrivacyModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default App;
