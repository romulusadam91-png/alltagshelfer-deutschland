import React, { useState, useEffect } from 'react';
import {
  CategoryKey,
  GeneratedDocument,
  Language,
  LetterTemplate,
  SenderProfile,
} from './types';
import { Header } from './components/Header';
import { CategoryList } from './components/CategoryList';
import { TemplateSelector } from './components/TemplateSelector';
import { LetterWizard } from './components/LetterWizard';
import { LetterPreview } from './components/LetterPreview';
import { SenderProfileModal } from './components/SenderProfileModal';
import { PremiumModal } from './components/PremiumModal';
import { PremiumComingSoonModal } from './components/PremiumComingSoonModal';
import { TipsModal } from './components/TipsModal';
import { ShieldCheck, Heart, FileText, Send, Sparkles } from 'lucide-react';

export default function App() {
  // Language state (default Romanian as requested for Romanian speakers in Germany)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('alltagshelfer_lang');
      return saved === 'de' ? 'de' : 'ro';
    } catch {
      return 'ro';
    }
  });

  // Premium state
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    try {
      return localStorage.getItem('alltagshelfer_is_premium') === 'true';
    } catch {
      return false;
    }
  });

  // Saved sender profile
  const [savedSender, setSavedSender] = useState<SenderProfile>(() => {
    try {
      const data = localStorage.getItem('alltagshelfer_sender_profile');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return {
      fullName: '',
      street: '',
      postalCode: '',
      city: '',
      phone: '',
      email: '',
    };
  });

  // Navigation state
  const [currentView, setCurrentView] = useState<'categories' | 'templates' | 'wizard' | 'preview'>('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryKey | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [selectedPremiumCategoryName, setSelectedPremiumCategoryName] = useState<string | undefined>(undefined);

  const handleOpenComingSoon = (categoryName?: string) => {
    setSelectedPremiumCategoryName(categoryName);
    setIsComingSoonModalOpen(true);
  };

  // Persist language change
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('alltagshelfer_lang', lang);
    } catch {}
  };

  // Toggle Premium
  const handleTogglePremium = () => {
    const next = !isPremium;
    setIsPremium(next);
    try {
      localStorage.setItem('alltagshelfer_is_premium', String(next));
    } catch {}
  };

  // Save sender profile
  const handleSaveSender = (profile: SenderProfile) => {
    setSavedSender(profile);
    try {
      localStorage.setItem('alltagshelfer_sender_profile', JSON.stringify(profile));
    } catch {}
  };

  // Navigation handlers
  const handleSelectCategory = (catId: CategoryKey) => {
    setSelectedCategoryId(catId);
    setCurrentView('templates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTemplate = (template: LetterTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDocumentGenerated = (doc: GeneratedDocument) => {
    setGeneratedDoc(doc);
    setCurrentView('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToHome = () => {
    setCurrentView('categories');
    setSelectedCategoryId(null);
    setSelectedTemplate(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        isPremium={isPremium}
        onOpenPremiumModal={() => handleOpenComingSoon()}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onResetToHome={handleResetToHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentView === 'categories' && (
          <CategoryList
            language={language}
            onSelectCategory={handleSelectCategory}
            onOpenTips={() => setIsTipsModalOpen(true)}
            onOpenPremiumComingSoon={handleOpenComingSoon}
          />
        )}

        {currentView === 'templates' && selectedCategoryId && (
          <TemplateSelector
            categoryId={selectedCategoryId}
            language={language}
            isPremium={isPremium}
            onSelectTemplate={handleSelectTemplate}
            onBack={() => setCurrentView('categories')}
            onOpenPremiumModal={() => handleOpenComingSoon()}
          />
        )}

        {currentView === 'wizard' && selectedTemplate && (
          <LetterWizard
            template={selectedTemplate}
            language={language}
            savedSender={savedSender}
            onSaveSender={handleSaveSender}
            onGenerate={handleDocumentGenerated}
            onBack={() => setCurrentView('templates')}
          />
        )}

        {currentView === 'preview' && generatedDoc && selectedTemplate && (
          <LetterPreview
            document={generatedDoc}
            template={selectedTemplate}
            language={language}
            isPremium={isPremium}
            onBackToEdit={() => setCurrentView('wizard')}
            onOpenPremiumModal={() => handleOpenComingSoon()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 no-print">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">
              AlltagsHelfer Deutschland © {new Date().getFullYear()}
            </p>
            <p className="max-w-md text-[11px] leading-relaxed">
              {language === 'ro'
                ? 'Creat special pentru comunitatea românească din Germania. Modele administrative standard conform DIN 5008.'
                : 'Erstellt für den alltäglichen bürokratischen Schriftverkehr in Deutschland gemäß DIN 5008.'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsTipsModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              {language === 'ro' ? 'Ghid poștal & termene' : 'Post-Ratgeber'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-slate-600 hover:text-slate-800 font-medium cursor-pointer"
            >
              {language === 'ro' ? 'Profil expeditor' : 'Absenderprofil'}
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenComingSoon()}
              className="text-amber-600 hover:text-amber-700 font-bold cursor-pointer"
            >
              {language === 'ro' ? '⭐ Premium 4,99 €' : '⭐ Premium 4,99 €'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SenderProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        language={language}
        initialProfile={savedSender}
        onSave={handleSaveSender}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        language={language}
        isPremium={isPremium}
        onTogglePremium={handleTogglePremium}
      />

      <PremiumComingSoonModal
        isOpen={isComingSoonModalOpen}
        onClose={() => setIsComingSoonModalOpen(false)}
        language={language}
        selectedCategoryName={selectedPremiumCategoryName}
      />

      <TipsModal
        isOpen={isTipsModalOpen}
        onClose={() => setIsTipsModalOpen(false)}
        language={language}
      />
    </div>
  );
}
