import React from 'react';
import { Language } from '../types';
import { Crown, Check, X, Sparkles, Shield, Zap } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isPremium: boolean;
  onTogglePremium: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  language,
  isPremium,
  onTogglePremium,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
        {/* Glow badge */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/20 to-orange-400/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Crown className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              <span>AlltagsHelfer Premium · 4,99 €</span>
            </div>
            <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              {language === 'ro'
                ? 'Modele utile pentru viața de zi cu zi în Germania'
                : 'Nützliche Vorlagen für den Alltag in Deutschland'}
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {language === 'ro'
            ? 'Versiunea Gratuită include deja modelele esențiale pentru viața de zi cu zi. Pachetul PRO deblochează formulări juridice complexe pentru situații administrative critice.'
            : 'Die kostenlose Version deckt alle Standardbriefe ab. Das PRO-Paket schaltet erweiterte Rechtsvorlagen und zusätzliche Funktionen frei.'}
        </p>

        {/* Feature comparison */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>{language === 'ro' ? 'Ce primești cu modul Premium:' : 'Premium-Vorteile:'}</span>
              <span className="text-amber-600 font-extrabold">PRO</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'ro'
                    ? 'Contestații juridice oficiale (Widerspruch împotriva Jobcenter, Familienkasse, Finanzamt)'
                    : 'Rechtssichere Widersprüche gegen Behördenbescheide (Jobcenter, Finanzamt)'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'ro'
                    ? 'Reduceri de chirie (Mietminderung) și notificări pentru salarii restante'
                    : 'Mietminderungsankündigungen und Lohnnachforderungen'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'ro'
                    ? 'Descărcare PDF A4 curat, 100% fără inscripții sau filigran'
                    : 'Saubere A4-PDFs ohne Wasserzeichen, sofort versandbereit'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'ro'
                    ? 'Reziliere extraordinară (Sonderkündigung) la scumpiri și relocare'
                    : 'Sonderkündigungen nach TKG und BGB'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Instant Free Activation (No credit card needed) */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>
              {language === 'ro'
                ? 'Testare fără plată (Activare Instantanee)'
                : 'Kostenlose Testaktivierung (Sofort verfügbar)'}
            </span>
          </div>
          <p className="text-xs text-amber-900/90 leading-snug">
            {language === 'ro'
              ? 'Conform cerințelor de configurare, nu este necesară nicio plată sau card bancar! Poți activa sau dezactiva modul Premium oricând cu un singur clic.'
              : 'Keine Zahlungsdaten erforderlich. Sie können die Premium-Funktionen jederzeit sofort testen.'}
          </p>
        </div>

        {/* Toggle button */}
        <div className="pt-1">
          <button
            onClick={() => {
              onTogglePremium();
              onClose();
            }}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer ${
              isPremium
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>
              {isPremium
                ? language === 'ro'
                  ? 'Revin la versiunea Standard'
                  : 'Auf Standard-Version zurücksetzen'
                : language === 'ro'
                ? 'Activează Premium acum (Gratuit pentru test)'
                : 'Premium jetzt aktivieren (Kostenlos)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
