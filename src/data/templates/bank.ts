import { LetterTemplate } from '../../types';

export const bankTemplates: LetterTemplate[] = [
  {
    id: 'bank-kuendigung-girokonto',
    categoryId: 'bank',
    isPremium: false,
    title: {
      ro: 'Închiderea contului bancar curent (Girokonto-Kündigung)',
      de: 'Kündigung des Girokontos und Übertrag des Restguthabens',
    },
    shortDescription: {
      ro: 'Închiderea contului bancar și transferul soldului rămas către o altă bancă.',
      de: 'Auflösung des Bankkontos mit Anweisung zur Überweisung des Guthabens.',
    },
    bureaucraticTip: {
      ro: 'Asigurați-vă că ați schimbat contul pentru salariu și utilități înainte de închidere. Cardul de debit / credit se distruge sau se taie.',
      de: 'Kündigen Sie erst, wenn alle Daueraufträge und Lastschriften auf das neue Konto umgestellt sind.',
    },
    fields: [
      {
        id: 'ibanClose',
        label: { ro: 'IBAN-ul contului pe care dorești să îl închizi', de: 'Zu kündigende IBAN' },
        placeholder: { ro: 'ex: DE12 5001 0517 ...', de: 'z.B. DE12 5001 0517 ...' },
        type: 'text',
        required: true,
      },
      {
        id: 'ibanTransfer',
        label: { ro: 'IBAN-ul noului cont unde să fie transferat soldul rămas', de: 'Neue IBAN für Restguthaben' },
        placeholder: { ro: 'ex: DE89 3704 0044 ...', de: 'z.B. DE89 3704 0044 ...' },
        type: 'text',
        required: true,
      },
      {
        id: 'accountHolder',
        label: { ro: 'Titularul noului cont (dacă diferă)', de: 'Kontoinhaber neues Konto' },
        placeholder: { ro: 'același (sau specifică numele)', de: 'wie Absender' },
        type: 'text',
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const oldIban = answers.ibanClose || 'N/A';
      const newIban = answers.ibanTransfer || 'mein anderes Konto';
      const holder = answers.accountHolder || sender.fullName;

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Kündigung meines Girokontos – IBAN: ${oldIban}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit kündige ich mein oben genanntes Girokonto nebst allen dazugehörigen Karten (Debitkarten, Kreditkarten) sowie den Online-Banking-Zugang fristgerecht zum nächstmöglichen Termin.`,
          `Ein etwaig vorhandenes Restguthaben nach Verrechnung aller noch offenen Buchungsposten überweisen Sie bitte auf folgendes Bankkonto:`,
          `Kontoinhaber: ${holder}\nIBAN: ${newIban}`,
          `Ich bestätige, dass ich sämtliche mit dem Konto verknüpften Zahlungskarten nach Erhalt der Kündigungsbestätigung unbrauchbar machen werde.`,
          `Bitte senden Sie mir eine schriftliche Bestätigung der Kontoauflösung und die abschließende Abrechnung an meine oben angegebene Anschrift.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'bank-lastschrift-widerspruch',
    categoryId: 'bank',
    isPremium: false,
    title: {
      ro: 'Refuz plată / debitare neautorizată de pe cont (Lastschrift-Widerspruch)',
      de: 'Widerspruch gegen eine unberechtigte Lastschrift / Abbuchung',
    },
    shortDescription: {
      ro: 'Când o firmă a retras bani din contul tău fără drept sau după ce ai reziliat contractul.',
      de: 'Rückbuchung einer unberechtigten oder fehlerhaften SEPA-Lastschrift binnen 8 bzw. 13 Monaten.',
    },
    bureaucraticTip: {
      ro: 'Pentru debitări autorizate aveți 8 săptămâni să cereți banii înapoi. Pentru debitări complet neautorizate (fără mandat SEPA semnat), termenul legal este de 13 luni conform legii germane!',
      de: 'Gemäß § 675x BGB können autorisierte Lastschriften 8 Wochen, unautorisierte bis zu 13 Monate lang zurückgerufen werden.',
    },
    fields: [
      {
        id: 'accountIban',
        label: { ro: 'IBAN-ul contului tău', de: 'Ihre IBAN' },
        type: 'text',
        required: true,
      },
      {
        id: 'debitDate',
        label: { ro: 'Data debitării neautorizate', de: 'Datum der Abbuchung' },
        type: 'date',
        required: true,
      },
      {
        id: 'debitAmount',
        label: { ro: 'Suma retrasă (Euro)', de: 'Betrag der Abbuchung (€)' },
        placeholder: { ro: 'ex: 79,90', de: 'z.B. 79,90' },
        type: 'text',
        required: true,
      },
      {
        id: 'creditorName',
        label: { ro: 'Numele firmei care a retras banii (Gläubiger)', de: 'Name des Einreichers / Gläubiger' },
        placeholder: { ro: 'ex: Muster GmbH / Gym XY', de: 'z.B. Unbekannte Firma GmbH' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const iban = answers.accountIban || 'N/A';
      const dDate = answers.debitDate || 'kürzlich';
      const amt = answers.debitAmount || 'den abgebuchten Betrag';
      const cred = answers.creditorName || 'der Zahlungsempfänger';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt',
        subject: `Widerspruch gegen Lastschriftbuchung – IBAN: ${iban}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `bei Durchsicht meiner Kontoumsätze habe ich folgende unberechtigte Lastschriftabbuchung festgestellt:`,
          `Datum: ${dDate}\nZahlungsempfänger: ${cred}\nBetrag: ${amt} €`,
          `Für diese Abbuchung liegt meinerseits kein gültiges SEPA-Lastschriftmandat vor bzw. die Abbuchung erfolgte ohne meine Zustimmung.`,
          `Ich widerspreche dieser Belastung hiermit formell und fordere Sie auf, den abgebuchten Betrag in voller Höhe unverzüglich auf mein oben genanntes Konto zurückzubuchen und gutzuschreiben.`,
          `Bitte sperren Sie künftige Lastschriften dieses Einreichers für mein Konto.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'bank-freistellungsauftrag',
    categoryId: 'bank',
    isPremium: false,
    title: {
      ro: 'Scutire de impozit pe dobânzi bancare (Freistellungsauftrag § 44a EStG)',
      de: 'Erteilung eines Freistellungsauftrags für Kapitalerträge (§ 44a EStG)',
    },
    shortDescription: {
      ro: 'Scutire legală de până la 1.000 € / an pe dobânzile conturilor de economii și depozite.',
      de: 'Freistellung vom automatischen Abzug der Abgeltungsteuer bis zum Sparer-Pauschbetrag (1.000 €).',
    },
    bureaucraticTip: {
      ro: 'În Germania, băncile opresc automat 25% impozit + solidaritate din orice dobândă dacă nu depuneți acest formular simplu! Scutirea este de 1.000 € pentru persoane singure și 2.000 € pentru cupluri căsătorite.',
      de: 'Der Sparer-Pauschbetrag beträgt seit 2023 1.000 € (Alleinstehende) bzw. 2.000 € (zusammenveranlagte Ehepartner). Steuer-ID ist zwingend anzugeben.',
    },
    fields: [
      {
        id: 'accountIban',
        label: { ro: 'IBAN sau număr de cont / depozit', de: 'Kontonummer / IBAN / Depotnummer' },
        placeholder: { ro: 'ex: DE45 1005 0000 1234 5678 90', de: 'z.B. DE45 ...' },
        type: 'text',
        required: true,
      },
      {
        id: 'taxId',
        label: { ro: 'Codul tău fiscal german (Steueridentifikationsnummer - 11 cifre)', de: 'Ihre Steuer-ID (11-stellig)' },
        placeholder: { ro: 'ex: 84 920 183 456', de: 'z.B. 12 345 678 901' },
        type: 'text',
        required: true,
      },
      {
        id: 'exemptionAmount',
        label: { ro: 'Suma de scutire alocată acestei bănci (€ - maxim 1.000 €)', de: 'Freistellungsbetrag in Euro' },
        placeholder: { ro: 'ex: 1.000,00 € (sau o sumă parțială, ex: 500 €)', de: 'z.B. 1.000,00' },
        defaultValue: '1.000,00',
        type: 'text',
        required: true,
      },
      {
        id: 'validFromYear',
        label: { ro: 'Valabil începând cu anul calendaristic', de: 'Gültig ab Kalenderjahr' },
        placeholder: { ro: 'ex: 2025 (bis auf Weiteres)', de: 'z.B. ab 01.01.2025' },
        defaultValue: 'ab sofort / laufendes Kalenderjahr bis auf Widerruf',
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const iban = answers.accountIban || 'N/A';
      const taxId = answers.taxId || 'N/A';
      const amt = answers.exemptionAmount || '1.000,00';
      const valYear = answers.validFromYear || 'ab sofort';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Stuttgart',
        subject: `Erteilung eines Freistellungsauftrags für Kapitalerträge – IBAN: ${iban}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit erteile ich Ihnen für mein bei Ihrer Bank geführtes Konto bzw. Depot (IBAN: ${iban}) einen Freistellungsauftrag für Kapitalerträge gemäß § 44a Abs. 1 des Einkommensteuergesetzes (EStG).`,
          `Der maximale Freistellungsbetrag soll festgesetzt werden auf:`,
          `Betrag: ${amt} Euro\nGültigkeit: ${valYear}`,
          `Meine steuerlichen Stammdaten zur Weiterleitung an das Bundeszentralamt für Steuern (BZSt) lauten:\nSteuer-Identifikationsnummer (IdNr.): ${taxId}\nGeburtsdatum: gemäß Stammdaten`,
          `Ich versichere, dass mein Freistellungsauftrag zusammen mit etwaigen Freistellungsaufträgen bei anderen Kreditinstituten den gesetzlichen Höchstbetrag von 1.000 Euro nicht übersteigt.`,
          `Ich bitte Sie höflich, die Freistellung in Ihren Systemen zu hinterlegen und mir eine kurze schriftliche Bestätigung zukommen zu lassen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'bank-pkonto-umwandlung',
    categoryId: 'bank',
    isPremium: false,
    title: {
      ro: 'Transformare cont în cont de protecție la poprire (P-Konto § 850k ZPO)',
      de: 'Antrag auf Umwandlung des Girokontos in ein Pfändungsschutzkonto (P-Konto)',
    },
    shortDescription: {
      ro: 'Dreptul legal de a proteja minimul lunar de existență (~1.500 €) împotriva blocării contului de către executori sau fisc.',
      de: 'Gesetzlicher Anspruch auf Umwandlung binnen 4 Geschäftstagen zum Schutz des Pfändungsfreibetrags.',
    },
    bureaucraticTip: {
      ro: 'Băncile din Germania sunt OBLIGATE prin lege (§ 850k ZPO) să transforme contul existent în P-Konto în maxim 4 zile lucrătoare, fără costuri suplimentare! Baza neimpozabilă protejată este de minim 1.500 €/lună (și mai mult dacă aveți copii).',
      de: 'Das Kreditinstitut ist gesetzlich verpflichtet, das bestehende Girokonto binnen 4 Geschäftstagen in ein P-Konto umzuwandeln. Es darf dafür kein gesondertes Entgelt verlangen.',
    },
    fields: [
      {
        id: 'accountIban',
        label: { ro: 'IBAN-ul contului pe care doriți să îl transformați', de: 'Zu schützende IBAN' },
        placeholder: { ro: 'ex: DE21 5001 0517 ...', de: 'z.B. DE21 ...' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const iban = answers.accountIban || 'N/A';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Dortmund',
        subject: `Antrag auf Umwandlung meines Girokontos in ein Pfändungsschutzkonto (P-Konto) – IBAN: ${iban}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit beantrage ich gemäß § 850k Abs. 1 der Zivilprozessordnung (ZPO) die unverzügliche Umwandlung meines bei Ihnen geführten Girokontos mit der IBAN ${iban} in ein Pfändungsschutzkonto (P-Konto).`,
          `Ich versichere an Eides statt, dass ich kein weiteres Pfändungsschutzkonto bei einem anderen Kreditinstitut führe.`,
          `Gemäß § 850k Abs. 2 ZPO sind Sie verpflichtet, die Umwandlung binnen einer Frist von vier Geschäftstagen nach Zugang dieses Antrags wirksam vorzunehmen.`,
          `Zudem weise ich darauf hin, dass für die Führung des Kontos als Pfändungsschutzkonto nach ständiger Rechtsprechung des Bundesgerichtshofs keine höheren Kontoführungsgebühren als für ein herkömmliches Girokonto erhoben werden dürfen.`,
          `Ich bitte Sie höflich, mir die erfolgte Umwandlung unverzüglich schriftlich zu bestätigen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'bank-kreditkarte-kuendigung',
    categoryId: 'bank',
    isPremium: false,
    title: {
      ro: 'Reziliere card de credit (Kreditkarten-Kündigung)',
      de: 'Kündigung der Kreditkarte / Mastercard / Visa',
    },
    shortDescription: {
      ro: 'Pentru renunțarea la cardul de credit cu taxă anuală sau separat de contul curent.',
      de: 'Ordentliche Kündigung des Kreditkartenvertrags mit Bestätigung der Kartenentwertung.',
    },
    bureaucraticTip: {
      ro: 'Cardurile de credit pot fi reziliate de obicei oricând, fără taxe suplimentare. În scrisoare precizați că ați tăiat cipul cardului pentru siguranță.',
      de: 'Zerschneiden Sie die Kreditkarte (insbesondere Magnetstreifen und Chip) und bestätigen Sie die Entwertung schriftlich.',
    },
    fields: [
      {
        id: 'cardNumberLast4',
        label: { ro: 'Ultimele 4 cifre ale cardului de credit', de: 'Letzte 4 Ziffern der Kreditkarte' },
        placeholder: { ro: 'ex: 9812 (Kartennummer endend auf)', de: 'z.B. 1234' },
        type: 'text',
        required: true,
      },
      {
        id: 'linkedIban',
        label: { ro: 'IBAN-ul contului asociat pentru decontare', de: 'Verknüpftes Abrechnungskonto (IBAN)' },
        placeholder: { ro: 'ex: DE89 3704 0044 0532 0130 00', de: 'z.B. DE89 ...' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const last4 = answers.cardNumberLast4 || 'XXXX';
      const iban = answers.linkedIban || 'mein Referenzkonto';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `Kündigung meiner Kreditkarte – Kartennummer endend auf: ${last4}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit kündige ich meinen Kreditkartenvertrag für die Kreditkarte mit den Endziffern ${last4} (Referenzkonto IBAN: ${iban}) fristgerecht zum nächstmöglichen Termin.`,
          `Ich widerrufe hiermit zugleich mit Wirksamwerden der Kündigung das erteilte SEPA-Lastschriftmandat für künftige Abrechnungszeiträume nach vollständigem Ausgleich des Saldos.`,
          `Ich bestätige, dass ich die physische Karte durch Zerschneiden von Chip und Magnetstreifen ordnungsgemäß unbrauchbar gemacht habe.`,
          `Bitte senden Sie mir eine schriftliche Bestätigung der Kündigung unter Angabe des Beendigungsdatums zu.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'bank-adressaenderung',
    categoryId: 'bank',
    isPremium: false,
    title: {
      ro: 'Notificare schimbare de adresă către bancă (Adressänderung Bank)',
      de: 'Mitteilung über Wohnsitz- und Adressänderung bei der Bank',
    },
    shortDescription: {
      ro: 'Actualizarea adresei pentru primirea în siguranță a noilor carduri, PIN-urilor și extraselor bancare.',
      de: 'Formelle Adressaktualisierung zur Vermeidung von Fehlzustellungen sensibler Bankdaten und Karten.',
    },
    bureaucraticTip: {
      ro: 'Băncile trimit cardurile bancare și codurile PIN doar prin scrisoare recomandată la adresa înregistrată oficial. Notificați banca imediat ce v-ați mutat pentru a evita blocarea contului!',
      de: 'Kreditinstitute sind nach dem Geldwäschegesetz verpflichtet, aktuelle Kundendaten vorzuhalten.',
    },
    fields: [
      {
        id: 'accountIban',
        label: { ro: 'IBAN-ul contului tău bancar', de: 'Ihre IBAN / Kontonummer' },
        placeholder: { ro: 'ex: DE12 5001 0517 ...', de: 'z.B. DE12 ...' },
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
        placeholder: { ro: 'ex: Alte Straße 5, 60311 Frankfurt', de: 'z.B. Alte Straße 5, 60311 Frankfurt' },
        type: 'text',
        required: true,
      },
      {
        id: 'newAddress',
        label: { ro: 'Noua adresă completă', de: 'Neue Wohnanschrift' },
        placeholder: { ro: 'ex: Neue Gasse 12, 70173 Stuttgart', de: 'z.B. Neue Gasse 12, 70173 Stuttgart' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const iban = answers.accountIban || 'N/A';
      const mDate = answers.moveDate || 'kürzlich';
      const oldA = answers.oldAddress || 'die bisherige Anschrift';
      const newA = answers.newAddress || `${sender.street}, ${sender.postalCode} ${sender.city}`;

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt am Main',
        subject: `Mitteilung über Adressänderung – IBAN: ${iban}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit teile ich Ihnen mit, dass sich mein Wohnsitz mit Wirkung zum ${mDate} geändert hat.`,
          `Bisherige Anschrift:\n${oldA}`,
          `Neue Anschrift ab ${mDate}:\n${newA}`,
          `Ich bitte Sie, meine neuen Stammdaten für alle unter meinem Namen geführten Konten, Depots und Kreditkarten unverzüglich zu aktualisieren und künftige Korrespondenz sowie Abrechnungen ausschließlich an die neue Anschrift zu senden.`,
          `Eine Kopie der aktuellen amtlichen Meldebescheinigung habe ich diesem Schreiben zur Legitimation beigefügt.`,
          `Bitte senden Sie mir eine kurze schriftliche Bestätigung der Datenänderung zu.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Kopie der amtlichen Meldebestätigung'],
      };
    },
  },
  {
    id: 'bank-kontoanfrage',
    categoryId: 'bank',
    isPremium: false,
    title: {
      ro: 'Clarificare operațiune bancară / comisioane cont (Kontoanfrage)',
      de: 'Anfrage zum Bankkonto und Klärung von Kontoführungsgebühren',
    },
    shortDescription: {
      ro: 'Pentru clarificarea unor comisioane neclare de administrare, a unei plăți reținute sau a limitelor de tranzacționare.',
      de: 'Schriftliche Anfrage zu Kontobedingungen, Gebührenänderungen oder unklaren Buchungsposten.',
    },
    bureaucraticTip: {
      ro: 'Conform deciziei Curții Federale de Justiție (BGH), băncile nu pot crește comisioanele de cont fără acordul tău expres (nu mai e valabil acordul tacit!). Puteți cere restituirea comisioanelor încasate fără acord.',
      de: 'Nach ständiger BGH-Rechtsprechung (Az. XI ZR 26/20) sind Gebührenerhöhungen ohne ausdrückliche Kundenzustimmung unzulässig.',
    },
    fields: [
      {
        id: 'accountIban',
        label: { ro: 'IBAN-ul contului tău', de: 'Ihre IBAN' },
        placeholder: { ro: 'ex: DE89 3704 0044 ...', de: 'z.B. DE89 ...' },
        type: 'text',
        required: true,
      },
      {
        id: 'requestTopic',
        label: { ro: 'Subiectul solicitării (ex: Comisioane neclare, clarificare debitare, mărire limită Dispo)', de: 'Gegenstand der Anfrage' },
        placeholder: { ro: 'ex: Rückforderung unzulässig erhöhter Kontoführungsgebühren / Klärung einer Überweisung', de: 'z.B. Klärung von Kontoführungsgebühren' },
        type: 'text',
        required: true,
      },
      {
        id: 'requestDetails',
        label: { ro: 'Detalii concrete și ce anume solicitați băncii', de: 'Genaue Erläuterung des Anliegens' },
        placeholder: { ro: 'ex: Auf meinem Auszug vom [Datum] wurden Kontoführungsgebühren in Höhe von [Betrag] € berechnet, denen ich nicht zugestimmt habe. Ich bitte um Erläuterung und Erstattung.', de: 'z.B. Erläuterung und Rückerstattung der Gebühren' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const iban = answers.accountIban || 'N/A';
      const topic = answers.requestTopic || 'Fragen zur Kontoführung';
      const details = answers.requestDetails || 'folgende Punkte bedürfen der Erläuterung';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Anfrage zu meinem Girokonto: ${topic} – IBAN: ${iban}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `zu meinem bei Ihrem Institut geführten Girokonto mit der IBAN ${iban} habe ich folgendes Anliegen, um dessen Klärung ich Sie bitte:`,
          `„${details}“`,
          `Ich bitte Sie höflich, den Sachverhalt zeitnah zu überprüfen und mir eine schriftliche Stellungnahme bzw. Abrechnungserläuterung zukommen zu lassen.`,
          `Sollten für die Überprüfung noch Angaben von meiner Seite erforderlich sein, stehe ich Ihnen unter meiner oben angegebenen Telefonnummer oder E-Mail-Adresse gerne zur Verfügung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'bank-unterlagen-anforderung',
    categoryId: 'bank',
    isPremium: false,
    title: {
      ro: 'Solicitare documente bancare / adeverință de sold (Bankunterlagen anfordern)',
      de: 'Anforderung von Bankunterlagen, Saldenbestätigung und Steuerbescheinigung',
    },
    shortDescription: {
      ro: 'Pentru obținerea adeverinței de sold (Saldenbestätigung), a extraselor vechi sau a adeverinței fiscale anuale (Jahressteuerbescheinigung).',
      de: 'Formelle Anforderung von Kontoauszügen, Jahressteuerbescheinigungen oder Bestätigungen für Behörden.',
    },
    bureaucraticTip: {
      ro: 'Instituțiile germane (Jobcenter, Wohngeldstelle, Finanzamt) solicită frecvent extrasele bancare pe ultimele 3 sau 6 luni ori adeverința anuală pentru declarația de impozit.',
      de: 'Die Jahressteuerbescheinigung nach § 45d EStG wird für die Einkommensteuererklärung benötigt und ist von der Bank kostenfrei auszustellen.',
    },
    fields: [
      {
        id: 'accountIban',
        label: { ro: 'IBAN-ul contului / depozitului', de: 'Ihre IBAN / Kontonummer' },
        placeholder: { ro: 'ex: DE33 5001 0517 ...', de: 'z.B. DE33 ...' },
        type: 'text',
        required: true,
      },
      {
        id: 'requestedDocumentType',
        label: { ro: 'Ce document solicitați?', de: 'Benötigte Bankunterlage' },
        placeholder: { ro: 'ex: Jahressteuerbescheinigung für das Jahr 2024 / Saldenbestätigung zum Stichtag / Historische Kontoauszüge', de: 'z.B. Jahressteuerbescheinigung' },
        type: 'text',
        required: true,
      },
      {
        id: 'periodOrDate',
        label: { ro: 'Perioada sau data de referință', de: 'Zeitraum oder Stichtag' },
        placeholder: { ro: 'ex: Kalenderjahr 2024 / per 31.12.2024', de: 'z.B. Kalenderjahr 2024' },
        type: 'text',
        required: true,
      },
      {
        id: 'purpose',
        label: { ro: 'Destinația documentului (ex: Finanzamt, Jobcenter, viză)', de: 'Verwendungszweck / Vorlage bei' },
        placeholder: { ro: 'ex: Zur Vorlage beim Finanzamt für die Einkommensteuererklärung', de: 'z.B. Zur Vorlage beim Finanzamt' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const iban = answers.accountIban || 'N/A';
      const doc = answers.requestedDocumentType || 'die erforderlichen Bankunterlagen';
      const period = answers.periodOrDate || 'den genannten Zeitraum';
      const purp = answers.purpose || 'behördliche Zwecke';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Stuttgart',
        subject: `Anforderung von Bankunterlagen: ${doc} – IBAN: ${iban}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `für ${purp} benötige ich zeitnah folgende Unterlage zu meinem bei Ihnen geführten Konto (IBAN: ${iban}):`,
          `Dokumentenart: ${doc}\nBetroffener Zeitraum / Stichtag: ${period}`,
          `Ich bitte Sie höflich, mir die Bescheinigung bzw. die Auszüge baldmöglichst auszustellen und postalisch an meine oben angegebene Wohnanschrift oder digital in mein Online-Banking-Postfach zu übermitteln.`,
          `Ich bedanke mich im Voraus für die gewohnt zuverlässige Bearbeitung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
];

