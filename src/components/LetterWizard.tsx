import React, { useState, useEffect } from 'react';
import {
  Language,
  LetterTemplate,
  RecipientInfo,
  SenderProfile,
  GeneratedDocument,
} from '../types';
import {
  ArrowLeft,
  User,
  Building,
  HelpCircle,
  Sparkles,
  Save,
  Check,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface LetterWizardProps {
  template: LetterTemplate;
  language: Language;
  savedSender: SenderProfile;
  onSaveSender: (sender: SenderProfile) => void;
  onGenerate: (doc: GeneratedDocument) => void;
  onBack: () => void;
}

export const LetterWizard: React.FC<LetterWizardProps> = ({
  template,
  language,
  savedSender,
  onSaveSender,
  onGenerate,
  onBack,
}) => {
  // 1. Sender State
  const [sender, setSender] = useState<SenderProfile>({
    fullName: savedSender.fullName || '',
    street: savedSender.street || '',
    postalCode: savedSender.postalCode || '',
    city: savedSender.city || '',
    phone: savedSender.phone || '',
    email: savedSender.email || '',
  });

  // 2. Recipient State
  const [recipient, setRecipient] = useState<RecipientInfo>({
    organization: template.defaultRecipient?.organization || '',
    department: template.defaultRecipient?.department || '',
    contactPerson: template.defaultRecipient?.contactPerson || '',
    street: template.defaultRecipient?.street || '',
    postalCode: template.defaultRecipient?.postalCode || '',
    city: template.defaultRecipient?.city || '',
  });

  // 3. Template Answers State
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const f of template.fields) {
      if (f.defaultValue) {
        initial[f.id] = f.defaultValue;
      }
    }
    return initial;
  });

  const [rememberSender, setRememberSender] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (savedSender.fullName) {
      setSender((prev) => ({
        ...prev,
        fullName: prev.fullName || savedSender.fullName,
        street: prev.street || savedSender.street,
        postalCode: prev.postalCode || savedSender.postalCode,
        city: prev.city || savedSender.city,
        phone: prev.phone || savedSender.phone,
        email: prev.email || savedSender.email,
      }));
    }
  }, [savedSender]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate Sender
    if (!sender.fullName.trim()) {
      newErrors.senderFullName =
        language === 'ro' ? 'Introdu numele tău complet' : 'Bitte Ihren Namen angeben';
    }
    if (!sender.street.trim()) {
      newErrors.senderStreet =
        language === 'ro' ? 'Introdu strada și numărul' : 'Bitte Straße und Hausnummer angeben';
    }
    if (!sender.postalCode.trim() || !sender.city.trim()) {
      newErrors.senderCity =
        language === 'ro' ? 'Introdu codul poștal și orașul' : 'Bitte PLZ und Ort angeben';
    }

    // Validate Recipient
    if (!recipient.organization.trim()) {
      newErrors.recipientOrg =
        language === 'ro'
          ? 'Introdu numele firmei sau instituției destinatar'
          : 'Bitte Name des Empfängers angeben';
    }

    // Validate required template fields
    for (const field of template.fields) {
      if (field.required && !answers[field.id]?.trim()) {
        newErrors[field.id] =
          language === 'ro' ? 'Acest câmp este obligatoriu' : 'Dieses Feld ist erforderlich';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    // Save sender if toggle enabled
    if (rememberSender) {
      onSaveSender(sender);
    }

    // Build standard document
    const generatedDoc = template.buildLetter(answers, sender, recipient);
    onGenerate(generatedDoc);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{language === 'ro' ? 'Înapoi la modele' : 'Zurück zur Vorlagenauswahl'}</span>
        </button>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            {language === 'ro' ? 'Asistent completare' : 'Formular-Assistent'}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            {template.title[language]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {template.shortDescription[language]}
          </p>

          <div className="mt-3 p-3 rounded-xl bg-blue-50/80 border border-blue-200/60 flex items-start gap-2.5 text-xs text-blue-950">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-900">
                {language === 'ro' ? 'Ghid birocratic: ' : 'Behörden-Hinweis: '}
              </span>
              <span>{template.bureaucraticTip[language]}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* SECTION 1: Sender Data */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {language === 'ro' ? '1. Datele tale (Absender)' : '1. Ihre Absenderdaten'}
                </h2>
                <p className="text-[11px] text-slate-500">
                  {language === 'ro'
                    ? 'Apar în antetul oficial conform DIN 5008'
                    : 'Stehen im offiziellen DIN 5008 Briefkopf'}
                </p>
              </div>
            </div>

            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberSender}
                onChange={(e) => setRememberSender(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
              />
              <span className="hidden sm:inline">
                {language === 'ro' ? 'Reține datele mele' : 'Daten merken'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Nume și prenume' : 'Vor- und Nachname'} *
              </label>
              <input
                type="text"
                value={sender.fullName}
                onChange={(e) => setSender({ ...sender, fullName: e.target.value })}
                placeholder="ex: Ion Popescu"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                  errors.senderFullName
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
                }`}
              />
              {errors.senderFullName && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.senderFullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Strada și numărul' : 'Straße und Hausnummer'} *
              </label>
              <input
                type="text"
                value={sender.street}
                onChange={(e) => setSender({ ...sender, street: e.target.value })}
                placeholder="ex: Hauptstraße 14"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                  errors.senderStreet
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
                }`}
              />
              {errors.senderStreet && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.senderStreet}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Cod poștal (PLZ - 5 cifre)' : 'Postleitzahl (PLZ)'} *
              </label>
              <input
                type="text"
                maxLength={5}
                value={sender.postalCode}
                onChange={(e) => setSender({ ...sender, postalCode: e.target.value })}
                placeholder="ex: 80331"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                  errors.senderCity
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Oraș (Stadt / Ort)' : 'Wohnort / Stadt'} *
              </label>
              <input
                type="text"
                value={sender.city}
                onChange={(e) => setSender({ ...sender, city: e.target.value })}
                placeholder="ex: München"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Număr de telefon (mobil)' : 'Telefonnummer'}
              </label>
              <input
                type="text"
                value={sender.phone}
                onChange={(e) => setSender({ ...sender, phone: e.target.value })}
                placeholder="ex: 0176 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Adresă de e-mail' : 'E-Mail-Adresse'}
              </label>
              <input
                type="email"
                value={sender.email}
                onChange={(e) => setSender({ ...sender, email: e.target.value })}
                placeholder="ex: ion.popescu@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Recipient Data */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'ro' ? '2. Destinatarul scrisorii (Empfänger)' : '2. Empfängeradresse'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {language === 'ro'
                  ? 'Firma, proprietarul sau autoritatea căreia îi trimiți scrisoarea'
                  : 'Firma, Vermieter oder Behörde'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro'
                  ? 'Nume companie / instituție / proprietar'
                  : 'Name der Firma oder Behörde'}{' '}
                *
              </label>
              <input
                type="text"
                value={recipient.organization}
                onChange={(e) => setRecipient({ ...recipient, organization: e.target.value })}
                placeholder="ex: McFit GmbH / Vonovia SE / Jobcenter Frankfurt"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                  errors.recipientOrg
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
                }`}
              />
              {errors.recipientOrg && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.recipientOrg}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Departament / Direcție (opțional)' : 'Abteilung (optional)'}
              </label>
              <input
                type="text"
                value={recipient.department || ''}
                onChange={(e) => setRecipient({ ...recipient, department: e.target.value })}
                placeholder="ex: Kundenservice / Leistungsabteilung"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Persoană de contact (dacă o cunoști)' : 'Ansprechpartner (optional)'}
              </label>
              <input
                type="text"
                value={recipient.contactPerson || ''}
                onChange={(e) => setRecipient({ ...recipient, contactPerson: e.target.value })}
                placeholder="ex: Frau Müller / Herr Schmidt"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'ro' ? 'Strada și numărul destinatarului' : 'Straße des Empfängers'}
              </label>
              <input
                type="text"
                value={recipient.street}
                onChange={(e) => setRecipient({ ...recipient, street: e.target.value })}
                placeholder="ex: Tannenberg 4"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'ro' ? 'PLZ' : 'PLZ'}
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={recipient.postalCode}
                  onChange={(e) => setRecipient({ ...recipient, postalCode: e.target.value })}
                  placeholder="96132"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'ro' ? 'Oraș' : 'Stadt'}
                </label>
                <input
                  type="text"
                  value={recipient.city}
                  onChange={(e) => setRecipient({ ...recipient, city: e.target.value })}
                  placeholder="Schlüsselfeld"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Specific Template Fields */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'ro' ? '3. Detaliile specifice cererii' : '3. Spezifische Angaben zum Brief'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {language === 'ro'
                  ? 'Completează câteva date simple explicate în română'
                  : 'Angaben für das deutsche Anschreiben'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {template.fields.map((field) => {
              const val = answers[field.id] || '';
              const hasError = !!errors[field.id];

              return (
                <div key={field.id} className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <label className="block text-xs font-semibold text-slate-800">
                      {field.label[language]}{' '}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                  </div>

                  {field.helpText && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{field.helpText[language]}</span>
                    </p>
                  )}

                  {field.id === 'terminationDate' && (
                    <div className="flex flex-wrap gap-2 pt-1 pb-1">
                      <button
                        type="button"
                        onClick={() => handleFieldChange(field.id, 'zum nächstmöglichen Termin')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                          val === 'zum nächstmöglichen Termin' ||
                          !val ||
                          val.toLowerCase().includes('nächstmöglichen')
                            ? 'bg-blue-50 border-blue-400 text-blue-800 ring-1 ring-blue-400/30'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        ✓ {language === 'ro' ? 'zum nächstmöglichen Termin (recomandat)' : 'zum nächstmöglichen Termin'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            val === 'zum nächstmöglichen Termin' ||
                            val.toLowerCase().includes('nächstmöglichen')
                          ) {
                            handleFieldChange(field.id, '');
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                          val && !val.toLowerCase().includes('nächstmöglichen')
                            ? 'bg-blue-50 border-blue-400 text-blue-800 ring-1 ring-blue-400/30'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        📅 {language === 'ro' ? 'Dată specifică (ex: 31.12.2026)' : 'Konkretes Datum'}
                      </button>
                    </div>
                  )}

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={val}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder ? field.placeholder[language] : ''}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                        hasError
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
                      }`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={val}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                        hasError
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
                      }`}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label[language]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'date' ? 'date' : 'text'}
                      value={val}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder ? field.placeholder[language] : ''}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                        hasError
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
                      }`}
                    />
                  )}

                  {hasError && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors[field.id]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>
              {language === 'ro'
                ? 'Generează scrisoarea oficială'
                : 'Offizielles Schreiben generieren'}
            </span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {language === 'ro' ? 'Anulează' : 'Abbrechen'}
          </button>
        </div>
      </form>
    </div>
  );
};
