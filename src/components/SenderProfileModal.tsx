import React, { useState } from 'react';
import { Language, SenderProfile } from '../types';
import { User, X, Check, Save } from 'lucide-react';

interface SenderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialProfile: SenderProfile;
  onSave: (profile: SenderProfile) => void;
}

export const SenderProfileModal: React.FC<SenderProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  initialProfile,
  onSave,
}) => {
  const [profile, setProfile] = useState<SenderProfile>(initialProfile);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base">
              {language === 'ro' ? 'Profilul meu (Expeditor)' : 'Meine Absenderdaten'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'ro'
                ? 'Datele se salvează în browser și se completează automat în toate scrisorile.'
                : 'Ihre Daten werden lokal gespeichert und in jedem Brief automatisch vorausgefüllt.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'ro' ? 'Nume și prenume complet' : 'Vor- und Nachname'}
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              placeholder="ex: Andrei Popescu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'ro' ? 'Strada și numărul' : 'Straße und Hausnummer'}
            </label>
            <input
              type="text"
              value={profile.street}
              onChange={(e) => setProfile({ ...profile, street: e.target.value })}
              placeholder="ex: Schillerstraße 22"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Cod poștal (PLZ)' : 'PLZ (5-stellig)'}
              </label>
              <input
                type="text"
                maxLength={5}
                value={profile.postalCode}
                onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                placeholder="90403"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Oraș' : 'Stadt'}
              </label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="Nürnberg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Telefon' : 'Telefon'}
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="0176 12345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'E-Mail' : 'E-Mail'}
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="andrei@email.de"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                savedFeedback
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {savedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{language === 'ro' ? 'Salvat cu succes!' : 'Erfolgreich gespeichert!'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{language === 'ro' ? 'Salvează datele' : 'Daten speichern'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
