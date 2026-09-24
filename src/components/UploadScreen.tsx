import React, { useState, useRef, useEffect } from 'react';
import { PromptHistoryItem, StylePreset, UserSubscription } from '../types';
import { STYLE_PRESETS } from '../data/presets';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Camera,
  X,
  History,
  Crown,
  ChevronRight,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react';

interface UploadScreenProps {
  subscription: UserSubscription;
  promptHistory: PromptHistoryItem[];
  prefilledPrompt?: string;
  onGenerateSuccess: (entryData: {
    originalImageUrl: string;
    stylizedImageUrl: string;
    prompt: string;
    note?: string;
    isWatermarked: boolean;
  }) => void;
  onOpenUpgradeModal: () => void;
  onOpenQuotaModal?: () => void;
  onClearPrefilledPrompt?: () => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  subscription,
  promptHistory,
  prefilledPrompt = '',
  onGenerateSuccess,
  onOpenUpgradeModal,
  onOpenQuotaModal,
  onClearPrefilledPrompt,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [promptText, setPromptText] = useState<string>(prefilledPrompt);
  const [journalNote, setJournalNote] = useState<string>('');
  const [styleIntensity, setStyleIntensity] = useState<number>(85);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync prefilled prompt if passed
  useEffect(() => {
    if (prefilledPrompt) {
      setPromptText(prefilledPrompt);
    }
  }, [prefilledPrompt]);

  const isPro = subscription.tier === 'premium';
  const remainingGenerations = Math.max(0, subscription.monthlyGenerationsLimit - subscription.monthlyGenerationsUsed);
  const isQuotaReached = !isPro && remainingGenerations <= 0;

  // Handle file input
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, HEIC, etc.)');
      return;
    }
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Sample photos for immediate testing
  const SAMPLE_PHOTOS = [
    {
      name: 'Cafe & Journal',
      url: '/src/assets/images/muse_sample_original_photo_1790246330140.jpg',
      label: 'Candid Cafe',
    },
    {
      name: 'Paris Facade',
      url: '/src/assets/images/muse_sample_wes_anderson_1790246296364.jpg',
      label: 'City Architecture',
    },
    {
      name: 'Water Lilies',
      url: '/src/assets/images/muse_sample_watercolor_1790246307952.jpg',
      label: 'Garden Nature',
    },
  ];

  // Quick preset click
  const handleSelectPreset = (preset: StylePreset) => {
    setPromptText(preset.prompt);
  };

  // Quick prompt history click
  const handleSelectHistoryPrompt = (historyText: string) => {
    setPromptText(historyText);
  };

  // Start Generation
  const handleGenerate = async () => {
    if (!photoUrl) {
      setErrorMessage('Please upload or select a photo first');
      return;
    }
    if (!promptText.trim()) {
      setErrorMessage('Please describe an AI art style in the text prompt');
      return;
    }
    if (isQuotaReached) {
      if (onOpenQuotaModal) {
        onOpenQuotaModal();
      } else {
        onOpenUpgradeModal();
      }
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep('Preparing photo...');

    try {
      // Step 1: Call server API
      setGenerationStep('Analyzing composition & palette...');
      await new Promise((r) => setTimeout(r, 600));

      setGenerationStep('Applying art style transformation...');

      let finalStylizedUrl: string | null = null;
      let usedModel = 'gemini-3.1-flash-image';

      try {
        const response = await fetch('/api/generate-style', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: photoUrl,
            prompt: promptText.trim(),
            styleStrength: styleIntensity,
          }),
        });

        const data = await response.json();
        if (data.success && data.imageUrl) {
          finalStylizedUrl = data.imageUrl;
          usedModel = data.model || 'gemini-3.1-flash-image';
        }
      } catch (networkErr) {
        console.warn('Backend call encountered error, using fallback art engine:', networkErr);
      }

      // If server returned fallback or failed, use client-side neural canvas art filter
      if (!finalStylizedUrl) {
        setGenerationStep('Synthesizing artistic textures & tone curves...');
        const { applyArtisticFilter } = await import('../utils/neuralCanvasFilter');
        finalStylizedUrl = await applyArtisticFilter(photoUrl, promptText.trim(), styleIntensity);
      }

      setGenerationStep('Finalizing your journal entry...');
      await new Promise((r) => setTimeout(r, 400));

      // Hand off to parent
      onGenerateSuccess({
        originalImageUrl: photoUrl,
        stylizedImageUrl: finalStylizedUrl,
        prompt: promptText.trim(),
        note: journalNote.trim() || undefined,
        isWatermarked: !isPro, // Watermarked if free tier
      });
    } catch (err: any) {
      console.error('Style generation failed:', err);
      setErrorMessage(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-28 px-4 pt-3 max-w-md mx-auto w-full">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
        }}
      />

      {/* Tier Quota Notice Banner */}
      {!isPro ? (
        remainingGenerations <= 0 ? (
          <div className="bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/35 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-100">
                  0 of 3 generations left this month
                </span>
                <span className="text-[11px] text-amber-300">
                  Upgrade to Premium — from €4.49/month
                </span>
              </div>
            </div>
            <button
              onClick={onOpenQuotaModal || onOpenUpgradeModal}
              className="text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <span>View Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-zinc-300">
                Monthly Generations:{' '}
                <strong className="text-amber-400 tabular-nums">
                  {remainingGenerations} of 3 left
                </strong>
              </span>
            </div>
            <button
              onClick={onOpenUpgradeModal}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
            >
              From €4.49/mo
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300">
              Muse Pro · Unlimited Generations & High-Res
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">No Watermark</span>
        </div>
      )}

      {/* Section 1: Upload or Select Photo */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>1. Select Photo</span>
          {photoUrl && (
            <button
              onClick={() => setPhotoUrl(null)}
              className="text-[11px] font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Change Photo
            </button>
          )}
        </label>

        {photoUrl ? (
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-zinc-700/80 bg-zinc-900 group">
            <img
              src={photoUrl}
              alt="Uploaded preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-zinc-900/90 text-zinc-100 text-xs font-medium border border-zinc-700"
              >
                Upload Different
              </button>
            </div>
            <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[11px] text-zinc-300">
              Original Photo
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {/* Primary Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
              }}
              className="border-2 border-dashed border-zinc-700/80 hover:border-amber-500/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-amber-400">
                <Upload className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-zinc-200">
                  Tap to upload a personal photo
                </span>
                <span className="text-[11px] text-zinc-500">
                  Camera roll, JPG, PNG or HEIC
                </span>
              </div>

              {/* Mobile Camera Option */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Take Photo</span>
                </button>
              </div>
            </div>

            {/* Quick Sample Photos Bar for Instant Demo */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[11px] text-zinc-500 font-medium">
                Or try with sample photos:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoUrl(sample.url)}
                    className="flex flex-col items-center gap-1 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all text-left overflow-hidden group cursor-pointer"
                  >
                    <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-zinc-800">
                      <img
                        src={sample.url}
                        alt={sample.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 truncate w-full px-1 text-center">
                      {sample.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: AI Art Style Text Prompt Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Describe AI Art Style</span>
          </label>
          {promptText && (
            <button
              onClick={() => {
                setPromptText('');
                onClearPrefilledPrompt?.();
              }}
              className="text-[11px] text-zinc-500 hover:text-zinc-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Textarea for Custom Style Prompt */}
        <div className="relative">
          <textarea
            rows={3}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="e.g. 'Wes Anderson pastel film', 'Japanese watercolor', 'Y2K digital camera'..."
            className="w-full p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition-colors resize-none leading-relaxed font-editorial italic text-[14px]"
          />
        </div>

        {/* Quick Reuse History Prompts (if any exist) */}
        {promptHistory.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 font-medium">
                <History className="w-3 h-3 text-amber-400" />
                Previously used styles (1-tap reuse):
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none no-scrollbar">
              {promptHistory.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectHistoryPrompt(item.text)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                    promptText === item.text
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700'
                  }`}
                >
                  {item.text.length > 32 ? `${item.text.substring(0, 32)}...` : item.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Style Inspiration Preset Chips */}
        <div className="flex flex-col gap-1.5 pt-2">
          <span className="text-[11px] text-zinc-500 font-medium">
            Or choose a style inspiration:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STYLE_PRESETS.map((preset) => {
              const isSelected = promptText === preset.prompt;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 3: Optional Journal Note / Reflection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          3. Journal Reflection <span className="text-zinc-600 font-normal lowercase">(optional)</span>
        </label>
        <input
          type="text"
          value={journalNote}
          onChange={(e) => setJournalNote(e.target.value)}
          placeholder="Where was this? What did you feel in this moment?"
          className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
        />
      </div>

      {/* Section 4: Style Intensity Slider */}
      <div className="flex flex-col gap-2 bg-zinc-900/60 border border-zinc-800/60 p-3.5 rounded-xl">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300 font-medium flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
            Style Intensity
          </span>
          <span className="text-amber-400 font-mono text-[11px] tabular-nums">
            {styleIntensity}%
          </span>
        </div>
        <input
          type="range"
          min="40"
          max="100"
          step="5"
          value={styleIntensity}
          onChange={(e) => setStyleIntensity(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>Subtle Nuance</span>
          <span>Balanced</span>
          <span>Expressive & Bold</span>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full h-13 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
            isQuotaReached
              ? 'bg-zinc-800 text-zinc-400 border border-zinc-700/80'
              : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/15'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2 text-zinc-950">
              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              <span>{generationStep || 'Developing AI Artwork...'}</span>
            </div>
          ) : isQuotaReached ? (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Upgrade to Premium — from €4.49/month</span>
              </div>
              <span className="text-[10px] text-zinc-400">
                Monthly limit reached (3/3 used) · View Plan
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>
                {isPro ? 'Generate Artwork (Unlimited)' : `Generate (${remainingGenerations}/3 Left)`}
              </span>
            </div>
          )}
        </button>

        {/* Free tier explanation note */}
        {!isPro && (
          <p className="text-[11px] text-zinc-500 text-center">
            Free tier includes 3 generations per month with subtle Muse signature.
          </p>
        )}
      </div>

      {/* Modal / Overlay while Generating */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-editorial text-2xl italic font-semibold text-zinc-100 mb-2">
            Developing Memory
          </h3>
          <p className="text-xs text-zinc-300 max-w-xs leading-relaxed mb-6 font-mono">
            {generationStep}
          </p>
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="w-full h-full bg-amber-500 animate-shimmer" />
          </div>
        </div>
      )}
    </div>
  );
};
