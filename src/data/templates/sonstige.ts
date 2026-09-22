import { LetterTemplate } from '../../types';

export const sonstigeTemplates: LetterTemplate[] = [
  {
    id: 'sonstige-widerruf-onlinekauf',
    categoryId: 'sonstige',
    isPremium: false,
    title: {
      ro: 'Retur comandă online în termen de 14 zile (Widerruf nach § 355 BGB)',
      de: 'Widerruf eines Online-Kaufvertrags nach § 355 BGB',
    },
    shortDescription: {
      ro: 'Pentru cumpărături făcute pe internet sau prin telefon, dreptul legal de răzgândire în 14 zile.',
      de: 'Gesetzliches Widerrufsrecht für Verbraucher binnen 14 Tagen ohne Angabe von Gründen.',
    },
    bureaucraticTip: {
      ro: 'În UE și Germania aveți dreptul legal de a returna orice comandă online în 14 zile fără a da nicio explicație! Comerciantul trebuie să vă returneze toți banii, inclusiv transportul inițial.',
      de: 'Der Widerruf bedarf keiner Begründung. Die Frist beginnt erst nach vollständigem Erhalt der Ware.',
    },
    fields: [
      {
        id: 'orderNumber',
        label: { ro: 'Număr comandă (Bestellnummer) sau factură', de: 'Bestellnummer / Rechnungsnummer' },
        placeholder: { ro: 'ex: BEST-2025-99120', de: 'z.B. BEST-2025-99120' },
        type: 'text',
        required: true,
      },
      {
        id: 'orderDate',
        label: { ro: 'Data la care ai plasat comanda', de: 'Bestelldatum' },
        type: 'date',
        required: true,
      },
      {
        id: 'receivedDate',
        label: { ro: 'Data la care ai primit coletul', de: 'Lieferdatum der Ware' },
        type: 'date',
        required: true,
      },
      {
        id: 'itemName',
        label: { ro: 'Denumirea produsului comandat', de: 'Bezeichnung der Ware' },
        placeholder: { ro: 'ex: Smartphone / Kleidungsstück / Elektronikartikel', de: 'z.B. Kaffeemaschine Modell X' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const oNo = answers.orderNumber || 'N/A';
      const oDate = answers.orderDate || 'kürzlich';
      const rDate = answers.receivedDate || 'vor wenigen Tagen';
      const item = answers.itemName || 'die bestellte Ware';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Hamburg',
        subject: `Widerruf meiner Bestellung – Bestellnummer: ${oNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf folgender Waren:`,
          `Artikel: ${item}\nBestellnummer: ${oNo}\nBestellt am: ${oDate} | Erhalten am: ${rDate}`,
          `Ich mache hiermit von meinem gesetzlichen Widerrufsrecht gemäß § 355 BGB fristgerecht Gebrauch.`,
          `Ich bitte Sie, mir den bereits gezahlten Betrag einschließlich der ursprünglichen Hinsendekosten unverzüglich und spätestens binnen 14 Tagen auf dasselbe Zahlungsmittel zu erstatten, das ich bei der ursprünglichen Transaktion eingesetzt habe.`,
          `Die Ware werde ich ordnungsgemäß verpackt an die von Ihnen angegebene Rücksendeadresse zurücksenden. Bitte bestätigen Sie mir den Eingang dieses Widerrufs schriftlich.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'sonstige-allgemeiner-brief',
    categoryId: 'sonstige',
    isPremium: false,
    title: {
      ro: 'Scrisoare oficială generală / Solicitare formală în limba germană',
      de: 'Allgemeines formelles Anschreiben / Anfrage',
    },
    shortDescription: {
      ro: 'Scrisoare adaptabilă conform standardului DIN 5008 pentru orice situație sau comunicare oficială.',
      de: 'Universell einsetzbare DIN 5008 Briefvorlage für Behörden, Firmen oder private Angelegenheiten.',
    },
    bureaucraticTip: {
      ro: 'Formulați clar problema în primul paragraf și precizați exact ce doriți (răspuns, confirmare, termen de 14 zile).',
      de: 'Ein klarer Betreff und eine präzise Fristsetzung beschleunigen die Bearbeitung in Deutschland maßgeblich.',
    },
    fields: [
      {
        id: 'customSubject',
        label: { ro: 'Subiectul scrisorii (Betreff)', de: 'Betreffzeile' },
        placeholder: { ro: 'ex: Wichtige Mitteilung / Dringende Anfrage zu Kundennummer 12345', de: 'z.B. Wichtige Anfrage' },
        type: 'text',
        required: true,
      },
      {
        id: 'referenceNumber',
        label: { ro: 'Număr dosar / client / referință (opțional)', de: 'Ihre Referenz / Aktenzeichen' },
        placeholder: { ro: 'ex: Ref: 99401-2025', de: 'z.B. AZ: 123/45' },
        type: 'text',
      },
      {
        id: 'customMessage',
        label: { ro: 'Textul solicitării tale (în germană sau descris)', de: 'Inhalt Ihres Schreibens' },
        placeholder: {
          ro: 'Descrieți pe scurt ce doriți să transmiteți sau să solicitați...',
          de: 'Beschreiben Sie Ihr Anliegen...',
        },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const subj = answers.customSubject || 'Wichtige Mitteilung';
      const ref = answers.referenceNumber ? ` – Ref.: ${answers.referenceNumber}` : '';
      const msg = answers.customMessage || 'hiermit wende ich mich mit folgendem Anliegen an Sie.';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `${subj}${ref}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit wende ich mich bezüglich der oben genannten Angelegenheit an Sie:`,
          `„${msg}“`,
          `Ich bitte Sie höflich, mein Anliegen zeitnah zu prüfen und mir eine schriftliche Rückmeldung an meine oben angegebene Anschrift zukommen zu lassen.`,
          `Für eventuelle Rückfragen stehe ich Ihnen jederzeit gern zur Verfügung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'sonstige-gewaehrleistung-mangel',
    categoryId: 'sonstige',
    isPremium: false,
    title: {
      ro: 'Reclamație produs defect în garanție (Mängelrüge & Nacherfüllung § 437 BGB)',
      de: 'Mängelrüge und Aufforderung zur Nacherfüllung gemäß § 437, 439 BGB',
    },
    shortDescription: {
      ro: 'Când ai cumpărat un produs defect sau care s-a stricat rapid și ceri repararea sau înlocuirea lui.',
      de: 'Geltendmachung der gesetzlichen 2-jährigen Sachmängelhaftung (Gewährleistung) gegenüber dem Verkäufer.',
    },
    bureaucraticTip: {
      ro: 'În primul an de la cumpărare, legea germană prezumă că defectul a existat de la început (Beweislastumkehr). Vânzătorul este obligat să suporte toate costurile de transport și reparație!',
      de: 'Der Käufer hat nach § 439 BGB das Wahlrecht zwischen Nachbesserung (Reparatur) und Ersatzlieferung eines Neugeräts.',
    },
    fields: [
      {
        id: 'productName',
        label: { ro: 'Denumirea exactă a produsului', de: 'Bezeichnung der Kaufsache' },
        placeholder: { ro: 'ex: Waschmaschine Modell Lux 200 / Laptop ABC', de: 'z.B. Fernseher Modell X' },
        type: 'text',
        required: true,
      },
      {
        id: 'invoiceOrOrderNumber',
        label: { ro: 'Număr factură / bon fiscal / comandă', de: 'Rechnungs- / Belegnummer' },
        placeholder: { ro: 'ex: RE-884129', de: 'z.B. RE-12345' },
        type: 'text',
        required: true,
      },
      {
        id: 'purchaseDate',
        label: { ro: 'Data cumpărării', de: 'Kaufdatum' },
        type: 'date',
        required: true,
      },
      {
        id: 'defectDescription',
        label: { ro: 'Descrierea exactă a defectului constatat', de: 'Beschreibung des aufgetretenen Mangels' },
        placeholder: { ro: 'ex: Das Gerät lässt sich nicht mehr einschalten und verliert Wasser.', de: 'z.B. Defektbeschreibung' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const prod = answers.productName || 'die Kaufsache';
      const inv = answers.invoiceOrOrderNumber || 'N/A';
      const pDate = answers.purchaseDate || 'kürzlich erworben';
      const def = answers.defectDescription || 'ein erheblicher Sachmangel';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt am Main',
        subject: `Mängelrüge und Aufforderung zur Nacherfüllung – Kauf vom ${pDate} (Rechnung: ${inv})`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `am ${pDate} habe ich bei Ihnen folgendes Produkt erworben:`,
          `Artikel: ${prod} (Rechnungs-Nr.: ${inv})`,
          `An der Kaufsache ist folgender erheblicher Mangel aufgetreten:`,
          `„${def}“`,
          `Ich fordere Sie hiermit gemäß § 437 Nr. 1 i.V.m. § 439 BGB auf, den Mangel im Wege der Nacherfüllung unverzüglich, spätestens binnen einer Frist von 14 Tagen nach Zugang dieses Schreibens, wahlweise durch kostenfreie Nachbesserung (Reparatur) oder durch Lieferung einer mangelfreien neuen Sache zu beseitigen.`,
          `Sämtliche zum Zwecke der Nacherfüllung erforderlichen Aufwendungen, insbesondere Transport-, Wege- und Arbeitskosten, fallen gemäß § 439 Abs. 2 BGB Ihnen zur Last.`,
          `Sollte die Frist fruchtlos verstreichen, behalte ich mir vor, vom Kaufvertrag zurückzutreten (Rückabwicklung und Erstattung des Kaufpreises) oder Schadensersatz geltend zu machen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Kopie des Kaufbelegs / der Rechnung'],
      };
    },
  },
  {
    id: 'sonstige-dsgvo-auskunft-loeschung',
    categoryId: 'sonstige',
    isPremium: false,
    title: {
      ro: 'Ștergerea datelor cu caracter personal conform GDPR (Art. 17 DSGVO)',
      de: 'Antrag auf Löschung personenbezogener Daten gemäß Art. 17 DSGVO',
    },
    shortDescription: {
      ro: 'Pentru companii, site-uri sau baze de date care dețin datele tale și refuză să le șteargă.',
      de: 'Geltendmachung des Rechts auf Vergessenwerden nach europäischem Datenschutzrecht.',
    },
    bureaucraticTip: {
      ro: 'În UE, orice companie este obligată prin lege să vă șteargă datele în termen de maxim 30 de zile dacă nu mai există un contract activ sau o obligație fiscală legală de păstrare.',
      de: 'Die Frist zur Umsetzung und Bestätigung beträgt maximal einen Monat gemäß Art. 12 Abs. 3 DSGVO.',
    },
    fields: [
      {
        id: 'customerOrAccountNo',
        label: { ro: 'Număr cont / client / adresă de e-mail înregistrată', de: 'Kundennummer / Registrierte E-Mail' },
        placeholder: { ro: 'ex: KD-10293 sau user@example.com', de: 'z.B. max@muster.de' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const acc = answers.customerOrAccountNo || sender.email || 'meine personenbezogenen Daten';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `Antrag auf unverzügliche Löschung personenbezogener Daten gemäß Art. 17 DSGVO`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Datenschutzbeauftragte(r),',
        paragraphs: [
          `hiermit mache ich von meinem gesetzlichen Recht auf Löschung („Recht auf Vergessenwerden“) gemäß Art. 17 der Datenschutz-Grundverordnung (DSGVO) Gebrauch.`,
          `Ich fordere Sie auf, sämtliche zu meiner Person gespeicherten Daten (zugeordnet zu: ${acc}, Name: ${sender.fullName}, Anschrift: ${sender.street}, ${sender.postalCode} ${sender.city}) unverzüglich und dauerhaft zu löschen.`,
          `Da zwischen uns kein aktives Vertragsverhältnis mehr besteht, entfallen die Zwecke, für die die Daten erhoben wurden. Sollten bestimmte Daten aufgrund zwingender gesetzlicher handels- oder steuerrechtlicher Aufbewahrungspflichten noch nicht gelöscht werden dürfen, verlange ich gemäß Art. 18 DSGVO die sofortige Einschränkung der Verarbeitung (Sperrung) dieser Datensätze.`,
          `Zudem fordere ich Sie auf, etwaige Dritte, an die meine Daten übermittelt wurden, über meinen Löschungsantrag gemäß Art. 17 Abs. 2 DSGVO zu unterrichten.`,
          `Ich bitte Sie, mir die vollständige Löschung bzw. Sperrung gemäß Art. 12 Abs. 3 DSGVO binnen der gesetzlichen Frist von einem Monat schriftlich zu bestätigen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
];
