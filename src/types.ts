export type AspectRatio = '4:3' | '1:1' | '16:9' | '3:4';

export interface JournalEntry {
  id: string;
  createdAt: string; // ISO string
  originalImageUrl: string;
  stylizedImageUrl: string;
  prompt: string;
  note?: string;
  aspectRatio: AspectRatio;
  isWatermarked: boolean;
  year: number;
  month: number; // 1-12
  monthLabel: string; // e.g. "September 2026"
  isFavorite?: boolean;
  modelUsed?: string;
}

export interface PromptHistoryItem {
  id: string;
  text: string;
  lastUsed: string;
  usageCount: number;
  category?: 'cinematic' | 'painting' | 'vintage' | 'digital' | 'analog' | 'custom';
  isFavorite?: boolean;
}

export type SubscriptionTier = 'free' | 'premium';

export interface UserSubscription {
  tier: SubscriptionTier;
  monthlyGenerationsUsed: number;
  monthlyGenerationsLimit: number; // 3 for free, 9999 for premium
  billingCycleResetDate: string; // ISO date
  subscribedAt?: string;
  planPeriod?: 'monthly' | 'annual';
}

export type ExportLayout = 'stylized-only' | 'polaroid-card' | 'before-after-diptych';

export interface StylePreset {
  id: string;
  name: string;
  prompt: string;
  category: 'Cinematic' | 'Painting' | 'Vintage' | 'Digital';
  icon: string;
  description: string;
}
