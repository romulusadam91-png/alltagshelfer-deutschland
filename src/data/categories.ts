import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'kuendigung',
    iconName: 'FileX',
    title: {
      ro: 'Kündigung (Rezilieri contracte)',
      de: 'Kündigung (Verträge kündigen)',
    },
    description: {
      ro: 'Reziliere abonament sală de fitness, asigurări, cluburi și servicii regulate.',
      de: 'Verträge für Fitnessstudio, Mitgliedschaften, Versicherungen und Abos kündigen.',
    },
    count: 5,
  },
  {
    id: 'vermieter',
    iconName: 'Home',
    title: {
      ro: 'Vermieter (Proprietar & Chirie)',
      de: 'Vermieter (Wohnung & Miete)',
    },
    description: {
      ro: 'Sesizare defecte (mucegai, căldură), cerere returnare garanție, reziliere chirie.',
      de: 'Mängelanzeige, Kautionsrückforderung, Mietkündigung und Haustiergenehmigung.',
    },
    count: 5,
  },
  {
    id: 'krankenkasse',
    iconName: 'HeartPulse',
    title: {
      ro: 'Krankenkasse (Asigurare de sănătate)',
      de: 'Krankenkasse (Gesundheit)',
    },
    description: {
      ro: 'Scutire de coplată medicamente (Zuzahlungsbefreiung), decontare tratamente, schimbare casă.',
      de: 'Zuzahlungsbefreiung, Kostenerstattung, Krankengeld-Anfrage und Kassenwechsel.',
    },
    count: 4,
  },
  {
    id: 'kita_schule',
    iconName: 'GraduationCap',
    title: {
      ro: 'Kita & Schule (Grădiniță & Școală)',
      de: 'Kita & Schule (Kinder & Bildung)',
    },
    description: {
      ro: 'Motivare absențe boală, cerere învoire călătorie în România, cerere loc grădiniță.',
      de: 'Krankmeldung, Beurlaubungsantrag für Familienreisen, Kitaplatz-Anfrage.',
    },
    count: 4,
  },
  {
    id: 'internet_handy',
    iconName: 'Wifi',
    title: {
      ro: 'Internet & Handy (Telefonie & Net)',
      de: 'Internet & Handy (Telekommunikation)',
    },
    description: {
      ro: 'Reziliere contract Telekom/Vodafone/O2, reziliere specială la mutare, sesizare avarie.',
      de: 'Vertragsbeendigung, Sonderkündigung bei Umzug nach §60 TKG, Störungsmeldung.',
    },
    count: 4,
  },
  {
    id: 'arbeitgeber',
    iconName: 'Briefcase',
    title: {
      ro: 'Arbeitgeber (Angajator & Muncă)',
      de: 'Arbeitgeber (Arbeit & Beruf)',
    },
    description: {
      ro: 'Demisie cu preaviz, cerere adeverință de muncă (Arbeitszeugnis), concediu de creștere copil (Elternzeit).',
      de: 'Kündigungsschreiben, Arbeitszeugnis-Anforderung, Elternzeit-Antrag und Urlaub.',
    },
    count: 5,
  },
  {
    id: 'behoerden',
    iconName: 'Building2',
    title: {
      ro: 'Behörden (Autorități & Oficii)',
      de: 'Behörden (Ämter & Verwaltungen)',
    },
    description: {
      ro: 'Prelungire termen (Fristverlängerung), stadiu dosar (Bürgeramt, Ausländerbehörde, Jobcenter, Finanzamt), contestație.',
      de: 'Fristverlängerung, Sachstandsanfrage, Widerspruch und Ratenzahlungsantrag.',
    },
    count: 5,
  },
  {
    id: 'bank',
    iconName: 'CreditCard',
    title: {
      ro: 'Bank (Bănci & Finanțe)',
      de: 'Bank (Konten & Finanzen)',
    },
    description: {
      ro: 'Închidere cont bancar (Kontoauflösung), revocare debitare directă (Lastschrift), refuz plată neautorizată.',
      de: 'Girokonto-Kündigung, Lastschrift-Widerruf, unberechtigte Abbuchung reklamieren.',
    },
    count: 4,
  },
  {
    id: 'sonstige',
    iconName: 'Sparkles',
    title: {
      ro: 'Sonstige (Alte situații)',
      de: 'Sonstige (Alltägliche Anliegen)',
    },
    description: {
      ro: 'Retur produs cumpărat online în 14 zile (Widerruf), reclamație marfă defectă, scrisoare generală.',
      de: 'Widerruf bei Online-Kauf (14 Tage), Reklamation defekter Ware, formelle Mitteilung.',
    },
    count: 3,
  },
];
