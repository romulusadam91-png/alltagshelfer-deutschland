import React from 'react';
import { Language } from '../types';
import { X, Send, Calendar, Clock, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TipsModal: React.FC<TipsModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              {language === 'ro' ? 'Ghid util' : 'Ratgeber'}
            </span>
            <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-tight">
              {language === 'ro'
                ? 'Reguli de aur pentru corespondență în Germania'
                : 'Goldene Regeln für Behördenpost in Deutschland'}
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Tip 1 */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                {language === 'ro'
                  ? '1. Folosește „Einschreiben Einwurf”'
                  : '1. Nutzen Sie „Einschreiben Einwurf“'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ro'
                ? 'Pentru scrisorile oficiale importante (rezilieri de contract, sesizări către proprietar, contestații), nu trimite doar plic simplu. La Deutsche Post cere opțiunea „Einschreiben Einwurf” (~3,20 €). Poștașul semnează când aruncă plicul în cutia destinatarului, iar tu primești un număr de urmărire (Sendungsverfolgung) valabil juridic în fața instanțelor germane.'
                : 'Für rechtsrelevante Schreiben ist das „Einschreiben Einwurf“ der sicherste und preiswerteste Weg. Der Zusteller quittiert den Einwurf in den Briefkasten.'}
            </p>
          </div>

          {/* Tip 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {language === 'ro'
                  ? '2. Atenție la a 3-a zi lucrătoare a lunii'
                  : '2. Der 3. Werktag des Monats'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ro'
                ? 'La rezilierea contractului de chirie (Mietvertrag), scrisoarea trebuie să AJUNGĂ FIZIC la proprietar până cel târziu în a 3-a zi lucrătoare a lunii pentru ca luna respectivă să fie socotită în preavizul de 3 luni. Sâmbăta este considerată zi lucrătoare în Germania!'
                : 'Mietkündigungen müssen dem Vermieter spätestens am 3. Werktag des Monats zugehen, um für diesen Monat noch wirksam zu werden (§ 573c BGB).'}
            </p>
          </div>

          {/* Tip 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'ro'
                  ? '3. Păstrează mereu o copie a scrisorii semnate'
                  : '3. Kopie und Sendebeleg aufbewahren'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ro'
                ? 'Înainte de a lipi plicul, fă o fotografie sau păstrează PDF-ul generat din această aplicație și capsează chitanța de la poștă. În Germania, sarcina probei (Beweislast) aparține expeditorului.'
                : 'Bewahren Sie die PDF-Kopie sowie den Einlieferungsbeleg mit der Sendungsnummer mindestens 2-3 Jahre lang auf.'}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            {language === 'ro' ? 'Am înțeles, închide' : 'Verstanden, schließen'}
          </button>
        </div>
      </div>
    </div>
  );
};
