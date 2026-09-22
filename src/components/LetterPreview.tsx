import React, { useState } from 'react';
import { GeneratedDocument, Language, LetterTemplate } from '../types';
import { generateLetterPDF } from '../utils/pdfGenerator';
import {
  Copy,
  Check,
  Download,
  Printer,
  ArrowLeft,
  Edit3,
  Eye,
  FileCheck,
  ShieldCheck,
  Send,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface LetterPreviewProps {
  document: GeneratedDocument;
  template: LetterTemplate;
  language: Language;
  isPremium: boolean;
  onBackToEdit: () => void;
  onOpenPremiumModal: () => void;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  document: initialDoc,
  template,
  language,
  isPremium,
  onBackToEdit,
  onOpenPremiumModal,
}) => {
  const [doc, setDoc] = useState<GeneratedDocument>(initialDoc);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableBody, setEditableBody] = useState<string>(() =>
    initialDoc.paragraphs.join('\n\n')
  );

  const getFullPlainText = (): string => {
    const senderLine = `${doc.sender.fullName}\n${doc.sender.street}\n${doc.sender.postalCode} ${doc.sender.city}\n${doc.sender.phone ? `Tel.: ${doc.sender.phone}\n` : ''}${doc.sender.email ? `E-Mail: ${doc.sender.email}\n` : ''}`;

    const recipientLine = `${doc.recipient.organization}\n${doc.recipient.department ? `${doc.recipient.department}\n` : ''}${doc.recipient.contactPerson ? `${doc.recipient.contactPerson}\n` : ''}${doc.recipient.street}\n${doc.recipient.postalCode} ${doc.recipient.city}`;

    const dateLine = `${doc.place}, den ${doc.date}`;

    const bodyText = isEditing ? editableBody : doc.paragraphs.join('\n\n');

    const enclosuresText =
      doc.enclosures && doc.enclosures.length > 0
        ? `\n\nAnlagen:\n${doc.enclosures.map((e) => `- ${e}`).join('\n')}`
        : '';

    return `${senderLine}\n\n${recipientLine}\n\n${dateLine}\n\n${doc.subject}\n\n${doc.salutation}\n\n${bodyText}\n\n${doc.closing}\n\n${doc.signName}${enclosuresText}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFullPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadPdf = () => {
    // If user edited the paragraphs, update doc first
    const updatedParagraphs = isEditing
      ? editableBody.split('\n\n').filter((p) => p.trim().length > 0)
      : doc.paragraphs;

    generateLetterPDF(
      {
        ...doc,
        paragraphs: updatedParagraphs,
      },
      isPremium
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApplyBodyEdit = () => {
    const newParagraphs = editableBody
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    setDoc((prev) => ({ ...prev, paragraphs: newParagraphs }));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <button
          onClick={onBackToEdit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{language === 'ro' ? 'Modifică răspunsurile' : 'Angaben bearbeiten'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bearbeiten Button */}
          <button
            onClick={() => {
              if (isEditing) {
                handleApplyBodyEdit();
              } else {
                setIsEditing(true);
              }
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
              isEditing
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'ro' ? 'Salvează modificările' : 'Änderungen übernehmen'}</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'ro' ? 'Bearbeiten (Editează)' : 'Bearbeiten'}</span>
              </>
            )}
          </button>

          {/* Kopieren Button */}
          <button
            onClick={handleCopy}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'ro' ? 'Copiat!' : 'Kopiert!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'ro' ? 'Kopieren (Copiază)' : 'Kopieren'}</span>
              </>
            )}
          </button>

          {/* PDF herunterladen Button */}
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-all shadow-sm shadow-blue-500/20 active:scale-98 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF herunterladen</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title={language === 'ro' ? 'Imprimă' : 'Drucken'}
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">
              {language === 'ro' ? 'Imprimă' : 'Drucken'}
            </span>
          </button>
        </div>
      </div>

      {/* Romanian Explanation & Guidance Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 text-slate-800 space-y-2 no-print shadow-2xs">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <h2 className="text-sm font-bold text-slate-900">
            {language === 'ro'
              ? 'Ce conține această scrisoare în limba germană:'
              : 'Zusammenfassung des Schreibens:'}
          </h2>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {language === 'ro'
            ? `Scrisoarea este redactată conform normei germane DIN 5008 (standardul oficial pentru instituții și companii). Conține identificarea clară a numărului de contract/client, termenul limită legal acordat destinatarului și solicitarea obligatorie de confirmare în scris a datei de încheiere.`
            : `Dieses Schreiben ist nach DIN 5008 formatiert. Es enthält klare Fristsetzungen, den verbindlichen Betreff und die Aufforderung zur schriftlichen Bestätigung.`}
        </p>

        <div className="pt-2 border-t border-blue-200/60 flex items-start gap-2 text-xs text-blue-950">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong className="text-slate-900">
              {language === 'ro' ? 'Cum o trimiți în Germania: ' : 'Versand-Hinweis: '}
            </strong>
            {language === 'ro'
              ? 'Descarcă PDF-ul, imprimă-l, semnează-l cu pixul în chenarul indicat și expediază-l la Deutsche Post prin „Einschreiben Einwurf” (costă ~3,20 € și ai dovadă de primire recunoscută legal).'
              : 'Drucken Sie das Dokument aus, unterschreiben Sie eigenhändig und versenden Sie es vorzugsweise als „Einschreiben Einwurf“.'}
          </p>
        </div>
      </div>

      {/* DIN 5008 Virtual Letter Sheet */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 sm:p-12 font-sans text-slate-900 page-container relative">
        {/* Subtle DIN 5008 Fold marks hint */}
        <div className="hidden sm:block absolute left-2 top-[105mm] w-2 h-[1px] bg-slate-200" title="Falzmarke 1" />
        <div className="hidden sm:block absolute left-2 top-[148.5mm] w-3 h-[1px] bg-slate-300" title="Lochmarke Mitte" />
        <div className="hidden sm:block absolute left-2 top-[210mm] w-2 h-[1px] bg-slate-200" title="Falzmarke 2" />

        {/* Sender top small one-line (DIN 5008 Fensterzeile) */}
        {(doc.sender.fullName || doc.sender.street) && (
          <div className="text-[10px] sm:text-[11px] text-slate-500 pb-1 border-b border-slate-200 max-w-sm tracking-tight mb-4">
            {[
              doc.sender.fullName,
              doc.sender.street,
              `${doc.sender.postalCode || ''} ${doc.sender.city || ''}`.trim(),
            ]
              .filter(Boolean)
              .join(' · ')}
          </div>
        )}

        {/* Two-column top section: Recipient Window + Sender Contact Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
          {/* Recipient Window Block (DIN 5008 Anschriftfeld) */}
          <div className="text-xs sm:text-sm text-slate-800 space-y-0.5 leading-snug max-w-xs">
            {doc.recipient.organization && (
              <p className="font-semibold text-slate-900">{doc.recipient.organization}</p>
            )}
            {doc.recipient.department && <p>{doc.recipient.department}</p>}
            {doc.recipient.contactPerson && <p>{doc.recipient.contactPerson}</p>}
            {doc.recipient.street && <p>{doc.recipient.street}</p>}
            {(doc.recipient.postalCode || doc.recipient.city) && (
              <p>
                {doc.recipient.postalCode} {doc.recipient.city}
              </p>
            )}
          </div>

          {/* Right Sender details + Place & Date */}
          <div className="text-right text-xs text-slate-600 space-y-1 sm:self-end">
            {doc.sender.fullName && (
              <p className="font-semibold text-slate-900">{doc.sender.fullName}</p>
            )}
            {doc.sender.street && <p>{doc.sender.street}</p>}
            {(doc.sender.postalCode || doc.sender.city) && (
              <p>
                {doc.sender.postalCode} {doc.sender.city}
              </p>
            )}
            {doc.sender.phone && <p>Tel.: {doc.sender.phone}</p>}
            {doc.sender.email && <p>E-Mail: {doc.sender.email}</p>}
            <p className="text-slate-800 font-medium pt-2">
              {doc.place ? `${doc.place}, den ` : ''}
              {doc.date}
            </p>
          </div>
        </div>

        {/* Subject Line (Betreff) - Bold and prominent */}
        <div className="my-6">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {doc.subject}
          </h1>
        </div>

        {/* Salutation */}
        <p className="text-xs sm:text-sm text-slate-800 mb-4">{doc.salutation}</p>

        {/* Paragraphs / Body */}
        {isEditing ? (
          <div className="my-4 no-print space-y-2">
            <label className="block text-xs font-semibold text-blue-700">
              {language === 'ro'
                ? 'Modifică direct textul scrisorii (separă paragrafele printr-o linie goală):'
                : 'Text hier direkt editieren (Absätze durch Leerzeile trennen):'}
            </label>
            <textarea
              rows={10}
              value={editableBody}
              onChange={(e) => setEditableBody(e.target.value)}
              className="w-full p-4 rounded-xl border border-blue-300 font-mono text-xs sm:text-sm bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-900"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleApplyBodyEdit}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                {language === 'ro' ? 'Aplică modificările' : 'Übernehmen'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
            {doc.paragraphs.map((para, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Closing & Signature Block */}
        <div className="mt-8 space-y-6">
          <p className="text-xs sm:text-sm text-slate-800">{doc.closing}</p>

          <div className="pt-8">
            <div className="w-48 border-b border-dashed border-slate-300 mb-2" />
            <p className="font-bold text-xs sm:text-sm text-slate-900">{doc.signName}</p>
            <p className="text-[11px] text-slate-400 italic">
              {language === 'ro' ? '(Semnătură olografă)' : '(Eigenhändige Unterschrift)'}
            </p>
          </div>
        </div>

        {/* Enclosures (Anlagen) */}
        {doc.enclosures && doc.enclosures.length > 0 && (
          <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Anlagen:</p>
            {doc.enclosures.map((enc, idx) => (
              <p key={idx}>- {enc}</p>
            ))}
          </div>
        )}

        {/* Footer info watermark in Free mode */}
        {!isPremium && (
          <div className="mt-12 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
            AlltagsHelfer Deutschland · Kostenlose Version · Rechtssichere DIN 5008 Vorlage
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar on mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-2.5 bg-white/95 backdrop-blur-md border-t border-slate-200/90 flex items-center gap-2 sm:hidden z-30 no-print">
        <button
          onClick={() => {
            if (isEditing) {
              handleApplyBodyEdit();
            } else {
              setIsEditing(true);
            }
          }}
          className={`flex-1 py-2.5 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 min-h-[44px] transition-colors cursor-pointer ${
            isEditing
              ? 'bg-blue-50 text-blue-700 border-blue-300'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5 text-slate-500" />}
          <span className="truncate">{language === 'ro' ? (isEditing ? 'Salvează' : 'Bearbeiten') : (isEditing ? 'Speichern' : 'Bearbeiten')}</span>
        </button>

        <button
          onClick={handleCopy}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 min-h-[44px] transition-colors shadow-2xs cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span className="truncate">{language === 'ro' ? (copied ? 'Copiat!' : 'Kopieren') : (copied ? 'Kopiert!' : 'Kopieren')}</span>
        </button>

        <button
          onClick={handleDownloadPdf}
          className="flex-1 py-2.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 min-h-[44px] shadow-sm shadow-blue-500/20 active:scale-98 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="truncate">PDF herunterladen</span>
        </button>
      </div>
    </div>
  );
};
