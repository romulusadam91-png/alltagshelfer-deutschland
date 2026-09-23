import React, { useState } from 'react';
import { Language } from '../types';
import {
  X,
  Crown,
  Clock,
  CheckCircle2,
  Bell,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PREMIUM_CATEGORIES } from './PremiumSection';

interface PremiumComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  selectedCategoryName?: string;
}

export const PremiumComingSoonModal: React.FC<PremiumComingSoonModalProps> = ({
  isOpen,
  onClose,
  language,
  selectedCategoryName,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        const list = JSON.parse(localStorage.getItem('premium_notify_emails') || '[]');
        if (!list.includes(email.trim())) {
          list.push(email.trim());
          localStorage.setItem('premium_notify_emails', JSON.stringify(list));
        }
      } catch {}
      setSubscribed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-amber-200 space-y-6 relative">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/20 to-orange-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors z-10 cursor-pointer"
          aria-label="Închide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Crown className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold mb-1">
              <Clock className="w-3 h-3 text-amber-700" />
              <span>{language === 'ro' ? 'DISPONIBIL ÎN CURÂND' : 'BALD VERFÜGBAR'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AlltagsHelfer Premium
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-amber-800 font-extrabold text-lg">4,99 €</span>
              <span className="text-xs text-slate-500">
                · {language === 'ro' ? 'Modele utile pentru viața de zi cu zi în Germania' : 'Nützliche Vorlagen für den Alltag in Deutschland'}
              </span>
            </div>
          </div>
        </div>

        {/* Highlight if category selected */}
        {selectedCategoryName && (
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {language === 'ro'
                ? `Ai selectat: ${selectedCategoryName} – face parte din pachetul Premium.`
                : `Ausgewählt: ${selectedCategoryName} – Teil des Premium-Pakets.`}
            </span>
          </div>
        )}

        {/* Friendly explanation notice: No payment, coming soon */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'ro'
                ? 'Nicio plată nu este percepută în acest moment'
                : 'Derzeit fallen keinerlei Kosten an'}
            </span>
          </div>
          <p>
            {language === 'ro'
              ? 'Lucrăm cu avocați și specialiști în birocrație germană pentru a definitiva toate modelele din pachetul Premium de 4,99 €. În acest moment nu se percepe nicio taxă și nu este necesar niciun card.'
              : 'Wir finalisieren aktuell die rechtssicheren Premium-Vorlagen für 4,99 €. Aktuell ist kein Zahlungssystem aktiv und es fallen keine Kosten an.'}
          </p>
          <p className="text-emerald-700 font-semibold pt-1">
            {language === 'ro'
              ? '✓ Toate funcționalitățile actuale ale aplicației rămân complet gratuite!'
              : '✓ Alle bisherigen Funktionen der App bleiben weiterhin vollkommen kostenlos!'}
          </p>
        </div>

        {/* 10 Categories List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {language === 'ro'
              ? 'Cele 10 categorii incluse în pachetul de 4,99 €:'
              : 'Enthaltene Kategorien im 4,99 € Paket:'}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-800">
            {PREMIUM_CATEGORIES.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-50/50 border border-amber-200/60 font-medium"
              >
                <span className="text-amber-600 font-bold text-[10px]">★</span>
                <span className="truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Notification input */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
            <Bell className="w-4 h-4 text-amber-700" />
            <span>
              {language === 'ro'
                ? 'Vrei să fii anunțat la lansarea pachetului Premium?'
                : 'Möchten Sie bei Veröffentlichung benachrichtigt werden?'}
            </span>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-white p-2.5 rounded-xl border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'ro'
                  ? 'Mulțumim! Vei fi primul anunțat când pachetul este gata.'
                  : 'Vielen Dank! Wir informieren Sie sobald die Vorlagen verfügbar sind.'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  language === 'ro' ? 'Adresa ta de e-mail...' : 'Ihre E-Mail-Adresse...'
                }
                className="flex-1 bg-white text-xs px-3 py-2 rounded-xl border border-amber-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                {language === 'ro' ? 'Trimite' : 'Senden'}
              </button>
            </form>
          )}
        </div>

        {/* Action button to dismiss */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer"
        >
          {language === 'ro' ? 'Am înțeles, închide' : 'Verstanden, schließen'}
        </button>
      </div>
    </div>
  );
};
