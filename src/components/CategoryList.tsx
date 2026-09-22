import React from 'react';
import { Category, CategoryKey, Language } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  FileX,
  Home,
  HeartPulse,
  GraduationCap,
  Wifi,
  Briefcase,
  Building2,
  CreditCard,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface CategoryListProps {
  language: Language;
  onSelectCategory: (catId: CategoryKey) => void;
  onOpenTips: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  FileX,
  Home,
  HeartPulse,
  GraduationCap,
  Wifi,
  Briefcase,
  Building2,
  CreditCard,
  Sparkles,
};

export const CategoryList: React.FC<CategoryListProps> = ({
  language,
  onSelectCategory,
  onOpenTips,
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle background graphic */}
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>
              {language === 'ro'
                ? 'Standard oficial DIN 5008 · Fără bătăi de cap'
                : 'Offizieller DIN 5008 Standard · Rechtssicher'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-snug">
            {language === 'ro'
              ? 'Generează scrisori oficiale în limba germană în 2 minute'
              : 'Offizielle deutsche Briefe in 2 Minuten erstellen'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
            {language === 'ro'
              ? 'Scapă de frica birocrației germane. Răspunzi la câteva întrebări simple în limba română, iar aplicația compune scrisoarea oficială perfectă în germană, gata de copiat sau descărcat ca PDF.'
              : 'Wählen Sie Ihren Anlass, beantworten Sie wenige Fragen und erhalten Sie ein fertiges Anschreiben gemäß deutschen Behörden- und Geschäftsstandards.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {language === 'ro' ? 'Descărcare PDF A4 instant' : 'Sofortiger PDF-Download'}
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span>
              {language === 'ro' ? 'Modele de documente în limba germană' : 'Musterdokumente auf Deutsch'}
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <button
              onClick={onOpenTips}
              className="text-blue-300 hover:text-blue-200 underline font-medium cursor-pointer"
            >
              {language === 'ro' ? 'Ghidul poștal pentru Germania' : 'Ratgeber für Behördenpost'}
            </button>
          </div>
        </div>
      </div>

      {/* Categories Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {language === 'ro' ? 'Alege categoria dorită' : 'Wählen Sie eine Kategorie'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ro'
              ? 'Selectează tipul de document de care ai nevoie astăzi'
              : 'Übersicht aller verfügbaren Musterschreiben'}
          </p>
        </div>
      </div>

      {/* 9 Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.iconName] || Sparkles;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group text-left p-4 sm:p-5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400/80 hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-blue-600 bg-slate-100 group-hover:bg-blue-50 px-2 py-0.5 rounded-full transition-colors">
                    {cat.count} {language === 'ro' ? 'modele' : 'Vorlagen'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors mb-1.5 leading-snug">
                  {cat.title[language]}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {cat.description[language]}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <span>{language === 'ro' ? 'Vezi scrisorile' : 'Vorlagen ansehen'}</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
