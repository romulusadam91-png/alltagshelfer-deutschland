import React from 'react';
import { Language } from '../types';
import { t } from '../data/translations';
import { Languages, Crown, User, FileText, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isPremium: boolean;
  onOpenPremiumModal: () => void;
  onOpenProfileModal: () => void;
  onResetToHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isPremium,
  onOpenPremiumModal,
  onOpenProfileModal,
  onResetToHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <button
          onClick={onResetToHome}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg py-1 transition-transform active:scale-98"
          title="AlltagsHelfer Deutschland"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                AlltagsHelfer
              </span>
              <span className="bg-red-50 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-red-200">
                DE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
              {language === 'ro' ? 'Scrisori oficiale în Germania' : 'Offizielle Briefe für Deutschland'}
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Romanian / German Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => onLanguageChange('ro')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                language === 'ro'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Comută în limba Română"
            >
              <span className="text-xs">🇷🇴</span>
              <span>RO</span>
            </button>
            <button
              onClick={() => onLanguageChange('de')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                language === 'de'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Auf Deutsch wechseln"
            >
              <span className="text-xs">🇩🇪</span>
              <span>DE</span>
            </button>
          </div>

          {/* Profile / Saved Address button */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors border border-slate-200/80"
            title={language === 'ro' ? 'Datele mele salvate' : 'Meine Absenderdaten'}
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">
              {language === 'ro' ? 'Profilul meu' : 'Mein Profil'}
            </span>
          </button>

          {/* Free vs Premium Badge/Trigger */}
          <button
            onClick={onOpenPremiumModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
              isPremium
                ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {isPremium ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>PREMIUM</span>
              </>
            ) : (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'ro' ? 'Deblochează PRO' : 'PRO freischalten'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
