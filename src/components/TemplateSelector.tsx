import React, { useState, useMemo } from 'react';
import { CategoryKey, Language, LetterTemplate } from '../types';
import { CATEGORIES } from '../data/categories';
import { getTemplatesByCategory } from '../data/templates';
import {
  ArrowLeft,
  Search,
  Crown,
  FileText,
  ChevronRight,
  Info,
  Lightbulb,
} from 'lucide-react';

interface TemplateSelectorProps {
  categoryId: CategoryKey;
  language: Language;
  isPremium: boolean;
  onSelectTemplate: (template: LetterTemplate) => void;
  onBack: () => void;
  onOpenPremiumModal: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  categoryId,
  language,
  isPremium,
  onSelectTemplate,
  onBack,
  onOpenPremiumModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium'>('all');

  const category = useMemo(() => {
    return CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  }, [categoryId]);

  const rawTemplates = useMemo(() => {
    return getTemplatesByCategory(categoryId);
  }, [categoryId]);

  const filteredTemplates = useMemo(() => {
    return rawTemplates.filter((t) => {
      // Filter by free/premium
      if (filterType === 'free' && t.isPremium) return false;
      if (filterType === 'premium' && !t.isPremium) return false;

      // Filter by search keyword
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();

      const titleRo = t.title.ro.toLowerCase();
      const titleDe = t.title.de.toLowerCase();
      const descRo = t.shortDescription.ro.toLowerCase();
      const descDe = t.shortDescription.de.toLowerCase();

      return (
        titleRo.includes(term) ||
        titleDe.includes(term) ||
        descRo.includes(term) ||
        descDe.includes(term)
      );
    });
  }, [rawTemplates, filterType, searchTerm]);

  return (
    <div className="space-y-5">
      {/* Back button and Category header */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-3 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{language === 'ro' ? 'Înapoi la toate categoriile' : 'Zurück zur Übersicht'}</span>
        </button>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                {language === 'ro' ? 'Categorie curentă' : 'Aktuelle Kategorie'}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {category.title[language]}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {category.description[language]}
              </p>
            </div>
            <div className="self-start sm:self-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
              {rawTemplates.length} {language === 'ro' ? 'modele disponibile' : 'Vorlagen verfügbar'}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'ro'
                ? 'Caută în această categorie (ex: termen, reziliere)...'
                : 'In dieser Kategorie suchen...'
            }
            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'ro' ? 'Toate' : 'Alle'}
          </button>
          <button
            onClick={() => setFilterType('free')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'free'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'ro' ? 'Standard' : 'Standard'}
          </button>
          <button
            onClick={() => setFilterType('premium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              filterType === 'premium'
                ? 'bg-white text-amber-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3 h-3 text-amber-500" />
            <span>PRO</span>
          </button>
        </div>
      </div>

      {/* Templates List */}
      {filteredTemplates.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">
            {language === 'ro'
              ? 'Niciun model găsit pentru căutarea ta'
              : 'Keine Vorlagen gefunden'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'ro'
              ? 'Încearcă un alt cuvânt cheie sau resetează filtrele.'
              : 'Versuchen Sie einen anderen Suchbegriff.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
          >
            {language === 'ro' ? 'Resetează filtrele' : 'Filter zurücksetzen'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTemplates.map((template) => {
            const isLocked = template.isPremium && !isPremium;

            return (
              <div
                key={template.id}
                className="group relative bg-white border border-slate-200/90 hover:border-blue-400/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </span>

                      {template.isPremium && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                          <span>PRO</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 font-medium">
                        DIN 5008 Standard
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-700 transition-colors">
                      {template.title[language]}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {template.shortDescription[language]}
                    </p>

                    {/* Bureaucratic practical tip box */}
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-2 text-xs text-amber-950">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <span className="font-semibold text-amber-900">
                          {language === 'ro' ? 'Sfat practic în Germania: ' : 'Praxis-Tipp: '}
                        </span>
                        <span className="text-amber-900/90">{template.bureaucraticTip[language]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="sm:self-center shrink-0 mt-2 sm:mt-0">
                    {isLocked ? (
                      <button
                        onClick={onOpenPremiumModal}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-xs hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>{language === 'ro' ? 'Deblochează PRO' : 'Freischalten'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectTemplate(template)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 active:scale-98 transition-all cursor-pointer"
                      >
                        <span>{language === 'ro' ? 'Completează scrisoarea' : 'Brief ausfüllen'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
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
