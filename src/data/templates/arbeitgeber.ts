import { LetterTemplate } from '../../types';

export const arbeitgeberTemplates: LetterTemplate[] = [
  {
    id: 'arbeit-kuendigung-arbeitnehmer',
    categoryId: 'arbeitgeber',
    isPremium: false,
    title: {
      ro: 'Demisie din proprie inițiativă (Kündigung des Arbeitsverhältnisses)',
      de: 'Ordentliche Kündigung des Arbeitsvertrags durch Arbeitnehmer',
    },
    shortDescription: {
      ro: 'Încetarea contractului individual de muncă cu respectarea termenului de preaviz.',
      de: 'Fristgerechte Eigenkündigung unter Wahrung der Kündigungsfrist nach § 622 BGB.',
    },
    bureaucraticTip: {
      ro: 'Conform legii germane (§ 623 BGB), demisia este valabilă DOAR ÎN FORMĂ SCRISĂ cu semnătură olografă (cu pixul pe hârtie)! E-mailul, SMS-ul sau WhatsApp sunt nule de drept.',
      de: 'Gemäß § 623 BGB bedarf die Kündigung der Schriftform mit eigenhändiger Unterschrift auf Papier. Elektronische Kündigungen sind unwirksam!',
    },
    fields: [
      {
        id: 'jobTitle',
        label: { ro: 'Funcția ta în firmă (Berufsbezeichnung)', de: 'Ihre Berufsbezeichnung / Stelle' },
        placeholder: { ro: 'ex: Lagerist / Elektriker / Pflegekraft / Softwareentwickler', de: 'z.B. Kommissionierer' },
        type: 'text',
        required: true,
      },
      {
        id: 'personnelNumber',
        label: { ro: 'Număr personal (Personalnummer - opțional)', de: 'Personalnummer (optional)' },
        placeholder: { ro: 'ex: P-4029 (pe fluturașul de salariu)', de: 'z.B. P-4029' },
        type: 'text',
      },
      {
        id: 'resignationDate',
        label: { ro: 'Data ultimei zile de muncă / termen de preaviz', de: 'Beendigungsdatum' },
        placeholder: { ro: 'ex: zum 30. November 2025 sau zum nächstmöglichen Termin', de: 'z.B. zum nächstmöglichen Termin' },
        defaultValue: 'zum nächstmöglichen Termin',
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const job = answers.jobTitle || 'Mitarbeiter(in)';
      const pNo = answers.personnelNumber ? ` (Personalnummer: ${answers.personnelNumber})` : '';
      const rDate = answers.resignationDate || 'zum nächstmöglichen Termin';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Kündigung meines Arbeitsverhältnisses als ${job}${pNo}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vorgesetzte(r),',
        paragraphs: [
          `hiermit kündige ich mein bestehendes Arbeitsverhältnis ordentlich und fristgerecht ${rDate}.`,
          `Ich bitte Sie, mir den Eingang dieses Kündigungsschreibens sowie das genaue Datum, an dem das Arbeitsverhältnis endet, schriftlich zu bestätigen.`,
          `Gleichzeitig bitte ich Sie um die Ausstellung eines wohlwollenden, qualifizierten Arbeitszeugnisses, welches Aussagen über meine Tätigkeiten, meine Leistungen und mein Verhalten im Unternehmen enthält.`,
          `Ich bedanke mich für die bisherige Zusammenarbeit und wünsche dem Unternehmen sowie den Kolleginnen und Kollegen für die Zukunft alles Gute.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'arbeit-zeugnis-anforderung',
    categoryId: 'arbeitgeber',
    isPremium: false,
    title: {
      ro: 'Cerere de eliberare a adeverinței de muncă (Qualifiziertes Arbeitszeugnis)',
      de: 'Anforderung eines qualifizierten Arbeitszeugnisses',
    },
    shortDescription: {
      ro: 'Obligatorie în Germania la căutarea unui nou loc de muncă. Fiecare angajat are drept legal la ea.',
      de: 'Geltendmachung des gesetzlichen Anspruchs nach § 109 Gewerbeordnung (GewO).',
    },
    bureaucraticTip: {
      ro: 'În Germania, un „Qualifiziertes Arbeitszeugnis” este esențial pentru orice nou interviu. Angajatorul este obligat prin lege (§ 109 GewO) să îl formuleze binevoitor (wohlwollend).',
      de: 'Jeder Arbeitnehmer hat Anspruch auf ein Zeugnis, das sich auch auf Führung und Leistung erstreckt.',
    },
    fields: [
      {
        id: 'jobPosition',
        label: { ro: 'Postul / funcția deținută', de: 'Ausgeübte Tätigkeit' },
        placeholder: { ro: 'ex: Kraftfahrer / Verkäuferin / Bauleiter', de: 'z.B. Kraftfahrer' },
        type: 'text',
        required: true,
      },
      {
        id: 'employmentEnd',
        label: { ro: 'Data încheierii activității sau mențiunea „în curs”', de: 'Beendigung des Arbeitsverhältnisses' },
        placeholder: { ro: 'ex: beendet zum 31.08.2025 / aktuell bestehend (Zwischenzeugnis)', de: 'z.B. zum 31.08.2025' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const pos = answers.jobPosition || 'Mitarbeiter(in)';
      const end = answers.employmentEnd || 'zum vereinbarten Termin';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Stuttgart',
        subject: `Anforderung eines qualifizierten Arbeitszeugnisses – Tätigkeit als ${pos}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `mit Beendigung meines Arbeitsverhältnisses ${end} mache ich meinen gesetzlichen Anspruch gemäß § 109 Gewerbeordnung (GewO) auf Erteilung eines qualifizierten Arbeitszeugnisses geltend.`,
          `Ich bitte Sie höflich, das Zeugnis wohlwollend zu verfassen und darin sowohl eine detaillierte Beschreibung meines Aufgabenbereichs als auch eine fundierte Beurteilung meiner Arbeitsleistung und meines Verhaltens aufzunehmen.`,
          `Ich wäre Ihnen dankbar, wenn Sie mir das unterzeichnete Zeugnis bis spätestens binnen drei Wochen an meine oben genannte Postanschrift zukommen lassen könnten.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'arbeit-elternzeit-antrag',
    categoryId: 'arbeitgeber',
    isPremium: true,
    title: {
      ro: 'Cerere pentru concediu de creștere a copilului (Elternzeit gemäß § 16 BEEG)',
      de: 'Antrag auf Elternzeit gemäß § 16 BEEG',
    },
    shortDescription: {
      ro: 'Notificarea oficială a angajatorului cu privire la perioada de concediu parental.',
      de: 'Schriftliche Inanspruchnahme von Elternzeit mit Kündigungsschutz.',
    },
    bureaucraticTip: {
      ro: 'Cererea trebuie depusă cu cel puțin 7 săptămâni înainte de începerea perioadei dorite (până la vârsta de 3 ani a copilului). Odată depusă, beneficiați de protecție specială împotriva concedierii!',
      de: 'Die 7-Wochen-Frist vor Antritt (§ 16 Abs. 1 BEEG) ist zwingend einzuhalten.',
    },
    fields: [
      {
        id: 'childNameBirth',
        label: { ro: 'Numele și data nașterii copilului (sau data estimată)', de: 'Name und Geburtsdatum des Kindes' },
        placeholder: { ro: 'ex: David Popa, geb. 10.02.2025', de: 'z.B. David Popa, geb. 10.02.2025' },
        type: 'text',
        required: true,
      },
      {
        id: 'elternzeitPeriod',
        label: { ro: 'Perioada exactă de Elternzeit (de la ... până la ...)', de: 'Zeitraum der Elternzeit' },
        placeholder: { ro: 'ex: vom 01. Juni 2025 bis zum 31. Mai 2026', de: 'z.B. vom 01.06.2025 bis 31.05.2026' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const child = answers.childNameBirth || 'mein Kind';
      const period = answers.elternzeitPeriod || 'im vereinbarten Zeitraum';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Nürnberg',
        subject: `Anmeldung von Elternzeit gemäß § 16 Bundeselterngeld- und Elternzeitgesetz (BEEG)`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit nehme ich für mein Kind, ${child}, Elternzeit gemäß § 16 BEEG in Anspruch.`,
          `Ich werde die Elternzeit verbindlich für folgenden Zeitraum antreten:\n${period}`,
          `Während dieser Zeit beabsichtige ich, nicht bzw. vollumfänglich pausiert erwerbstätig zu sein. Die gesetzliche Anmeldefrist von 7 Wochen vor Beginn der Elternzeit wird mit diesem Schreiben ordnungsgemäß gewahrt.`,
          `Ich bitte Sie höflich, mir den Erhalt dieses Schreibens sowie die Gewährung der Elternzeit schriftlich zu bestätigen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'arbeit-ausstehender-lohn',
    categoryId: 'arbeitgeber',
    isPremium: true,
    title: {
      ro: 'Notificare de plată pentru salariu restant sau ore suplimentare neplătite',
      de: 'Geltendmachung ausstehender Entgeltansprüche / Überstundenvergütung',
    },
    shortDescription: {
      ro: 'Când angajatorul întârzie plata salariului sau refuză plata orelor suplimentare efectuate.',
      de: 'Aufforderung zur Zahlung des rückständigen Gehalts mit Fristsetzung zur Vermeidung von Verzugszinsen.',
    },
    bureaucraticTip: {
      ro: 'Multe contracte colective de muncă din Germania au termene de decădere (Ausschlussfristen) de doar 3 luni! Dacă nu solicitați în scris banii în termen, vă pierdeți dreptul definitiv.',
      de: 'Beachten Sie arbeitsvertragliche oder tarifliche Ausschlussfristen (oft 3 Monate)!',
    },
    fields: [
      {
        id: 'wageMonth',
        label: { ro: 'Luna / perioada pentru care lipsește salariul', de: 'Abrechnungsmonat' },
        placeholder: { ro: 'ex: Gehalt für den Monat Oktober 2025 sowie 42 Überstunden', de: 'z.B. Gehalt für Oktober' },
        type: 'text',
        required: true,
      },
      {
        id: 'amountDue',
        label: { ro: 'Suma netă sau brută datorată (€)', de: 'Ausstehender Betrag (€)' },
        placeholder: { ro: 'ex: 2.150,00 Euro netto', de: 'z.B. 2.150,00 €' },
        type: 'text',
        required: true,
      },
      {
        id: 'payDeadline',
        label: { ro: 'Termen limită de plată acordat (de regulă 7-10 zile)', de: 'Zahlungsfrist' },
        type: 'date',
        required: true,
      },
      {
        id: 'iban',
        label: { ro: 'IBAN-ul tău bancar', de: 'Ihre IBAN' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const month = answers.wageMonth || 'den fälligen Abrechnungszeitraum';
      const amt = answers.amountDue || 'den vereinbarten Lohn';
      const dl = answers.payDeadline || 'binnen 7 Tagen';
      const iban = answers.iban || 'mein hinterlegtes Gehaltskonto';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Duisburg',
        subject: `Geltendmachung ausstehender Gehaltsansprüche – Fristsetzung`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `trotz Fälligkeit und meiner erbrachten Arbeitsleistung habe ich die Vergütung für ${month} bislang nicht bzw. nicht in voller Höhe erhalten.`,
          `Gemäß Arbeitsvertrag sowie den gesetzlichen Bestimmungen steht mir ein Betrag in Höhe von ${amt} zu.`,
          `Ich fordere Sie hiermit auf, den ausstehenden Betrag unverzüglich, spätestens bis zum ${dl}, auf mein folgendes Bankkonto zu überweisen:`,
          `Kontoinhaber: ${sender.fullName}\nIBAN: ${iban}`,
          `Sollte bis zum Ablauf dieser Frist kein vollständiger Zahlungseingang festzustellen sein, behalte ich mir vor, ohne weitere Vorankündigung rechtliche Schritte vor dem zuständigen Arbeitsgericht einzuleiten sowie Verzugszinsen gemäß § 288 BGB geltend zu machen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'arbeit-urlaub-resturlaub',
    categoryId: 'arbeitgeber',
    isPremium: false,
    title: {
      ro: 'Cerere de concediu de odihnă sau reportare zile rămase (Urlaubsantrag)',
      de: 'Urlaubsantrag / Übertragung von Resturlaub ins neue Kalenderjahr',
    },
    shortDescription: {
      ro: 'Solicitare oficială pentru aprobarea concediului sau transferul zilelor neefectuate până la 31 martie.',
      de: 'Formelle Beantragung von Erholungsurlaub gemäß Bundesurlaubsgesetz (BUrlG).',
    },
    bureaucraticTip: {
      ro: 'Conform Bundesurlaubsgesetz (§ 7 BUrlG), concediul restant trebuie efectuat până la 31 martie a anului următor, altfel riscă să fie pierdut dacă nu a fost cerut în scris!',
      de: 'Resturlaub verfällt nach neuer BAG-Rechtsprechung nur, wenn der Arbeitgeber den Arbeitnehmer zuvor ausdrücklich dazu aufgefordert hat.',
    },
    fields: [
      {
        id: 'holidayFrom',
        label: { ro: 'Prima zi de concediu dorită', de: 'Erster Urlaubstag' },
        type: 'date',
        required: true,
      },
      {
        id: 'holidayTo',
        label: { ro: 'Ultima zi de concediu dorită (inclusiv)', de: 'Letzter Urlaubstag' },
        type: 'date',
        required: true,
      },
      {
        id: 'workDaysCount',
        label: { ro: 'Numărul de zile lucrătoare de concediu', de: 'Anzahl der Arbeitstage' },
        placeholder: { ro: 'ex: 10 Arbeitstage', de: 'z.B. 10 Arbeitstage' },
        type: 'text',
        required: true,
      },
      {
        id: 'carryOverNote',
        label: { ro: 'Zile de concediu reportate din anul anterior (opțional)', de: 'Übertrag von Resturlaub (optional)' },
        placeholder: { ro: 'ex: davon 4 Tage Resturlaub aus dem Vorjahr', de: 'z.B. inklusive 3 Tage Resturlaub' },
        type: 'text',
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const from = answers.holidayFrom || 'demnächst';
      const to = answers.holidayTo || 'folgend';
      const count = answers.workDaysCount || 'die beantragten';
      const carry = answers.carryOverNote ? ` (${answers.carryOverNote})` : '';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Stuttgart',
        subject: `Antrag auf Gewährung von Erholungsurlaub für den Zeitraum vom ${from} bis ${to}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vorgesetzte(r),',
        paragraphs: [
          `hiermit beantrage ich die Gewährung von Erholungsurlaub für den folgenden Zeitraum:`,
          `Vom ${from} bis einschließlich zum ${to}`,
          `Dies entspricht einem Umfang von insgesamt ${count} Arbeitstagen${carry}.`,
          `Ich habe dafür Sorge getragen, dass dringende betriebliche Aufgaben vor Urlaubsantritt abgeschlossen sind bzw. eine ordnungsgemäße Vertretung während meiner Abwesenheit sichergestellt ist.`,
          `Ich bitte Sie höflich, mir den beantragten Erholungsurlaub zeitnah schriftlich zu genehmigen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'arbeit-teilzeit-antrag',
    categoryId: 'arbeitgeber',
    isPremium: false,
    title: {
      ro: 'Cerere de reducere a timpului de lucru / Trecere la Teilzeit (§ 8 TzBfG)',
      de: 'Antrag auf Verringerung der Arbeitszeit gemäß § 8 TzBfG (Teilzeit)',
    },
    shortDescription: {
      ro: 'Dreptul legal al oricărui angajat (în firme cu peste 15 salariați) de a-și reduce orele de muncă.',
      de: 'Geltendmachung des Anspruchs auf Reduzierung der wöchentlichen Arbeitszeit mit 3 Monaten Vorlauf.',
    },
    bureaucraticTip: {
      ro: 'Cererea trebuie trimisă cu cel puțin 3 luni înainte de data de începere dorită. Angajatorul o poate refuza doar din motive excepționale de organizare a producției (§ 8 TzBfG).',
      de: 'Die Ankündigungsfrist beträgt mindestens 3 Monate vor Beginn (§ 8 Abs. 2 TzBfG). Geben Sie die gewünschte Verteilung der Arbeitszeit an.',
    },
    fields: [
      {
        id: 'currentHours',
        label: { ro: 'Ore actuale pe săptămână (Vollzeit)', de: 'Bisherige Wochenarbeitszeit' },
        placeholder: { ro: 'ex: 40 Stunden wöchentlich', de: 'z.B. 40 Stunden' },
        defaultValue: '40 Stunden pro Woche',
        type: 'text',
        required: true,
      },
      {
        id: 'desiredHours',
        label: { ro: 'Ore dorite pe săptămână (Teilzeit)', de: 'Gewünschte neue Wochenarbeitszeit' },
        placeholder: { ro: 'ex: 25 Stunden wöchentlich / 30 Stunden', de: 'z.B. 30 Stunden' },
        type: 'text',
        required: true,
      },
      {
        id: 'startDate',
        label: { ro: 'Data de la care doriți începerea programului redus (minim 3 luni)', de: 'Gewünschter Beginn' },
        type: 'date',
        required: true,
      },
      {
        id: 'scheduleWish',
        label: { ro: 'Repartizarea dorită a orelor (ex: Luni-Joi câte 6 ore sau 4 zile pe săptămână)', de: 'Gewünschte Arbeitszeitverteilung' },
        placeholder: { ro: 'ex: Montag bis Donnerstag von 08:00 bis 14:30 Uhr, Freitag frei', de: 'z.B. Mo-Do von 8 bis 14 Uhr' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cur = answers.currentHours || 'Vollzeit';
      const des = answers.desiredHours || 'Teilzeit';
      const sDate = answers.startDate || 'in 3 Monaten';
      const sched = answers.scheduleWish || 'nach betrieblicher Absprache';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt',
        subject: `Antrag auf Verringerung der Arbeitszeit gemäß § 8 Teilzeit- und Befristungsgesetz (TzBfG)`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte Geschäftsleitung,',
        paragraphs: [
          `hiermit beantrage ich die Verringerung meiner vertraglich vereinbarten regelmäßigen Wochenarbeitszeit von derzeit ${cur} auf künftig ${des}.`,
          `Die Reduzierung der Arbeitszeit soll mit Wirkung zum ${sDate} in Kraft treten. Die gesetzliche Ankündigungsfrist von mindestens drei Monaten gemäß § 8 Abs. 2 TzBfG wird mit diesem Schreiben ordnungsgemäß gewahrt.`,
          `Als Verteilung der künftigen Arbeitszeit schlage ich folgende Regelung vor:`,
          `„${sched}“`,
          `Ich stehe Ihnen für ein persönliches Gespräch zur Erörterung dieses Antrags und der betrieblichen Organisation gerne zur Verfügung und bitte Sie höflich um Ihre schriftliche Entscheidung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'arbeit-mutterschutz-mitteilung',
    categoryId: 'arbeitgeber',
    isPremium: false,
    title: {
      ro: 'Notificare oficială privind sarcina și concediul de maternitate (Mutterschutz § 15 MuSchG)',
      de: 'Mitteilung über Schwangerschaft und Mutterschutzfristen gemäß § 15 MuSchG',
    },
    shortDescription: {
      ro: 'Pentru activarea protecției legale împotriva concedierii (Kündigungsschutz) și protecția sănătății la muncă.',
      de: 'Schriftliche Anzeige an den Arbeitgeber mit Kündigungsschutz ab Bekanntgabe.',
    },
    bureaucraticTip: {
      ro: 'Din momentul în care angajatorul primește această înștiințare scrisă, se activează protecția strictă împotriva concedierii conform § 17 MuSchG! Concediul de maternitate începe cu 6 săptămâni înainte de naștere.',
      de: 'Ab Zugang gilt absoluter Kündigungsschutz. Der Arbeitgeber muss den Arbeitsplatz gemäß Gefährdungsbeurteilung anpassen.',
    },
    fields: [
      {
        id: 'dueDate',
        label: { ro: 'Data estimată a nașterii (errechneter Geburtstermin)', de: 'Errechneter Entbindungstermin' },
        type: 'date',
        required: true,
      },
      {
        id: 'medicalProof',
        label: { ro: 'Atașezi adeverință de la medicul ginecolog (Frauenarzt)?', de: 'Ärztliche Bescheinigung liegt bei?' },
        type: 'select',
        options: [
          { value: 'ja', label: { ro: 'Da, atașez adeverința medicului ginecolog', de: 'Ja, ärztliches Zeugnis liegt bei' } },
          { value: 'wird_nachgereicht', label: { ro: 'Adeverința va fi transmisă în zilele următoare', de: 'Wird in Kürze nachgereicht' } },
        ],
        defaultValue: 'ja',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const dDate = answers.dueDate || 'gemäß ärztlicher Feststellung';
      const hasProof = answers.medicalProof === 'ja';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Nürnberg',
        subject: `Mitteilung über Schwangerschaft und voraussichtlichen Entbindungstermin (§ 15 MuSchG)`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vorgesetzte(r),',
        paragraphs: [
          `hiermit teile ich Ihnen gemäß § 15 Abs. 1 des Mutterschutzgesetzes (MuSchG) offiziell mit, dass ich schwanger bin.`,
          `Der vom behandelnden Facharzt für Frauenheilkunde errechnete voraussichtliche Tag der Entbindung ist der ${dDate}.`,
          `Die gesetzliche Mutterschutzfrist vor der Entbindung (sechs Wochen vor dem errechneten Termin) beginnt demnach voraussichtlich am entsprechenden Datum.`,
          hasProof
            ? `Eine entsprechende ärztliche Bescheinigung über das Bestehen der Schwangerschaft und den voraussichtlichen Entbindungstermin ist diesem Schreiben beigefügt.`
            : `Die entsprechende ärztliche Bescheinigung meines Frauenarztes werde ich Ihnen unverzüglich nachreichen.`,
          `Ich bitte Sie, die Mitteilung vertraulich zu behandeln, die gesetzlich vorgeschriebene Gefährdungsbeurteilung meines Arbeitsplatzes vorzunehmen und die zuständige Aufsichtsbehörde (Gewerbeaufsichtsamt) ordnungsgemäß zu benachrichtigen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: hasProof ? ['Ärztliche Bescheinigung über die Schwangerschaft'] : undefined,
      };
    },
  },
  {
    id: 'arbeit-krankmeldung',
    categoryId: 'arbeitgeber',
    isPremium: false,
    title: {
      ro: 'Notificare oficială concediu medical către angajator (Krankmeldung & eAU)',
      de: 'Schriftliche Krankmeldung / Mitteilung über Arbeitsunfähigkeit (eAU)',
    },
    shortDescription: {
      ro: 'Înștiințarea scrisă a angajatorului despre incapacitatea temporară de muncă și certificatul medical electronic.',
      de: 'Formelle Krankmeldung mit Angabe der voraussichtlichen Dauer und Hinweis auf den elektronischen Abruf (eAU).',
    },
    bureaucraticTip: {
      ro: 'Conform § 5 EntgFG, sunteți obligat să anunțați imediat angajatorul. Medicii transmit certificatul electronic (eAU) direct casei de asigurări, de unde angajatorul îl descarcă digital. O notificare scrisă previne orice discuție sau avertisment (Abmahnung)!',
      de: 'Seit Einführung der eAU muss der Arbeitnehmer die AU nicht mehr in Papierform vorlegen, sondern den Arbeitgeber unverzüglich über Dauer und Beginn informieren.',
    },
    fields: [
      {
        id: 'employeeId',
        label: { ro: 'Număr personal / de angajat (dacă există)', de: 'Personalnummer (falls vorhanden)' },
        placeholder: { ro: 'ex: PN-48192 sau lasă liber', de: 'z.B. PN-48192' },
        type: 'text',
      },
      {
        id: 'sickStartDate',
        label: { ro: 'Incapacitatea de muncă a început la data de', de: 'Arbeitsunfähig seit' },
        type: 'date',
        required: true,
      },
      {
        id: 'sickExpectedEndDate',
        label: { ro: 'Durata preconizată (până inclusiv la data de)', de: 'Voraussichtlich arbeitsunfähig bis einschließlich' },
        type: 'date',
        required: true,
      },
      {
        id: 'doctorConsulted',
        label: { ro: 'Ai fost examinat de medic (eAU a fost emisă electronic)?', de: 'Ärztliche Untersuchung erfolgt (eAU hinterlegt)?' },
        type: 'select',
        options: [
          { value: 'ja_eau', label: { ro: 'Da, medicul a eliberat certificatul electronic (eAU poate fi descărcat de la Krankenkasse)', de: 'Ja, eAU liegt elektronisch bei Krankenkasse vor' } },
          { value: 'nein_folgetag', label: { ro: 'Nu încă (prima zi de boală, mă prezint la medic dacă persistă)', de: 'Erster Krankheitstag (Arztbesuch folgt bei Fortdauer)' } },
        ],
        defaultValue: 'ja_eau',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const pNr = answers.employeeId ? ` (Personalnummer: ${answers.employeeId})` : '';
      const sStart = answers.sickStartDate || 'heute';
      const sEnd = answers.sickExpectedEndDate || 'auf Weiteres';
      const isEau = answers.doctorConsulted === 'ja_eau';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt',
        subject: `Mitteilung über krankheitsbedingte Arbeitsunfähigkeit${pNr}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Vorgesetzte(r),',
        paragraphs: [
          `hiermit teile ich Ihnen gemäß § 5 Abs. 1 des Entgeltfortzahlungsgesetzes (EntgFG) mit, dass ich seit dem ${sStart} krankheitsbedingt arbeitsunfähig bin.`,
          `Die voraussichtliche Dauer der Arbeitsunfähigkeit erstreckt sich voraussichtlich bis einschließlich zum ${sEnd}.`,
          isEau
            ? `Eine ärztliche Feststellung der Arbeitsunfähigkeit ist erfolgt. Die elektronische Arbeitsunfähigkeitsbescheinigung (eAU) wurde von der behandelnden Arztpraxis an meine gesetzliche Krankenkasse übermittelt und kann von Ihnen als Arbeitgeber dort elektronisch abgerufen werden.`
            : `Sollte die Arbeitsunfähigkeit über den heutigen Tag hinaus anhalten, werde ich unverzüglich einen Arzt konsultieren und für die elektronische Erfassung der Arbeitsunfähigkeit Sorge tragen.`,
          `Sollte sich die Genesung verzögern und eine Folgebescheinigung erforderlich sein, werde ich Sie hierüber unverzüglich in Kenntnis setzen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
];

