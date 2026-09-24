import { JournalEntry, PromptHistoryItem, UserSubscription } from '../types';

const DB_NAME = 'muse_journal_db';
const DB_VERSION = 1;
const STORE_ENTRIES = 'entries';

const STORAGE_KEY_PROMPTS = 'muse_prompt_history_v1';
const STORAGE_KEY_SUB = 'muse_user_subscription_v1';

// Open IndexedDB
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_ENTRIES)) {
        db.createObjectStore(STORE_ENTRIES, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Initial default sample entries
const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: 'sample-wes-anderson-2026',
    createdAt: '2026-09-24T08:45:00.000Z',
    originalImageUrl: '/src/assets/images/muse_sample_original_photo_1790246330140.jpg',
    stylizedImageUrl: '/src/assets/images/muse_sample_wes_anderson_1790246296364.jpg',
    prompt: 'Wes Anderson pastel film, symmetrical Parisian facade with yellow and rose pastel tones, 35mm grain',
    note: 'Morning espresso at the corner cafe. Everything felt like a frame from a film.',
    aspectRatio: '4:3',
    isWatermarked: false,
    year: 2026,
    month: 9,
    monthLabel: 'September 2026',
    isFavorite: true,
    modelUsed: 'gemini-3.1-flash-image',
  },
  {
    id: 'sample-watercolor-2026',
    createdAt: '2026-09-18T14:20:00.000Z',
    originalImageUrl: '/src/assets/images/muse_sample_original_photo_1790246330140.jpg',
    stylizedImageUrl: '/src/assets/images/muse_sample_watercolor_1790246307952.jpg',
    prompt: 'Japanese watercolor wash, delicate sumi-e ink brushstrokes, soft cherry blossoms on washi paper',
    note: 'Quiet afternoon by the garden pond, watching the reflection of autumn leaves.',
    aspectRatio: '4:3',
    isWatermarked: false,
    year: 2026,
    month: 9,
    monthLabel: 'September 2026',
    isFavorite: false,
    modelUsed: 'gemini-3.1-flash-image',
  },
  {
    id: 'sample-y2k-2026',
    createdAt: '2026-08-12T22:15:00.000Z',
    originalImageUrl: '/src/assets/images/muse_sample_original_photo_1790246330140.jpg',
    stylizedImageUrl: '/src/assets/images/muse_sample_y2k_cam_1790246319252.jpg',
    prompt: 'Y2K digital camera flash snapshot, retro diner neon glow, candid compact camera blur',
    note: 'Midnight diner runs with friends. Flash snapshot on the old cyber-shot camera.',
    aspectRatio: '4:3',
    isWatermarked: true, // Example of free-tier generated entry
    year: 2026,
    month: 8,
    monthLabel: 'August 2026',
    isFavorite: true,
    modelUsed: 'gemini-3.1-flash-image',
  },
];

// Initial prompt history items
const INITIAL_PROMPTS: PromptHistoryItem[] = [
  {
    id: 'p-1',
    text: 'Wes Anderson pastel film, symmetrical composition, soft pastel yellows and dusty rose pinks, nostalgic 35mm grain',
    lastUsed: '2026-09-24T08:45:00.000Z',
    usageCount: 4,
    category: 'cinematic',
    isFavorite: true,
  },
  {
    id: 'p-2',
    text: 'Japanese watercolor wash, delicate sumi-e ink brushstrokes, soft cherry blossoms on washi paper',
    lastUsed: '2026-09-18T14:20:00.000Z',
    usageCount: 2,
    category: 'painting',
    isFavorite: true,
  },
  {
    id: 'p-3',
    text: 'Y2K digital camera flash snapshot, retro diner neon glow, candid compact camera blur',
    lastUsed: '2026-08-12T22:15:00.000Z',
    usageCount: 3,
    category: 'vintage',
    isFavorite: false,
  },
  {
    id: 'p-4',
    text: 'Claude Monet impressionist oil painting, visible rhythmic brushstrokes, dappled afternoon sunlight',
    lastUsed: '2026-08-01T11:00:00.000Z',
    usageCount: 1,
    category: 'painting',
    isFavorite: false,
  },
  {
    id: 'p-5',
    text: 'Vintage 1970s Kodachrome slide film, rich saturated reds and warm earth tones',
    lastUsed: '2026-07-20T16:30:00.000Z',
    usageCount: 2,
    category: 'analog',
    isFavorite: false,
  },
];

// Load all journal entries
export async function loadJournalEntries(): Promise<JournalEntry[]> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_ENTRIES, 'readonly');
      const store = tx.objectStore(STORE_ENTRIES);
      const req = store.getAll();

      req.onsuccess = () => {
        let entries: JournalEntry[] = req.result || [];
        if (entries.length === 0) {
          // Seed initial entries
          saveInitialEntries(INITIAL_ENTRIES);
          resolve(INITIAL_ENTRIES);
        } else {
          // Sort chronologically descending (newest first)
          entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          resolve(entries);
        }
      };

      req.onerror = () => {
        console.warn('Error reading from IndexedDB, using fallback');
        resolve(loadFallbackEntries());
      };
    });
  } catch (e) {
    console.warn('IndexedDB unavailable, using localStorage fallback', e);
    return loadFallbackEntries();
  }
}

async function saveInitialEntries(entries: JournalEntry[]): Promise<void> {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_ENTRIES, 'readwrite');
    const store = tx.objectStore(STORE_ENTRIES);
    for (const entry of entries) {
      store.put(entry);
    }
  } catch {
    saveFallbackEntries(entries);
  }
}

// Save single journal entry
export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ENTRIES, 'readwrite');
      const store = tx.objectStore(STORE_ENTRIES);
      const req = store.put(entry);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const current = loadFallbackEntries();
    const updated = [entry, ...current.filter((e) => e.id !== entry.id)];
    saveFallbackEntries(updated);
  }
}

// Delete journal entry
export async function deleteJournalEntry(id: string): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ENTRIES, 'readwrite');
      const store = tx.objectStore(STORE_ENTRIES);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const current = loadFallbackEntries();
    saveFallbackEntries(current.filter((e) => e.id !== id));
  }
}

// Fallback helpers in case IndexedDB fails
function loadFallbackEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem('muse_entries_fallback');
    if (!raw) {
      saveFallbackEntries(INITIAL_ENTRIES);
      return INITIAL_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ENTRIES;
  } catch {
    return INITIAL_ENTRIES;
  }
}

function saveFallbackEntries(entries: JournalEntry[]): void {
  try {
    localStorage.setItem('muse_entries_fallback', JSON.stringify(entries));
  } catch (err) {
    console.warn('Storage quota exceeded in fallback', err);
  }
}

// Prompt History Management
export function loadPromptHistory(): PromptHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROMPTS);
    if (!raw) {
      savePromptHistory(INITIAL_PROMPTS);
      return INITIAL_PROMPTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PROMPTS;
  } catch {
    return INITIAL_PROMPTS;
  }
}

export function savePromptHistory(prompts: PromptHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(prompts));
  } catch (err) {
    console.warn('Failed to save prompt history', err);
  }
}

export function recordUsedPrompt(promptText: string): PromptHistoryItem[] {
  const current = loadPromptHistory();
  const trimmed = promptText.trim();
  if (!trimmed) return current;

  const existingIndex = current.findIndex(
    (p) => p.text.toLowerCase() === trimmed.toLowerCase()
  );

  let updated: PromptHistoryItem[];
  if (existingIndex >= 0) {
    const item = current[existingIndex];
    const refreshed: PromptHistoryItem = {
      ...item,
      text: trimmed,
      lastUsed: new Date().toISOString(),
      usageCount: item.usageCount + 1,
    };
    updated = [refreshed, ...current.filter((_, idx) => idx !== existingIndex)];
  } else {
    const newItem: PromptHistoryItem = {
      id: `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: trimmed,
      lastUsed: new Date().toISOString(),
      usageCount: 1,
      category: 'custom',
    };
    updated = [newItem, ...current];
  }

  savePromptHistory(updated);
  return updated;
}

// User Subscription State
const DEFAULT_SUBSCRIPTION: UserSubscription = {
  tier: 'free',
  monthlyGenerationsUsed: 2, // 2 used out of 3 as requested in spec
  monthlyGenerationsLimit: 3,
  billingCycleResetDate: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
};

export function loadUserSubscription(): UserSubscription {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUB);
    if (!raw) {
      saveUserSubscription(DEFAULT_SUBSCRIPTION);
      return DEFAULT_SUBSCRIPTION;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SUBSCRIPTION, ...parsed };
  } catch {
    return DEFAULT_SUBSCRIPTION;
  }
}

export function saveUserSubscription(sub: UserSubscription): void {
  try {
    localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(sub));
  } catch (err) {
    console.warn('Failed to save user subscription', err);
  }
}

export function incrementGenerationCount(): UserSubscription {
  const sub = loadUserSubscription();
  const updated: UserSubscription = {
    ...sub,
    monthlyGenerationsUsed: sub.monthlyGenerationsUsed + 1,
  };
  saveUserSubscription(updated);
  return updated;
}
