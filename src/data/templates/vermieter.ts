import { LetterTemplate } from '../../types';

export const vermieterTemplates: LetterTemplate[] = [
  {
    id: 'vermieter-maengelanzeige',
    categoryId: 'vermieter',
    isPremium: false,
    title: {
      ro: 'Notificare defecțiuni în locuință cu termen de remediere (Mängelanzeige)',
      de: 'Mängelanzeige der Mietsache mit Fristsetzung',
    },
    shortDescription: {
      ro: 'Pentru sesizarea mucegaiului, căldurii nefuncționale, infiltrațiilor sau avariilor cu termen de 14 zile.',
      de: 'Mitteilung von Mängeln (Heizungsausfall, Schimmel, Wasserschaden) mit Aufforderung zur Nachbesserung.',
    },
    bureaucraticTip: {
      ro: 'În Germania, proprietarul nu poate fi tras la răspundere fără o notificare scrisă (Mängelanzeige) și un termen clar (de regulă 14 zile). Faceți poze doveditoare!',
      de: 'Setzen Sie stets eine angemessene Frist (üblicherweise 14 Tage) und dokumentieren Sie den Mangel durch Fotos.',
    },
    fields: [
      {
        id: 'apartmentLocation',
        label: { ro: 'Adresa apartamentului / etaj', de: 'Mietobjekt / Lage der Wohnung' },
        placeholder: { ro: 'ex: Musterstraße 10, 80333 München, 2. OG rechts', de: 'z.B. Musterstraße 10, 80333 München, 2. OG rechts' },
        type: 'text',
        required: true,
      },
      {
        id: 'defectDescription',
        label: { ro: 'Descrierea exactă a defectului', de: 'Genaue Mängelbeschreibung' },
        placeholder: {
          ro: 'ex: Seit dem 15. Oktober funktioniert die Heizung im Schlafzimmer und Wohnzimmer nicht mehr. Es herrschen Temperaturen unter 16 Grad.',
          de: 'z.B. Seit dem 15. Oktober ist die Heizung im Wohnzimmer defekt.',
        },
        helpText: {
          ro: 'Descrieți ce nu funcționează și când a apărut problema. Textul este inserat în scrisoarea oficială.',
          de: 'Beschreiben Sie den Mangel so präzise wie möglich.',
        },
        type: 'textarea',
        required: true,
      },
      {
        id: 'deadlineDate',
        label: { ro: 'Termen limită de remediere (de regulă 14 zile)', de: 'Frist zur Mängelbeseitigung' },
        type: 'date',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const apt = answers.apartmentLocation || `${sender.street}, ${sender.postalCode} ${sender.city}`;
      const defect = answers.defectDescription || 'diverse Mängel';
      const deadline = answers.deadlineDate || 'binnen 14 Tagen';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Mängelanzeige zur Mietwohnung: ${apt} – Aufforderung zur Beseitigung`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vermieter(in),',
        paragraphs: [
          `als Mieter der oben genannten Wohnung muss ich Ihnen leider folgenden erheblichen Mangel an der Mietsache anzeigen:`,
          `„${defect}“`,
          `Durch diesen Zustand ist die vertragsgemäße Nutzung der Wohnung spürbar beeinträchtigt. Gemäß § 535 Abs. 1 Satz 2 BGB ist der Vermieter verpflichtet, die Mietsache in einem zum vertragsgemäßen Gebrauch geeigneten Zustand zu erhalten.`,
          `Ich fordere Sie daher höflich auf, die genannten Mängel bis spätestens zum ${deadline} fachgerecht zu beseitigen oder eine entsprechende Instandsetzung in die Wege zu leiten. Für die Vereinbarung eines Besichtigungstermins mit Handwerkern stehe ich Ihnen unter den oben angegebenen Kontaktdaten gern zur Verfügung.`,
          `Sollte die Frist fruchtlos verstreichen, behalte ich mir weitere rechtliche Schritte, insbesondere eine angemessene Mietminderung sowie die Ersatzvornahme auf Ihre Kosten, ausdrücklich vor.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Fotodokumentation der Mängel'],
      };
    },
  },
  {
    id: 'vermieter-kuendigung-mietvertrag',
    categoryId: 'vermieter',
    isPremium: false,
    title: {
      ro: 'Rezilierea contractului de închiriere a locuinței (Mietvertragskündigung)',
      de: 'Kündigung des Mietvertrages',
    },
    shortDescription: {
      ro: 'Reziliere standard cu preaviz de 3 luni pentru chiriași conform legii germane.',
      de: 'Ordentliche Kündigung des Mietverhältnisses unter Einhaltung der gesetzlichen 3-Monats-Frist.',
    },
    bureaucraticTip: {
      ro: 'Scrisoarea trebuie să ajungă la proprietar cel târziu în a 3-a zi lucrătoare a lunii pentru ca luna respectivă să fie calculată în preaviz! Toți semnatarii contractului trebuie să semneze.',
      de: 'Die Kündigung muss spätestens am 3. Werktag des Monats beim Vermieter eingehen, damit der Monat zur Frist zählt (§ 573c BGB).',
    },
    fields: [
      {
        id: 'apartmentLocation',
        label: { ro: 'Adresa locuinței închiriate', de: 'Anschrift der Mietwohnung' },
        placeholder: { ro: 'ex: Goethestraße 44, 70173 Stuttgart, 1. Stock', de: 'z.B. Goethestraße 44, 70173 Stuttgart' },
        type: 'text',
        required: true,
      },
      {
        id: 'terminationDate',
        label: { ro: 'Data de încheiere a contractului', de: 'Kündigungsdatum' },
        placeholder: { ro: 'ex: 31. März 2025 sau zum nächstmöglichen Termin', de: 'z.B. zum nächstmöglichen Termin' },
        defaultValue: 'zum nächstmöglichen Termin',
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const apt = answers.apartmentLocation || `${sender.street}, ${sender.postalCode} ${sender.city}`;
      const termDate = answers.terminationDate || 'zum nächstmöglichen Termin';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Stuttgart',
        subject: `Kündigung des Mietvertrages für die Wohnung: ${apt}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vermieter(in),',
        paragraphs: [
          `hiermit kündige ich / kündigen wir den bestehenden Mietvertrag für die oben genannte Wohnung unter Einhaltung der gesetzlichen Kündigungsfrist nach § 573c BGB fristgerecht ${termDate}.`,
          `Gleichzeitig kündige ich etwaige mitgemietete Nebenräume wie Keller, Dachbodenabteil sowie den Pkw-Stellplatz / die Garage.`,
          `Zwecks Vereinbarung eines Termins zur gemeinsamen Wohnungsabnahme und Schlüsselübergabe bitte ich Sie, sich rechtzeitig mit mir in Verbindung zu setzen.`,
          `Bitte bestätigen Sie mir den Eingang dieser Kündigung sowie das verbindliche Datum der Beendigung des Mietverhältnisses schriftlich.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'vermieter-kaution-rueckforderung',
    categoryId: 'vermieter',
    isPremium: false,
    title: {
      ro: 'Cerere de returnare a garanției de chirie (Mietkaution)',
      de: 'Rückforderung der Mietkaution nach Auszug',
    },
    shortDescription: {
      ro: 'Pentru recuperarea garanției (Kaution) după predarea apartamentului.',
      de: 'Aufforderung zur Rückzahlung der Kaution nach beendetem Mietverhältnis.',
    },
    bureaucraticTip: {
      ro: 'Proprietarul are de regulă până la 6 luni pentru verificarea stării apartamentului și a costurilor accesorii (Nebenkosten). Dacă nu există daune, cereți restituirea sumei!',
      de: 'Nach Rückgabe der Wohnung und Ablauf einer angemessenen Prüfungsfrist (i.d.R. max. 6 Monate) steht Ihnen die Kaution samt Zinsen zu.',
    },
    fields: [
      {
        id: 'formerApartment',
        label: { ro: 'Adresa fostei locuințe', de: 'Anschrift der ehemaligen Wohnung' },
        placeholder: { ro: 'ex: Schillerweg 5, 90403 Nürnberg', de: 'z.B. Schillerweg 5, 90403 Nürnberg' },
        type: 'text',
        required: true,
      },
      {
        id: 'handoverDate',
        label: { ro: 'Data predării cheilor / procesului verbal', de: 'Datum der Wohnungsübergabe' },
        type: 'date',
        required: true,
      },
      {
        id: 'depositAmount',
        label: { ro: 'Suma garanției (în Euro)', de: 'Kautionsbetrag (€)' },
        placeholder: { ro: 'ex: 1500', de: 'z.B. 1500' },
        type: 'text',
        required: true,
      },
      {
        id: 'iban',
        label: { ro: 'IBAN pentru virarea banilor', de: 'IBAN für die Überweisung' },
        placeholder: { ro: 'ex: DE89 3704 0044 0532 0130 00', de: 'z.B. DE89 ...' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const apt = answers.formerApartment || 'ehemalige Mietwohnung';
      const hDate = answers.handoverDate || 'bei Übergabe';
      const amount = answers.depositAmount || 'vereinbarte Kaution';
      const iban = answers.iban || 'auf mein Bankkonto';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Nürnberg',
        subject: `Rückzahlung der Mietkaution für die Wohnung: ${apt}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vermieter(in),',
        paragraphs: [
          `das Mietverhältnis über die oben genannte Wohnung endete regulär. Die ordnungsgemäße Übergabe der Mietsache erfolgte am ${hDate} ohne Beanstandungen bzw. gemäß dem gemeinsamen Übergabeprotokoll.`,
          `Seit der Rückgabe der Wohnung ist ein angemessener Prüfungszeitraum vergangen. Da keine offenen Mietzinsansprüche oder unreparierten Beschädigungen vorliegen, fordere ich Sie hiermit auf, die von mir zu Mietbeginn hinterlegte Mietkaution in Höhe von ${amount} € nebst den gesetzlich angefallenen Zinsen auf mein folgendes Konto zu überweisen:`,
          `Kontoinhaber: ${sender.fullName}\nIBAN: ${iban}`,
          `Ich bitte um Auszahlung des fälligen Betrages bis spätestens 14 Tage nach Zugang dieses Schreibens.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'vermieter-mietminderung',
    categoryId: 'vermieter',
    isPremium: true,
    title: {
      ro: 'Notificare de reducere a chiriei (Mietminderung)',
      de: 'Ankündigung einer Mietminderung wegen Mängeln',
    },
    shortDescription: {
      ro: 'Când defectele semnalate nu au fost reparate la termen și se reduce chiria lunară.',
      de: 'Rechtssichere Geltendmachung einer Minderung der Bruttowarmmiete nach § 536 BGB.',
    },
    bureaucraticTip: {
      ro: 'Reducerea chiriei este permisă doar după ce ați anunțat defecțiunea și a expirat termenul de remediere. Procentul depinde de gravitatea defectului.',
      de: 'Voraussetzung ist eine vorherige Mängelanzeige mit Fristablauf. Zahlen Sie die Miete ggf. vorerst „unter Vorbehalt“.',
    },
    fields: [
      {
        id: 'initialNoticeDate',
        label: { ro: 'Data primei sesizări trimise proprietarului', de: 'Datum der ursprünglichen Mängelanzeige' },
        type: 'date',
        required: true,
      },
      {
        id: 'reductionPercent',
        label: { ro: 'Procentul de reducere solicitat (ex: 15% sau 20%)', de: 'Minderungsquote in Prozent' },
        placeholder: { ro: 'ex: 20%', de: 'z.B. 20%' },
        type: 'text',
        required: true,
      },
      {
        id: 'defectSummary',
        label: { ro: 'Defectul care persistă', de: 'Weiterhin bestehender Mangel' },
        placeholder: { ro: 'ex: Schimmelbefall im Schlafzimmer trotz mehrfacher Mahnung', de: 'z.B. Ausfall der Heizungsanlage' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const nDate = answers.initialNoticeDate || 'unlängst';
      const pct = answers.reductionPercent || '20%';
      const def = answers.defectSummary || 'die angezeigten Mängel';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt am Main',
        subject: `Mietminderung gemäß § 536 BGB wegen nicht behobener Mängel`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vermieter(in),',
        paragraphs: [
          `mit Schreiben vom ${nDate} hatte ich Ihnen folgenden erheblichen Mangel in meiner Mietwohnung angezeigt und um Behebung gebeten:`,
          `„${def}“`,
          `Bis zum heutigen Tag ist keine fachgerechte Beseitigung der Störung erfolgt. Aufgrund der andauernden Beeinträchtigung des Wohnwerts bin ich gemäß § 536 Abs. 1 BGB kraft Gesetzes berechtigt, die Miete für die Dauer des Mangels angemessen zu mindern.`,
          `Ich kündige Ihnen daher an, dass ich die monatliche Warmmiete ab dem kommenden Monat um ${pct} mindern werde. Sollte ich die Miete per Dauerauftrag überweisen, werde ich den geminderten Betrag anpassen. Eine bereits gezahlte Miete für den laufenden Monat behalte ich mir vor zurückzufordern.`,
          `Sobald die Mängel vollständig und dauerhaft instand gesetzt wurden, wird die Miete wieder in voller Höhe entrichtet.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'vermieter-nebenkosten-widerspruch',
    categoryId: 'vermieter',
    isPremium: false,
    title: {
      ro: 'Contestație la decontul anual de cheltuieli / întreținere (Nebenkostenabrechnung)',
      de: 'Widerspruch gegen die Betriebs- und Nebenkostenabrechnung',
    },
    shortDescription: {
      ro: 'Pentru solicitarea chitanțelor doveditoare (Belegeinsicht) și refuzul costurilor nejustificate.',
      de: 'Fristwahrender Widerspruch mit Bitte um Belegeinsicht und Überprüfung der Abrechnungsposten.',
    },
    bureaucraticTip: {
      ro: 'Termenul legal de contestație pentru Nebenkosten este de 12 luni de la primirea decontului (§ 556 Abs. 3 BGB). Dacă proprietarul a trimis decontul cu întârziere (după 12 luni de la sfârșitul anului facturat), nu mai are dreptul să ceară bani în plus!',
      de: 'Mieter haben 12 Monate Zeit (§ 556 Abs. 3 BGB) für Einwendungen. Sie haben das Recht auf Einsicht in alle Originalbelege.',
    },
    fields: [
      {
        id: 'settlementPeriod',
        label: { ro: 'Perioada de facturare (Abrechnungszeitraum)', de: 'Abrechnungszeitraum' },
        placeholder: { ro: 'ex: 01.01.2024 bis 31.12.2024', de: 'z.B. Kalenderjahr 2024' },
        type: 'text',
        required: true,
      },
      {
        id: 'invoiceDate',
        label: { ro: 'Data decontului primit de la proprietar', de: 'Datum der Abrechnung' },
        type: 'date',
        required: true,
      },
      {
        id: 'demandedAmount',
        label: { ro: 'Suma cerută suplimentar ca rest de plată (€)', de: 'Geforderter Nachzahlungsbetrag (€)' },
        placeholder: { ro: 'ex: 480,50', de: 'z.B. 480,50' },
        type: 'text',
        required: true,
      },
      {
        id: 'complaintReason',
        label: { ro: 'Motivele contestației (ex: cheltuieli administrative nepermise, creștere inexplicabilă a căldurii)', de: 'Einwand / Unstimmigkeiten' },
        placeholder: { ro: 'ex: Unerklärlich hohe Heizkostensteigerung im Vergleich zum Vorjahr sowie nicht umlagefähige Verwaltungskosten.', de: 'z.B. Hoher Anstieg der Heizkosten' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const period = answers.settlementPeriod || 'den genannten Zeitraum';
      const invDate = answers.invoiceDate || 'kürzlich erhalten';
      const amount = answers.demandedAmount || 'die geforderte Summe';
      const reason = answers.complaintReason || 'erhebliche Unstimmigkeiten bei den einzelnen Kostenpositionen';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Widerspruch gegen die Nebenkostenabrechnung vom ${invDate} für den Zeitraum ${period}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vermieter(in),',
        paragraphs: [
          `ich habe Ihre Betriebskostenabrechnung vom ${invDate} für den Zeitraum ${period} erhalten, in welcher Sie eine Nachzahlung in Höhe von ${amount} € fordern.`,
          `Nach sorgfältiger Prüfung der Abrechnung lege ich hiermit form- und fristgerecht`,
          `WIDERSPRUCH`,
          `gegen die vorgenannte Nebenkostenabrechnung ein. Folgende Punkte sind unklar bzw. nicht nachvollziehbar:`,
          `„${reason}“`,
          `Zur abschließenden Prüfung meines Einwandes mache ich hiermit mein gesetzliches Recht auf Belegeinsicht gemäß § 259 BGB geltend. Ich bitte Sie höflich, mir Kopien der entsprechenden Originalbelege (Rechnungen, Ableseprotokolle, Verträge mit Dienstleistern) zukommen zu lassen oder mir einen Termin zur Belegeinsicht vorzuschlagen.`,
          `Bis zur Klärung der Sachlage und vollständigen Prüfung der Rechnungsbelege behalte ich mir vor, die geforderte Nachzahlung vorläufig zurückzubehalten bzw. unter ausdrücklichem Vorbehalt der Rückforderung zu leisten.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'vermieter-tierhaltung-antrag',
    categoryId: 'vermieter',
    isPremium: false,
    title: {
      ro: 'Cerere de aprobare pentru animal de companie (Haustierhaltung)',
      de: 'Antrag auf Genehmigung zur Haltung eines Haustieres (Hund / Katze)',
    },
    shortDescription: {
      ro: 'Pentru obținerea acordului scris al proprietarului pentru câine sau pisică în apartament.',
      de: 'Schriftliche Anfrage zur Genehmigung nach ständiger Rechtsprechung des Bundesgerichtshofs (BGH).',
    },
    bureaucraticTip: {
      ro: 'Conform Curții Federale de Justiție (BGH), o interdicție generală a animalelor din contract este nulă. Proprietarul poate refuza doar dacă există motive obiective (zgomot extrem, spațiu insuficient). Menționarea rasei și a asigurării ajută enorm!',
      de: 'Generelle Haustierverbote in Formularmietverträgen sind nach BGH-Rechtsprechung unwirksam. Eine Einzelfallabwägung ist erforderlich.',
    },
    fields: [
      {
        id: 'apartmentAddress',
        label: { ro: 'Adresa locuinței închiriate', de: 'Mietobjekt' },
        placeholder: { ro: 'ex: Schillerstraße 12, 10115 Berlin, 3. OG links', de: 'z.B. Schillerstraße 12' },
        type: 'text',
        required: true,
      },
      {
        id: 'petTypeBreed',
        label: { ro: 'Specia, rasa și mărimea animalului', de: 'Tierart, Rasse und Größe' },
        placeholder: { ro: 'ex: Ein kleiner Hund, Rasse Französische Bulldogge, ausgewachsen ca. 12 kg', de: 'z.B. Hund, Rasse Golden Retriever' },
        type: 'text',
        required: true,
      },
      {
        id: 'assuranceDetails',
        label: { ro: 'Asigurare de răspundere (Tierhalterhaftpflicht) și îngrijire', de: 'Haftpflichtversicherung & Haltung' },
        placeholder: { ro: 'ex: Eine Hundehalterhaftpflichtversicherung wird abgeschlossen. Der Hund ist stubenrein und ruhig.', de: 'z.B. Haftpflichtversicherung liegt vor' },
        defaultValue: 'Eine entsprechende Tierhalterhaftpflichtversicherung wird abgeschlossen. Das Tier ist stubenrein und gut erzogen.',
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const apt = answers.apartmentAddress || `${sender.street}, ${sender.postalCode} ${sender.city}`;
      const pet = answers.petTypeBreed || 'ein Haustier';
      const assurance = answers.assuranceDetails || 'Eine Tierhalterhaftpflichtversicherung wird vorgelegt.';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `Antrag auf Genehmigung zur Haltung eines Haustieres – Mietwohnung: ${apt}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vermieter(in),',
        paragraphs: [
          `als Mieter der oben genannten Wohnung wende ich mich heute mit einer Bitte an Sie. Ich beabsichtige, folgendes Haustier in meiner Wohnung aufzunehmen:`,
          `Art / Rasse: ${pet}`,
          `Ich versichere Ihnen, dass durch das Tier keinerlei Belästigungen (wie andauerndes Bellen oder Geruchsbelästigung) für die Nachbarschaft entstehen werden und das Mietobjekt stets pfleglich behandelt wird.`,
          `${assurance}`,
          `Gemäß der ständigen Rechtsprechung des Bundesgerichtshofs (BGH, Az. VIII ZR 168/12) bedarf die Zustimmung einer Interessenabwägung im Einzelfall. Da keine berechtigten Interessen Dritter beeinträchtigt werden, bitte ich Sie höflich um Ihre schriftliche Erlaubnis zur Haltung des Tieres.`,
          `Für eventuelle Rückfragen oder ein persönliches Kennenlernen stehe ich Ihnen jederzeit gern zur Verfügung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'vermieter-mietschuldenfreiheit',
    categoryId: 'vermieter',
    isPremium: false,
    title: {
      ro: 'Cerere adeverință lipsă datorii chirie (Mietschuldenfreiheitsbescheinigung)',
      de: 'Anforderung einer Mietschuldenfreiheitsbescheinigung',
    },
    shortDescription: {
      ro: 'Document obligatoriu cerut de noii proprietari la căutarea unei noi chirii în Germania.',
      de: 'Bestätigung des Vermieters über pünktlich und lückenlos bezahlte Mieten für Wohnungsbewerbungen.',
    },
    bureaucraticTip: {
      ro: 'Fără această adeverință este aproape imposibil să găsești un apartament nou în marile orașe din Germania. Proprietarul actual o eliberează de regulă în termen de câteva zile.',
      de: 'Die Bescheinigung belegt dem künftigen Vermieter Ihre Zuverlässigkeit als Mieter.',
    },
    fields: [
      {
        id: 'apartmentLocation',
        label: { ro: 'Adresa locuinței actuale', de: 'Anschrift der Mietwohnung' },
        placeholder: { ro: 'ex: Bahnhofstraße 20, 80335 München', de: 'z.B. Bahnhofstraße 20' },
        type: 'text',
        required: true,
      },
      {
        id: 'tenantPeriod',
        label: { ro: 'Perioada de când locuiți în imobil', de: 'Mietzeitraum (seit wann)' },
        placeholder: { ro: 'ex: seit dem 01.03.2021', de: 'z.B. seit 01.03.2021' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const apt = answers.apartmentLocation || `${sender.street}, ${sender.postalCode} ${sender.city}`;
      const period = answers.tenantPeriod || 'Mietdauer';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Bitte um Ausstellung einer Mietschuldenfreiheitsbescheinigung – Wohnung: ${apt}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vermieter(in),',
        paragraphs: [
          `ich bewohne die oben genannte Wohnung ${period}. Da ich mich derzeit für eine neue Wohnung bewerbe, benötigt der potenzielle Vermieter als festen Bestandteil der Bewerbungsunterlagen eine sogenannte Mietschuldenfreiheitsbescheinigung.`,
          `Wie Sie Ihren Buchungsunterlagen entnehmen können, sind sämtliche Mietzahlungen sowie Betriebskostenvorauszahlungen während des gesamten Mietverhältnisses stets pünktlich und vollständig bei Ihnen eingegangen. Es bestehen keinerlei Zahlungsrückstände.`,
          `Ich bitte Sie daher höflich, mir eine kurze schriftliche Bestätigung auszustellen, dass keine Mietrückstände vorliegen.`,
          `Sie können mir die Bescheinigung gerne postalisch an meine Anschrift oder vorab per E-Mail an ${sender.email || 'meine E-Mail-Adresse'} zukommen lassen. Ich danke Ihnen herzlich im Voraus für Ihre Mühe.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'vermieter-reparatur-anfordern',
    categoryId: 'vermieter',
    isPremium: false,
    title: {
      ro: 'Solicitare urgentă de reparație / trimitere meșter (Reparaturanforderung)',
      de: 'Aufforderung zur Mängelbeseitigung und Reparatur',
    },
    shortDescription: {
      ro: 'Solicitarea trimiterii unui meșter pentru remedierea defecțiunilor (încălzire, țevi, geamuri, electrocasnice).',
      de: 'Konkrete Aufforderung an den Vermieter zur Beauftragung eines Handwerkers mit Fristsetzung.',
    },
    bureaucraticTip: {
      ro: 'Conform § 535 BGB, proprietarul este obligat prin lege să suporte și să repare defecțiunile din locuință. Oferiți intervale orare în care meșterul are acces în locuință.',
      de: 'Geben Sie Zeitfenster an, zu denen Handwerker zwecks Terminabsprache Zutritt zur Wohnung erhalten können.',
    },
    fields: [
      {
        id: 'apartmentLocation',
        label: { ro: 'Adresa locuinței și etajul / numărul apartamentului', de: 'Mietobjekt (Adresse & Lage)' },
        placeholder: { ro: 'ex: Musterstraße 12, 10115 Berlin, 2. OG links', de: 'z.B. Musterstraße 12, 2. OG rechts' },
        type: 'text',
        required: true,
      },
      {
        id: 'defectSubject',
        label: { ro: 'Ce anume trebuie reparat? (ex: încălzire defectă, scurgere chiuvetă, clanță spartă)', de: 'Was muss repariert werden?' },
        placeholder: { ro: 'ex: Defekte Heizungsanlage im Wohnzimmer / Undichte Rohrleitung im Badezimmer', de: 'z.B. Defekte Heizung / Undichter Wasserhahn' },
        type: 'text',
        required: true,
      },
      {
        id: 'repairDetails',
        label: { ro: 'Descrierea exactă a defecțiunii și când a apărut', de: 'Genaue Mängelbeschreibung' },
        placeholder: { ro: 'ex: Seit 3 Tagen wird der Heizkörper trotz voller Entlüftung nicht warm. Die Raumtemperatur sinkt deutlich.', de: 'z.B. Heizung bleibt trotz Entlüftung kalt.' },
        type: 'textarea',
        required: true,
      },
      {
        id: 'repairDeadline',
        label: { ro: 'Termen limită pentru finalizarea reparației', de: 'Frist zur Nachbesserung / Reparatur' },
        type: 'date',
        required: true,
      },
      {
        id: 'contactAvailability',
        label: { ro: 'Disponibilitate orară și număr de telefon pentru meșter', de: 'Erreichbarkeit & Terminvorschläge für Handwerker' },
        placeholder: { ro: 'ex: Werktags ab 16:30 Uhr telefonisch erreichbar unter 0176 12345678', de: 'z.B. Werktags ab 16:00 Uhr erreichbar' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const apt = answers.apartmentLocation || `${sender.street}, ${sender.postalCode} ${sender.city}`;
      const defect = answers.defectSubject || 'Mängel an der Mietsache';
      const details = answers.repairDetails || 'folgende Mängel liegen vor';
      const deadline = answers.repairDeadline || 'binnen 14 Tagen';
      const avail = answers.contactAvailability || 'nach telefonischer Vereinbarung';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `Aufforderung zur Reparatur / Mängelbeseitigung: ${defect} – Wohnung: ${apt}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vermieter(in),',
        paragraphs: [
          `in meiner oben genannten Mietwohnung ist folgender Mangel aufgetreten, der dringend fachgerecht repariert werden muss:`,
          `Betroffener Bereich: ${defect}\nBeschreibung:\n„${details}“`,
          `Gemäß § 535 Abs. 1 Satz 2 BGB ist der Vermieter verpflichtet, die Mietsache in einem zum vertragsgemäßen Gebrauch geeigneten Zustand zu erhalten.`,
          `Ich fordere Sie hiermit höflich auf, unverzüglich einen qualifizierten Fachbetrieb mit der Mängelbeseitigung zu beauftragen und die Reparatur bis spätestens zum ${deadline} abzuschließen.`,
          `Zur Terminabsprache und Besichtigung bzw. Durchführung der Arbeiten bin ich wie folgt erreichbar:\n${avail}`,
          `Sollte die Frist fruchtlos verstreichen, behalte ich mir vor, nach § 536a Abs. 2 BGB den Mangel selbst beseitigen zu lassen und Ersatz der erforderlichen Aufwendungen zu verlangen bzw. mit der Miete aufzurechnen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'vermieter-nebenkosten-frage',
    categoryId: 'vermieter',
    isPremium: false,
    title: {
      ro: 'Clarificare și verificare cheltuieli de întreținere (Nebenkostenabrechnung)',
      de: 'Fragen zur Nebenkostenabrechnung und Bitte um Belegeinsicht',
    },
    shortDescription: {
      ro: 'Solicitarea clarificării sumelor mari din factura anuală de întreținere și a copiilor după chitanțe.',
      de: 'Erläuterung unklarer Abrechnungsposten und Geltendmachung des Rechts auf Belegeinsicht gemäß § 259 BGB.',
    },
    bureaucraticTip: {
      ro: 'Aveți dreptul legal de a verifica toate facturile originale (Belegeinsicht). Până când proprietarul nu vă pune la dispoziție documentele doveditoare, puteți reține plata diferenței cerute!',
      de: 'Mieter haben ein gesetzliches Recht auf Einsichtnahme in die Originalbelege der Nebenkostenabrechnung (§ 259 BGB).',
    },
    fields: [
      {
        id: 'apartmentLocation',
        label: { ro: 'Adresa locuinței închiriate', de: 'Mietobjekt' },
        placeholder: { ro: 'ex: Musterstraße 15, 80331 München', de: 'z.B. Musterstraße 15, München' },
        type: 'text',
        required: true,
      },
      {
        id: 'billingPeriod',
        label: { ro: 'Perioada de decontare (Abrechnungszeitraum)', de: 'Abrechnungszeitraum' },
        placeholder: { ro: 'ex: 01.01.2024 bis 31.12.2024', de: 'z.B. 01.01.2024 bis 31.12.2024' },
        type: 'text',
        required: true,
      },
      {
        id: 'billingDate',
        label: { ro: 'Data facturii primite (Datum der Abrechnung)', de: 'Datum der Nebenkostenabrechnung' },
        type: 'date',
        required: true,
      },
      {
        id: 'questionDetails',
        label: { ro: 'Care sunt cheltuielile neclare pe care le contești sau ceri lămuriri?', de: 'Unklare Abrechnungspositionen / Fragen' },
        placeholder: { ro: 'ex: Die Positionen „Hausmeisterkosten“ und „Gartenpflege“ sind im Vergleich zum Vorjahr um mehr als 60 % gestiegen. Zudem ist der Verteilerschlüssel für Heizkosten nicht nachvollziehbar.', de: 'z.B. Hohe Steigerung bei Hausmeister- oder Heizkosten.' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const apt = answers.apartmentLocation || `${sender.street}, ${sender.postalCode} ${sender.city}`;
      const period = answers.billingPeriod || 'den vergangenen Abrechnungszeitraum';
      const bDate = answers.billingDate || 'kürzlich zugegangen';
      const questions = answers.questionDetails || 'einige Abrechnungsposten bedürfen der Klärung';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Fragen zur Nebenkostenabrechnung für den Zeitraum ${period} – Wohnung: ${apt}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vermieter(in),',
        paragraphs: [
          `ich beziehe mich auf Ihre Nebenkostenabrechnung vom ${bDate} für den Abrechnungszeitraum ${period} betreffend die oben genannte Wohnung.`,
          `Bei der Durchsicht der Abrechnung sind folgende Punkte und erhebliche Kostensteigerungen unklar geblieben:`,
          `„${questions}“`,
          `Gemäß § 259 BGB steht mir als Mieter das Recht zu, die den Abrechnungsposten zugrunde liegenden Originalbelege, Rechnungen und Zahlungsnachweise einzusehen.`,
          `Ich bitte Sie daher höflich, mir zur Klärung Kopien bzw. Scans der entsprechenden Belege zukommen zu lassen oder mir einen zeitnahen Termin zur Belegeinsicht vor Ort vorzuschlagen.`,
          `Bis zur Klärung der genannten Punkte und Gewährung der Belegeinsicht mache ich von meinem gesetzlichen Zurückbehaltungsrecht hinsichtlich einer etwaigen Nachforderung Gebrauch.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
];

