import React, { useState } from 'react';
import { Language } from '../types';
import {
  Dumbbell,
  ShieldCheck,
  Smartphone,
  Key,
  Home,
  Briefcase,
  HeartPulse,
  GraduationCap,
  Building2,
  Landmark,
  Crown,
  Sparkles,
  Check,
  Clock,
  Star,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface PremiumSectionProps {
  language: Language;
  onOpenComingSoon: (categoryName?: string) => void;
}

interface PremiumCategoryItem {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  descriptionRo: string;
  descriptionDe: string;
  badgeRo: string;
  badgeDe: string;
}

export const PREMIUM_CATEGORIES: PremiumCategoryItem[] = [
  {
    id: 'fitness',
    name: 'Kündigung Fitnessstudio',
    icon: Dumbbell,
    descriptionRo: 'Reziliere abonament sală de sport, clauze mutare sau motive medicale',
    descriptionDe: 'Kündigung Fitnessstudio, Sonderkündigung bei Umzug oder Attest',
    badgeRo: 'Reziliere',
    badgeDe: 'Kündigung',
  },
  {
    id: 'versicherung',
    name: 'Kündigung Versicherung',
    icon: ShieldCheck,
    descriptionRo: 'Reziliere asigurare auto (KFZ), răspundere civilă (Haftpflicht), reziliere la scumpire',
    descriptionDe: 'Kündigung KFZ-, Haftpflicht- oder Hausratversicherung bei Preiserhöhung',
    badgeRo: 'Asigurări',
    badgeDe: 'Versicherung',
  },
  {
    id: 'internet_handy',
    name: 'Kündigung Internet & Handy',
    icon: Smartphone,
    descriptionRo: 'Reziliere contracte internet DSL/fibră, telefonie mobilă, Sonderkündigung la relocare',
    descriptionDe: 'Vertragskündigung DSL/Mobilfunk, Sonderkündigungsrecht nach TKG',
    badgeRo: 'Telecom',
    badgeDe: 'Telecom',
  },
  {
    id: 'mietvertrag',
    name: 'Kündigung Mietvertrag',
    icon: Key,
    descriptionRo: 'Reziliere oficială contract închiriere locuință conform § 573c BGB cu predare chei',
    descriptionDe: 'Fristgerechte Kündigung des Mietvertrags gemäß § 573c BGB',
    badgeRo: 'Locuință',
    badgeDe: 'Wohnung',
  },
  {
    id: 'vermieter',
    name: 'Vermieter',
    icon: Home,
    descriptionRo: 'Cerere returnare garanție (Mietkaution), notificare mucegai și reducere chirie',
    descriptionDe: 'Kautionsrückforderung, Mängelanzeige & Mietminderungsankündigung',
    badgeRo: 'Proprietar',
    badgeDe: 'Vermieter',
  },
  {
    id: 'arbeitgeber',
    name: 'Arbeitgeber',
    icon: Briefcase,
    descriptionRo: 'Cerere concediu, solicitare adeverință de muncă (Arbeitszeugnis), salarii restante',
    descriptionDe: 'Urlaubsantrag, qualifiziertes Arbeitszeugnis, Geltendmachung von Lohnansprüchen',
    badgeRo: 'Muncă',
    badgeDe: 'Arbeit',
  },
  {
    id: 'krankenkasse',
    name: 'Krankenkasse',
    icon: HeartPulse,
    descriptionRo: 'Cerere scutire coplată (Zuzahlungsbefreiung), adeverință concediu îngrijire copil',
    descriptionDe: 'Zuzahlungsbefreiung, Kinderkrankengeld, Wechsel der Krankenkasse',
    badgeRo: 'Sănătate',
    badgeDe: 'Gesundheit',
  },
  {
    id: 'schule',
    name: 'Kita & Schule',
    icon: GraduationCap,
    descriptionRo: 'Motivare absențe școlare, cerere scutire ore (Beurlaubung), înscriere la grădiniță',
    descriptionDe: 'Entschuldigungsschreiben, Beurlaubungsantrag und Kitaplatz-Kommunikation',
    badgeRo: 'Educație',
    badgeDe: 'Bildung',
  },
  {
    id: 'behoerden',
    name: 'Behörden',
    icon: Building2,
    descriptionRo: 'Contestații oficiale (Widerspruch) Jobcenter, Bürgeramt, Familienkasse, Finanzamt',
    descriptionDe: 'Rechtswirksame Widersprüche für Jobcenter, Familienkasse und Finanzamt',
    badgeRo: 'Autorități',
    badgeDe: 'Behörden',
  },
  {
    id: 'bank',
    name: 'Bank',
    icon: Landmark,
    descriptionRo: 'Închidere cont bancar (Girokonto), refuz taxe neautorizate, actualizare adresă',
    descriptionDe: 'Kontokündigung, Erstattung unberechtigter Gebühren, Stammdatenänderung',
    badgeRo: 'Finanțe',
    badgeDe: 'Finanzen',
  },
];

export const PremiumSection: React.FC<PremiumSectionProps> = ({
  language,
  onOpenComingSoon,
}) => {
  return (
    <section className="mt-12 rounded-3xl border-2 border-amber-300/80 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 p-6 sm:p-8 lg:p-10 shadow-lg shadow-amber-500/5 relative overflow-hidden">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-gradient-to-br from-amber-400/15 via-orange-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-72 h-72 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header section with Title, Subtitle, and Price */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-amber-200/80">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
            <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>PACHET COMPLET · ALL-IN-ONE</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              AlltagsHelfer Premium
            </h2>
            <div className="inline-flex items-baseline gap-1.5 px-3 py-1 bg-amber-100/80 border border-amber-300/70 rounded-xl shadow-xs">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-800">
                4,99 €
              </span>
              <span className="text-xs font-semibold text-amber-700">
                {language === 'ro' ? 'acces complet' : 'einmalig'}
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-700 leading-snug">
            {language === 'ro'
              ? 'Modele utile pentru viața de zi cu zi în Germania'
              : 'Nützliche Vorlagen für den Alltag in Deutschland'}
          </p>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {language === 'ro'
              ? 'Formulări juridice avansate, clauze conforme cu legislația BGB & TKG și documente fără filigran, gata de semnat și trimis prin poștă sau e-mail.'
              : 'Rechtssichere Musterschreiben für die wichtigsten bürokratischen Angelegenheiten in Deutschland, ohne Wasserzeichen und sofort einsatzbereit.'}
          </p>
        </div>

        {/* Clear Action Button as requested */}
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <button
            onClick={() => onOpenComingSoon()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-base sm:text-lg shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 border border-amber-400"
          >
            <span>
              {language === 'ro' ? '⭐ Vezi Premium – 4,99 €' : '⭐ Premium ansehen – 4,99 €'}
            </span>
          </button>
          <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            {language === 'ro'
              ? 'În curând · Fără plată în acest moment'
              : 'Demnächst verfügbar · Keine Kosten derzeit'}
          </span>
        </div>
      </div>

      {/* 10 Premium Categories Grid */}
      <div className="relative z-10 mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {language === 'ro'
                ? 'Cele 10 categorii de documente Premium incluse:'
                : 'Die 10 enthaltenen Premium-Dokumentenkategorien:'}
            </span>
          </h3>
          <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
            10 {language === 'ro' ? 'categorii' : 'Kategorien'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
          {PREMIUM_CATEGORIES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onOpenComingSoon(item.name)}
                className="group relative flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-900 transition-colors truncate">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-sm shrink-0">
                      {language === 'ro' ? item.badgeRo : item.badgeDe}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                    {language === 'ro' ? item.descriptionRo : item.descriptionDe}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature perks banner */}
      <div className="relative z-10 mt-8 p-4 sm:p-5 rounded-2xl bg-white/80 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'ro' ? 'Format standard DIN 5008' : 'DIN 5008 Standard'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'ro' ? 'Descărcare PDF fără filigran' : 'PDF ohne Wasserzeichen'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'ro' ? 'Formulări juridice verificate' : 'Rechtssichere Klauseln'}</span>
          </div>
        </div>

        <button
          onClick={() => onOpenComingSoon()}
          className="w-full sm:w-auto text-xs font-bold text-amber-900 hover:text-amber-950 underline flex items-center justify-center gap-1 cursor-pointer shrink-0"
        >
          <span>{language === 'ro' ? 'Află mai multe despre pachet' : 'Mehr erfahren'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
