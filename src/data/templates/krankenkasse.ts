import { LetterTemplate } from '../../types';

export const krankenkasseTemplates: LetterTemplate[] = [
  {
    id: 'kasse-zuzahlungsbefreiung',
    categoryId: 'krankenkasse',
    isPremium: false,
    title: {
      ro: 'Cerere de scutire de coplată medicamente & spital (Zuzahlungsbefreiung)',
      de: 'Antrag auf Befreiung von gesetzlichen Zuzahlungen (§ 62 SGB V)',
    },
    shortDescription: {
      ro: 'Când ai atins limita de 2% (sau 1% pentru bolnavi cronici) din venitul anual brut al familiei.',
      de: 'Befreiung von Rezeptgebühren und Zuzahlungen bei Erreichen der Belastungsgrenze.',
    },
    bureaucraticTip: {
      ro: 'Păstrați toate bonurile de la farmacie (Rezeptgebühr) și chitanțele de la fizioterapie sau spital. Ele se atașează ca anexe la această cerere!',
      de: 'Fügen Sie alle gesammelten Zuzahlungsquittungen und Einkommensnachweise (z.B. Gehaltsabrechnungen) als Kopie bei.',
    },
    fields: [
      {
        id: 'insuranceNumber',
        label: { ro: 'Număr de asigurat (Versichertennummer)', de: 'Krankenversichertennummer (KVNR)' },
        placeholder: { ro: 'ex: A123456789 (se găsește pe cardul de sănătate)', de: 'z.B. A123456789' },
        type: 'text',
        required: true,
      },
      {
        id: 'taxYear',
        label: { ro: 'Anul calendaristic pentru care ceri scutirea', de: 'Kalenderjahr' },
        placeholder: { ro: 'ex: 2025', de: 'z.B. 2025' },
        defaultValue: new Date().getFullYear().toString(),
        type: 'text',
        required: true,
      },
      {
        id: 'isChronic',
        label: { ro: 'Ești încadrat ca bolnav cronic (limita de 1%)?', de: 'Chronisch krank (1%-Regelung)?' },
        type: 'select',
        options: [
          { value: 'nein', label: { ro: 'Nu (se aplică limita generală de 2%)', de: 'Nein (Regelgrenze 2%)' } },
          { value: 'ja', label: { ro: 'Da (atașez adeverința medicului pentru boală cronică)', de: 'Ja (chronische Erkrankung liegt vor)' } },
        ],
        defaultValue: 'nein',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const kvnr = answers.insuranceNumber || 'N/A';
      const year = answers.taxYear || new Date().getFullYear().toString();
      const chronic = answers.isChronic === 'ja';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Köln',
        subject: `Antrag auf Befreiung von Zuzahlungen für das Kalenderjahr ${year} – Versichertennummer: ${kvnr}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit beantrage ich die Befreiung von den gesetzlichen Zuzahlungen gemäß § 62 SGB V für das Kalenderjahr ${year}.`,
          chronic
            ? `Aufgrund einer nachgewiesenen schwerwiegenden chronischen Erkrankung beläuft sich meine persönliche Belastungsgrenze auf 1 % meiner jährlichen Bruttoeinnahmen zum Lebensunterhalt.`
            : `Die gesetzliche Belastungsgrenze in Höhe von 2 % meiner jährlichen Bruttoeinnahmen zum Lebensunterhalt für das laufende Jahr ist durch die bereits geleisteten Zahlungen erreicht.`,
          `In der Anlage übersende ich Ihnen die entsprechenden Originalbelege bzw. Quittungen über die geleisteten Zuzahlungen sowie die Einkommensnachweise des Haushalts zur Überprüfung.`,
          `Ich bitte Sie, meinen Antrag zu prüfen und mir den Befreiungsausweis zeitnah an die oben stehende Anschrift zu übermitteln. Sollte sich ein Erstattungsanspruch für darüber hinaus gezahlte Beträge ergeben, bitte ich um Überweisung auf mein bekanntes Bankkonto.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Zuzahlungsbelege und Quittungen', 'Einkommensnachweise', ...(chronic ? ['Ärztliche Chronikerbescheinigung'] : [])],
      };
    },
  },
  {
    id: 'kasse-kostenerstattung',
    categoryId: 'krankenkasse',
    isPremium: false,
    title: {
      ro: 'Cerere de decontare a cheltuielilor medicale (Kostenerstattung)',
      de: 'Antrag auf Kostenerstattung für medizinische Leistungen',
    },
    shortDescription: {
      ro: 'Decontarea tratamentelor de urgență achitate personal sau a serviciilor aprobate.',
      de: 'Erstattung selbst gezahlter Rechnungen für Arztbesuche, Medikamente oder Notfallbehandlungen.',
    },
    bureaucraticTip: {
      ro: 'Anexați întotdeauna factura originală (Rechnung) și dovada plății (extras bancar sau bon fiscal).',
      de: 'Fügen Sie stets die Originalrechnungen und Zahlungsbelege als Anlage bei.',
    },
    fields: [
      {
        id: 'insuranceNumber',
        label: { ro: 'Număr de asigurat (Versichertennummer)', de: 'Krankenversichertennummer' },
        placeholder: { ro: 'ex: X99812401', de: 'z.B. X99812401' },
        type: 'text',
        required: true,
      },
      {
        id: 'treatmentDetails',
        label: { ro: 'Detalii tratament / medicament achitat', de: 'Art der Behandlung / Auslage' },
        placeholder: { ro: 'ex: Notfallbehandlung während des Aufenthalts in Rumänien / Zahnbehandlung', de: 'z.B. Notfallbehandlung im EU-Ausland' },
        type: 'textarea',
        required: true,
      },
      {
        id: 'invoiceAmount',
        label: { ro: 'Suma de decontat (Euro)', de: 'Rechnungsbetrag (€)' },
        placeholder: { ro: 'ex: 180,50', de: 'z.B. 180,50' },
        type: 'text',
        required: true,
      },
      {
        id: 'iban',
        label: { ro: 'IBAN pentru virament', de: 'IBAN für Erstattung' },
        placeholder: { ro: 'ex: DE12 3456 ...', de: 'z.B. DE12 ...' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const kvnr = answers.insuranceNumber || 'N/A';
      const details = answers.treatmentDetails || 'medizinische Behandlung';
      const amount = answers.invoiceAmount || '0,00';
      const iban = answers.iban || 'auf mein Girokonto';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Dortmund',
        subject: `Antrag auf Kostenerstattung – Versichertennummer: ${kvnr}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit reiche ich Ihnen die beigefügte Rechnung zur Kostenerstattung ein:`,
          `Angaben zur Leistung:\n„${details}“\nGesamtbetrag: ${amount} €`,
          `Da die medizinische Inanspruchnahme unaufschiebbar bzw. erstattungsfähig war, bitte ich um Prüfung und Überweisung des erstattungsfähigen Betrages auf folgendes Bankkonto:`,
          `Kontoinhaber: ${sender.fullName}\nIBAN: ${iban}`,
          `Für Rückfragen stehe ich Ihnen jederzeit gern zur Verfügung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Originalrechnung', 'Zahlungsnachweis'],
      };
    },
  },
  {
    id: 'kasse-krankengeld-nachfrage',
    categoryId: 'krankenkasse',
    isPremium: true,
    title: {
      ro: 'Solicitare privind indemnizația de boală (Krankengeld)',
      de: 'Sachstandsanfrage und Auszahlung des Krankengeldes',
    },
    shortDescription: {
      ro: 'Când concediul medical depășește 6 săptămâni și casa de asigurări întârzie plata indemnizației.',
      de: 'Dringende Nachfrage zur Berechnung und Auszahlung nach Ende der 6-wöchigen Entgeltfortzahlung.',
    },
    bureaucraticTip: {
      ro: 'Angajatorul plătește salariul în primele 6 săptămâni de boală (Entgeltfortzahlung). Din a 43-a zi, Krankenkasse plătește Krankengeld (~70% din salariul brut). Concediile trebuie să fie neîntrerupte!',
      de: 'Achten Sie auf eine lückenlose Krankschreibung, um den Krankengeldanspruch nicht zu gefährden.',
    },
    fields: [
      {
        id: 'insuranceNumber',
        label: { ro: 'Număr de asigurat (KVNR)', de: 'Versichertennummer' },
        type: 'text',
        required: true,
      },
      {
        id: 'sickSinceDate',
        label: { ro: 'Data de la care ești în concediu medical continuu', de: 'Arbeitsunfähig seit' },
        type: 'date',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const kvnr = answers.insuranceNumber || 'N/A';
      const sDate = answers.sickSinceDate || 'Beginn der Arbeitsunfähigkeit';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Hannover',
        subject: `Dringende Sachstandsanfrage zur Auszahlung des Krankengeldes – Vers.-Nr.: ${kvnr}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `ich befinde mich seit dem ${sDate} in ununterbrochener ärztlich attestierter Arbeitsunfähigkeit. Die 6-wöchige Entgeltfortzahlung durch meinen Arbeitgeber ist abgelaufen.`,
          `Bislang habe ich jedoch noch keinen Bescheid bzw. keine Auszahlung des mir zustehenden Krankengeldes gemäß § 44 SGB V erhalten. Da ich auf diese Entgeltersatzleistung zur Sicherung meines Lebensunterhalts und der laufenden Miete dringend angewiesen bin, bitte ich um unverzügliche Bearbeitung und Auszahlung.`,
          `Sollten für die abschließende Bearbeitung noch weitere ärztliche Bescheinigungen oder Angaben des Arbeitgebers fehlen, bitte ich um umgehende schriftliche oder telefonische Rückmeldung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kasse-familienversicherung-antrag',
    categoryId: 'krankenkasse',
    isPremium: false,
    title: {
      ro: 'Înscriere soț/soție și copii în asigurarea de familie gratuită (Familienversicherung § 10 SGB V)',
      de: 'Antrag auf Aufnahme in die kostenfreie Familienversicherung gemäß § 10 SGB V',
    },
    shortDescription: {
      ro: 'Copiii și partenerul fără venituri proprii sunt asigurați complet gratuit pe cardul tău de sănătate.',
      de: 'Beitragsfreie Mitversicherung von Ehegatten und Kindern in der gesetzlichen Krankenkasse.',
    },
    bureaucraticTip: {
      ro: 'Asigurarea de familie în Germania este 100% gratuită! Partenerul poate fi asigurat gratuit dacă venitul său lunar nu depășește limita de venit redus (Minijob-Grenze).',
      de: 'Voraussetzung ist der Wohnsitz in Deutschland und dass das regelmäßige monatliche Einkommen der Angehörigen die Geringfügigkeitsgrenze nicht übersteigt.',
    },
    fields: [
      {
        id: 'memberNumber',
        label: { ro: 'Numărul tău de asigurat titular (KVNR)', de: 'Ihre Versichertennummer' },
        placeholder: { ro: 'ex: X123456789', de: 'z.B. A123456789' },
        type: 'text',
        required: true,
      },
      {
        id: 'familyMembers',
        label: { ro: 'Numele, relația de rudenie și data nașterii persoanelor de asigurat', de: 'Name, Geburtsdatum und Verwandtschaftsverhältnis' },
        placeholder: { ro: 'ex: Ehefrau Elena Popa, geb. 20.08.1992 und Sohn Luca Popa, geb. 14.05.2021', de: 'z.B. Ehefrau & Kinder mit Geburtsdaten' },
        type: 'textarea',
        required: true,
      },
      {
        id: 'effectiveDate',
        label: { ro: 'Data de la care doriți începerea asigurării (ex: data căsătoriei sau sosirii în Germania)', de: 'Beginn der Versicherung ab' },
        type: 'date',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const kvnr = answers.memberNumber || 'N/A';
      const fam = answers.familyMembers || 'meine Familienangehörigen';
      const eDate = answers.effectiveDate || 'ab sofort';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Köln',
        subject: `Antrag auf Aufnahme in die Familienversicherung gemäß § 10 SGB V – Vers.-Nr.: ${kvnr}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `als beitragspflichtiges Mitglied Ihrer gesetzlichen Krankenkasse (Versichertennummer: ${kvnr}) beantrage ich hiermit mit Wirkung zum ${eDate} die Aufnahme folgender Familienangehöriger in die beitragsfreie Familienversicherung:`,
          `„${fam}“`,
          `Die gesetzlichen Voraussetzungen gemäß § 10 SGB V sind erfüllt: Die genannten Angehörigen haben ihren ständigen Wohnsitz in Deutschland und verfügen über kein eigenes regelmäßiges Einkommen oberhalb der gesetzlichen Minijob-Grenze.`,
          `Kopien der erforderlichen Nachweise (Heiratsurkunde, Geburtsurkunde(n) sowie ggf. Meldebescheinigung) habe ich diesem Schreiben zur Prüfung beigefügt.`,
          `Bitte senden Sie mir die Aufnahmebestätigung sowie die neuen elektronischen Gesundheitskarten (eGK) an meine oben genannte Anschrift.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Kopie der Heiratsurkunde / Geburtsurkunde(n)', 'Ggf. Meldebescheinigung'],
      };
    },
  },
  {
    id: 'kasse-kuendigung-kassenwechsel',
    categoryId: 'krankenkasse',
    isPremium: false,
    title: {
      ro: 'Schimbare casă de sănătate / Reziliere Krankenkasse (§ 175 SGB V)',
      de: 'Kündigung der Mitgliedschaft zur Krankenkasse / Kassenwechsel',
    },
    shortDescription: {
      ro: 'Pentru trecerea la o casă de asigurări cu contribuție suplimentară (Zusatzbeitrag) mai mică.',
      de: 'Kündigung nach 12 Monaten Mitgliedschaft oder Sonderkündigungsrecht bei Erhöhung des Zusatzbeitrags.',
    },
    bureaucraticTip: {
      ro: 'Dacă casa ta de sănătate mărește contribuția suplimentară (Zusatzbeitrag), ai drept de reziliere specială (Sonderkündigung) până la sfârșitul lunii respective! Continuitatea asigurării este garantată prin lege.',
      de: 'Die neue Krankenkasse übernimmt heutzutage die Abwicklung digital, dennoch dient dieses Schreiben zur rechtssicheren Dokumentation.',
    },
    fields: [
      {
        id: 'insuranceNumber',
        label: { ro: 'Numărul de asigurat (KVNR)', de: 'Ihre Versichertennummer' },
        placeholder: { ro: 'ex: A123456789', de: 'z.B. A123456789' },
        type: 'text',
        required: true,
      },
      {
        id: 'terminationDate',
        label: { ro: 'Data dorită pentru încetare (sau la primul termen legal)', de: 'Kündigungstermin' },
        type: 'date',
      },
      {
        id: 'specialRight',
        label: { ro: 'Este vorba de o reziliere specială din cauza măririi cotizației (Zusatzbeitrag)?', de: 'Sonderkündigungsrecht wegen Zusatzbeitragserhöhung?' },
        type: 'select',
        options: [
          { value: 'nein', label: { ro: 'Nu, reziliere ordinară (după minim 12 luni)', de: 'Nein, ordentliche Kündigung' } },
          { value: 'ja', label: { ro: 'Da, Sonderkündigung din cauza măririi Zusatzbeitrag', de: 'Ja, Sonderkündigung wegen Beitragserhöhung' } },
        ],
        defaultValue: 'nein',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const kvnr = answers.insuranceNumber || 'N/A';
      const tDate = answers.terminationDate || 'zum nächstmöglichen Zeitpunkt';
      const isSpecial = answers.specialRight === 'ja';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Leipzig',
        subject: isSpecial
          ? `Sonderkündigung meiner Mitgliedschaft gemäß § 175 Abs. 4 SGB V – Vers.-Nr.: ${kvnr}`
          : `Kündigung meiner Mitgliedschaft zur Krankenkasse – Vers.-Nr.: ${kvnr}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          isSpecial
            ? `hiermit mache ich von meinem gesetzlichen Sonderkündigungsrecht gemäß § 175 Abs. 4 SGB V Gebrauch und kündige meine Mitgliedschaft bei Ihrer Krankenkasse fristgerecht zum Ablauf des Monats, in dem die Erhöhung des Zusatzbeitrags wirksam wird, hilfsweise zum ${tDate}.`
            : `hiermit kündige ich meine Mitgliedschaft bei Ihrer Krankenkasse fristgerecht zum ${tDate}, hilfsweise zum nächstmöglichen Termin.`,
          `Ich habe die gesetzliche Bindefrist erfüllt bzw. nehme mein Sonderkündigungsrecht wahr. Ein lückenloser Krankenversicherungsschutz wird durch meine künftige Krankenkasse nahtlos sichergestellt.`,
          `Ich bitte Sie höflich, mir unverzüglich, spätestens binnen 14 Tagen, eine schriftliche Kündigungsbestätigung mit Angabe des genauen Beendigungsdatums zuzustellen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kasse-mutterschaftsgeld',
    categoryId: 'krankenkasse',
    isPremium: false,
    title: {
      ro: 'Cerere indemnizație de maternitate de la casa de sănătate (Mutterschaftsgeld § 24i SGB V)',
      de: 'Antrag auf Auszahlung von Mutterschaftsgeld gemäß § 24i SGB V',
    },
    shortDescription: {
      ro: 'Plata de până la 13 € pe zi de la Krankenkasse pentru perioada de concediu prenatal și postnatal.',
      de: 'Leistung der Krankenkasse für beschäftigte Schwangere während der Schutzfristen.',
    },
    bureaucraticTip: {
      ro: 'Casa de sănătate plătește până la 13 € / zi, iar angajatorul plătește diferența (Zuschuss zum Mutterschaftsgeld) până la salariul net complet!',
      de: 'Der Antrag kann frühestens 7 Wochen vor dem errechneten Geburtstermin mit dem „Zeugnis über den mutmaßlichen Tag der Entbindung“ gestellt werden.',
    },
    fields: [
      {
        id: 'insuranceNumber',
        label: { ro: 'Numărul de asigurat (KVNR)', de: 'Ihre Versichertennummer' },
        placeholder: { ro: 'ex: A123456789', de: 'z.B. A123456789' },
        type: 'text',
        required: true,
      },
      {
        id: 'dueDate',
        label: { ro: 'Data estimată a nașterii (conform adeverinței medicale)', de: 'Errechneter Geburtstermin' },
        type: 'date',
        required: true,
      },
      {
        id: 'employerName',
        label: { ro: 'Numele angajatorului actual', de: 'Name des aktuellen Arbeitgebers' },
        placeholder: { ro: 'ex: Muster GmbH, Berlin', de: 'z.B. Firma XYZ GmbH' },
        type: 'text',
        required: true,
      },
      {
        id: 'bankIban',
        label: { ro: 'IBAN pentru virarea indemnizației de maternitate', de: 'Auszahlungskonto (IBAN)' },
        placeholder: { ro: 'ex: DE89 3704 0044 0532 0130 00', de: 'z.B. DE89 ...' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const kvnr = answers.insuranceNumber || 'N/A';
      const dDate = answers.dueDate || 'gemäß Bescheinigung';
      const emp = answers.employerName || 'meinem Arbeitgeber';
      const iban = answers.bankIban || 'mein Girokonto';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Antrag auf Auszahlung von Mutterschaftsgeld gemäß § 24i SGB V – Vers.-Nr.: ${kvnr}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `ich befinde mich in einem bestehenden Beschäftigungsverhältnis bei ${emp} und bin bei Ihrer Krankenkasse mit Anspruch auf Krankengeld versichert.`,
          `Mein behandelnder Frauenarzt hat als mutmaßlichen Tag der Entbindung den ${dDate} festgestellt.`,
          `Hiermit beantrage ich die fristgerechte Auszahlung des gesetzlichen Mutterschaftsgeldes für die Schutzfrist vor der Entbindung (sechs Wochen vor dem Termin) sowie für die Zeit nach der Geburt (mindestens acht Wochen).`,
          `Das Original des ärztlichen „Zeugnisses über den mutmaßlichen Tag der Entbindung“ (gelber Beleg) ist diesem Schreiben im Original beigefügt.`,
          `Ich bitte Sie höflich, die Auszahlung auf folgende Bankverbindung vorzunehmen:`,
          `Kontoinhaber: ${sender.fullName}\nIBAN: ${iban}`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Ärztliches Zeugnis über den mutmaßlichen Entbindungstermin (Original)'],
      };
    },
  },
  {
    id: 'kasse-auskunft-anfrage',
    categoryId: 'krankenkasse',
    isPremium: false,
    title: {
      ro: 'Solicitare oficială de informații / lămuriri (Auskunftsersuchen)',
      de: 'Anfrage nach Auskunft zu Leistungen, Versicherungsschutz oder Beiträgen',
    },
    shortDescription: {
      ro: 'Pentru clarificarea acoperirii unui tratament, a stadiului unei cereri sau a istoricului de asigurare.',
      de: 'Formelle Auskunftsanfrage an die Krankenkasse mit Bitte um schriftliche Stellungnahme.',
    },
    bureaucraticTip: {
      ro: 'Conform §§ 13–15 SGB I, casele de asigurări de sănătate din Germania au obligația legală de a oferi consiliere și informații complete asiguraților (Beratungs- und Auskunftspflicht).',
      de: 'Die gesetzlichen Krankenkassen sind nach §§ 13–15 SGB I gesetzlich zur umfassenden Aufklärung und Beratung verpflichtet.',
    },
    fields: [
      {
        id: 'insuranceNumber',
        label: { ro: 'Număr de asigurat (KVNR de pe cardul de sănătate)', de: 'Krankenversichertennummer (KVNR)' },
        placeholder: { ro: 'ex: A123456789', de: 'z.B. A123456789' },
        type: 'text',
        required: true,
      },
      {
        id: 'inquirySubject',
        label: { ro: 'Subiectul solicitării (ex: Acoperire tratament stomatologic / Istoric asigurare)', de: 'Gegenstand der Anfrage' },
        placeholder: { ro: 'ex: Kostenübernahme für Zahnersatz / Heilmittel / Rehabilitationsmaßnahme', de: 'z.B. Leistungsanspruch für Heilmittel' },
        type: 'text',
        required: true,
      },
      {
        id: 'inquiryDetails',
        label: { ro: 'Ce informații concrete doriți să primiți de la Krankenkasse?', de: 'Konkrete Fragen und Sachverhalt' },
        placeholder: { ro: 'ex: Ich bitte um verbindliche Auskunft darüber, ob und in welcher Höhe die Kosten für die geplante Behandlung übernommen werden und welche Unterlagen dafür erforderlich sind.', de: 'z.B. Genaue Auskunft über Leistungsvoraussetzungen' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const kvnr = answers.insuranceNumber || 'N/A';
      const subj = answers.inquirySubject || 'Leistungsansprüche und Versicherungsschutz';
      const details = answers.inquiryDetails || 'folgende Sachverhalte bedürfen der Klärung';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Köln',
        subject: `Anfrage nach Auskunft: ${subj} – Versichertennummer: ${kvnr}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `als bei Ihrer Krankenkasse Versicherte(r) (Versichertennummer: ${kvnr}) wende ich mich mit einer Bitte um verbindliche Auskunft an Sie.`,
          `Mein Anliegen betrifft Folgendes:`,
          `„${details}“`,
          `Gemäß §§ 13, 14 und 15 des Ersten Buches Sozialgesetzbuch (SGB I) besteht ein gesetzlicher Anspruch auf Aufklärung, Beratung und Auskunft über die Rechte und Pflichten nach dem Sozialgesetzbuch.`,
          `Ich bitte Sie höflich, meine Anfrage wohlwollend zu prüfen und mir eine schriftliche Stellungnahme an meine oben genannte Anschrift zukommen zu lassen.`,
          `Für eventuelle Rückfragen stehe ich Ihnen jederzeit gerne telefonisch oder schriftlich zur Verfügung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kasse-adressenaenderung',
    categoryId: 'krankenkasse',
    isPremium: false,
    title: {
      ro: 'Notificare schimbare de adresă către Krankenkasse (Adressänderung)',
      de: 'Mitteilung über Wohnsitz- und Adressänderung bei der Krankenkasse',
    },
    shortDescription: {
      ro: 'Pentru actualizarea domiciliului și trimiterea corectă a cardului de sănătate sau a corespondenței.',
      de: 'Aktualisierung der Versichertendaten bei Umzug zur Vermeidung von Rückläufern und Zustellfehlern.',
    },
    bureaucraticTip: {
      ro: 'Notificarea noii adrese este foarte importantă pentru a nu pierde scrisorile de recalculare a contribuțiilor sau deciziile importante. Cardul de sănătate existent (eGK) se va actualiza automat la primul consult la cabinetul medical!',
      de: 'Die elektronische Gesundheitskarte aktualisiert die neue Anschrift beim nächsten Einlesen in der Arztpraxis automatisch online.',
    },
    fields: [
      {
        id: 'insuranceNumber',
        label: { ro: 'Numărul de asigurat (KVNR)', de: 'Krankenversichertennummer (KVNR)' },
        placeholder: { ro: 'ex: X99812401', de: 'z.B. X99812401' },
        type: 'text',
        required: true,
      },
      {
        id: 'moveDate',
        label: { ro: 'Data mutării la noua adresă', de: 'Datum des Umzugs' },
        type: 'date',
        required: true,
      },
      {
        id: 'oldAddress',
        label: { ro: 'Vechea adresă completă', de: 'Bisherige Wohnanschrift' },
        placeholder: { ro: 'ex: Hauptstraße 10, 50667 Köln', de: 'z.B. Hauptstraße 10, 50667 Köln' },
        type: 'text',
        required: true,
      },
      {
        id: 'newAddress',
        label: { ro: 'Noua adresă completă', de: 'Neue Wohnanschrift' },
        placeholder: { ro: 'ex: Rheinstraße 25, 40213 Düsseldorf', de: 'z.B. Rheinstraße 25, 40213 Düsseldorf' },
        type: 'text',
        required: true,
      },
      {
        id: 'alsoFamilyMembers',
        label: { ro: 'Se aplică și membrilor de familie asigurați împreună (Familienversicherung)?', de: 'Gilt die Änderung auch für familienversicherte Angehörige?' },
        type: 'select',
        options: [
          { value: 'ja', label: { ro: 'Da, pentru toți membrii de familie din gospodărie', de: 'Ja, für die gesamte Familie im Haushalt' } },
          { value: 'nur_ich', label: { ro: 'Doar pentru mine (titular)', de: 'Nur für mich als Hauptversicherte(n)' } },
        ],
        defaultValue: 'ja',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const kvnr = answers.insuranceNumber || 'N/A';
      const mDate = answers.moveDate || 'kürzlich';
      const oldA = answers.oldAddress || 'die bisherige Adresse';
      const newA = answers.newAddress || `${sender.street}, ${sender.postalCode} ${sender.city}`;
      const fam = answers.alsoFamilyMembers === 'ja' ? ' Diese Adressänderung gilt gleichermaßen für alle über mich familienversicherten Angehörigen.' : '';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Köln',
        subject: `Mitteilung über Wohnsitz- und Adressänderung – Versichertennummer: ${kvnr}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit teile ich Ihnen mit, dass sich mein ständiger Wohnsitz mit Wirkung zum ${mDate} geändert hat.${fam}`,
          `Bisherige Anschrift:\n${oldA}`,
          `Neue Anschrift ab ${mDate}:\n${newA}`,
          `Ich bitte Sie, meine neuen Kontaktdaten in Ihrem Versichertenverzeichnis unter meiner Versichertennummer ${kvnr} zu hinterlegen und künftigen Schriftverkehr ausschließlich an die neue Anschrift zu richten.`,
          `Bitte senden Sie mir eine kurze Bestätigung der Datenaktualisierung zu.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kasse-mitgliedsbescheinigung-anfordern',
    categoryId: 'krankenkasse',
    isPremium: false,
    title: {
      ro: 'Solicitare adeverință de asigurat (Mitgliedsbescheinigung)',
      de: 'Anforderung einer Mitgliedsbescheinigung / Versicherungsbestätigung',
    },
    shortDescription: {
      ro: 'Pentru noul loc de muncă, facultate, școală, primărie sau autorități germane.',
      de: 'Ausstellung eines schriftlichen Nachweises über den bestehenden gesetzlichen Krankenversicherungsschutz.',
    },
    bureaucraticTip: {
      ro: 'Adeverința de asigurat (Mitgliedsbescheinigung zur Vorlage bei ...) este cerută la fiecare angajare în Germania și la înscrierea la facultate. Krankenkasse o poate trimite prin poștă sau e-mail.',
      de: 'Geben Sie den Verwendungszweck (z.B. neuer Arbeitgeber oder Hochschule) an, damit die Bescheinigung formgerecht ausgestellt wird.',
    },
    fields: [
      {
        id: 'insuranceNumber',
        label: { ro: 'Numărul de asigurat (KVNR)', de: 'Krankenversichertennummer (KVNR)' },
        placeholder: { ro: 'ex: A123456789', de: 'z.B. A123456789' },
        type: 'text',
        required: true,
      },
      {
        id: 'purpose',
        label: { ro: 'Destinația adeverinței (pentru ce instituție sau scop)', de: 'Verwendungszweck / Vorlage bei' },
        placeholder: { ro: 'ex: Zur Vorlage beim neuen Arbeitgeber / Hochschule / Bürgeramt', de: 'z.B. Zur Vorlage beim neuen Arbeitgeber' },
        type: 'text',
        required: true,
      },
      {
        id: 'deliveryMode',
        label: { ro: 'Cum doriți să primiți adeverința?', de: 'Gewünschte Zustellungsart' },
        type: 'select',
        options: [
          { value: 'post_und_mail', label: { ro: 'Prin poștă și prin e-mail (PDF)', de: 'Per Post und digital per E-Mail (PDF)' } },
          { value: 'nur_post', label: { ro: 'Numai prin poștă la adresa mea', de: 'Ausschließlich per Post' } },
        ],
        defaultValue: 'post_und_mail',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const kvnr = answers.insuranceNumber || 'N/A';
      const purp = answers.purpose || 'behördliche bzw. arbeitsrechtliche Zwecke';
      const emailNote = answers.deliveryMode === 'post_und_mail' && sender.email
        ? ` Gerne können Sie mir die Bescheinigung vorab digital per E-Mail an ${sender.email} übermitteln.`
        : '';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt',
        subject: `Anforderung einer Mitgliedsbescheinigung – Versichertennummer: ${kvnr}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `für ${purp} benötige ich zeitnah eine offizielle Bestätigung über meine bestehende Mitgliedschaft und den Krankenversicherungsschutz bei Ihrer Krankenkasse.`,
          `Ich bitte Sie daher höflich, mir eine entsprechende Mitgliedsbescheinigung (Versicherungsbestätigung) auszustellen und an meine oben angegebene Anschrift zu übersenden.${emailNote}`,
          `Ich bedanke mich herzlich für Ihre zügige Bearbeitung meines Anliegens.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
];

