import { LetterTemplate } from '../../types';

export const kitaSchuleTemplates: LetterTemplate[] = [
  {
    id: 'schule-krankmeldung',
    categoryId: 'kita_schule',
    isPremium: false,
    title: {
      ro: 'Motivare absențe școlare din motive medicale (Krankmeldung)',
      de: 'Schriftliche Entschuldigung bei Schulversäumnis wegen Krankheit',
    },
    shortDescription: {
      ro: 'Scrisoare oficială de justificare a absențelor copilului de la școală sau grădiniță.',
      de: 'Mitteilung an die Klassenleitung zur Entschuldigung von krankheitsbedingten Fehltagen.',
    },
    bureaucraticTip: {
      ro: 'În Germania, prezența școlară este obligatorie prin lege (Schulpflicht). Dacă lipsa depășește 3 zile consecutive sau are loc chiar înainte/după o vacanță, școala poate cere certificat de la medicul pediatru (Attest vom Kinderarzt).',
      de: 'Beachten Sie die jeweilige Schulordnung. Ab dem 3. Fehltag oder bei Fehlzeiten direkt vor/nach Schulferien ist meist ein ärztliches Attest nötig.',
    },
    fields: [
      {
        id: 'childName',
        label: { ro: 'Numele și prenumele copilului', de: 'Name des Kindes' },
        placeholder: { ro: 'ex: Andrei Popescu', de: 'z.B. Andrei Popescu' },
        type: 'text',
        required: true,
      },
      {
        id: 'className',
        label: { ro: 'Clasa / Grupa (Klasse / Gruppe)', de: 'Klasse oder Gruppe' },
        placeholder: { ro: 'ex: Klasse 3b / Bärengruppe', de: 'z.B. Klasse 3b' },
        type: 'text',
        required: true,
      },
      {
        id: 'dateFrom',
        label: { ro: 'De la data de', de: 'Fehlzeitraum von' },
        type: 'date',
        required: true,
      },
      {
        id: 'dateTo',
        label: { ro: 'Până la data de (inclusiv)', de: 'Fehlzeitraum bis' },
        type: 'date',
        required: true,
      },
      {
        id: 'hasAttest',
        label: { ro: 'Atașezi adeverință de la medic (Attest)?', de: 'Ärztliches Attest liegt bei?' },
        type: 'select',
        options: [
          { value: 'ja', label: { ro: 'Da, atașez adeverința medicului pediatru', de: 'Ja, ärztliches Attest anbei' } },
          { value: 'nein', label: { ro: 'Nu (absență scurtă de 1-2 zile)', de: 'Nein (Kurzerkrankung)' } },
        ],
        defaultValue: 'nein',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const child = answers.childName || 'Mein Kind';
      const cls = answers.className || 'die Klasse';
      const from = answers.dateFrom || 'gestern';
      const to = answers.dateTo || 'heute';
      const hasAttest = answers.hasAttest === 'ja';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Augsburg',
        subject: `Entschuldigung für das Fehlen im Unterricht: ${child} (${cls})`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte(r) Klassenlehrer(in),',
        paragraphs: [
          `mein Kind, ${child}, Schüler(in) der ${cls}, konnte im Zeitraum vom ${from} bis einschließlich zum ${to} aus gesundheitlichen Gründen leider nicht am Unterricht bzw. an den schulischen Veranstaltungen teilnehmen.`,
          `Ich bitte Sie höflich, das Fehlen zu entschuldigen. ${child} wird den versäumten Unterrichtsstoff selbstverständlich sorgfältig nacharbeiten.`,
          hasAttest
            ? `Ein entsprechendes ärztliches Attest über die Schulunfähigkeit ist diesem Schreiben beigefügt.`
            : `Für eventuelle Rückfragen stehe ich Ihnen unter meiner oben angegebenen Telefonnummer gern zur Verfügung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: hasAttest ? ['Ärztliches Attest'] : undefined,
      };
    },
  },
  {
    id: 'schule-beurlaubung',
    categoryId: 'kita_schule',
    isPremium: false,
    title: {
      ro: 'Cerere de învoire școlară pentru călătorie în familie / urgență (Beurlaubung)',
      de: 'Antrag auf Beurlaubung vom Schulunterricht',
    },
    shortDescription: {
      ro: 'Pentru învoirea oficială a copilului din motive familiale urgente (ex: evenimente sau urgențe în România).',
      de: 'Freistellung des Schülers aus wichtigem familiären Anlass oder unvorhergesehenen Gründen.',
    },
    bureaucraticTip: {
      ro: 'Atenție mare: Poliția federală germană verifică adesea pe aeroporturi familiile cu copii în timpul orelor de școală. O învoire scrisă și aprobată de directorul școlii este obligatorie pentru a evita amenzi usturătoare!',
      de: 'Reichen Sie den Antrag rechtzeitig (mindestens 2-3 Wochen im Voraus) bei der Schulleitung ein, besonders bei Terminen nahe den Ferien.',
    },
    fields: [
      {
        id: 'childName',
        label: { ro: 'Numele și prenumele elevului', de: 'Name des Schülers / der Schülerin' },
        placeholder: { ro: 'ex: Maria Ionescu', de: 'z.B. Maria Ionescu' },
        type: 'text',
        required: true,
      },
      {
        id: 'className',
        label: { ro: 'Clasa', de: 'Klasse' },
        placeholder: { ro: 'ex: 4a', de: 'z.B. 4a' },
        type: 'text',
        required: true,
      },
      {
        id: 'leaveDates',
        label: { ro: 'Perioada solicitată (zilele exacte)', de: 'Beurlaubungszeitraum' },
        placeholder: { ro: 'ex: vom 12. Mai 2025 bis zum 16. Mai 2025', de: 'z.B. vom 12.05. bis 16.05.' },
        type: 'text',
        required: true,
      },
      {
        id: 'reasonDetails',
        label: { ro: 'Motivul urgent (în germană sau descris scurt)', de: 'Begründung des Antrags' },
        placeholder: { ro: 'ex: dringende Familienangelegenheit im Heimatland Rumänien / Beerdigung eines nahen Angehörigen', de: 'z.B. wichtiger familiärer Anlass' },
        defaultValue: 'dringende familiäre Angelegenheit im Ausland',
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const child = answers.childName || 'Mein Kind';
      const cls = answers.className || 'die Schulklasse';
      const period = answers.leaveDates || 'im angegebenen Zeitraum';
      const reason = answers.reasonDetails || 'ein wichtiger familiärer Grund';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Mannheim',
        subject: `Antrag auf Beurlaubung vom Unterricht für ${child} (${cls})`,
        salutation: 'Sehr geehrte Schulleitung, sehr geehrte(r) Klassenlehrer(in),',
        paragraphs: [
          `hiermit beantrage ich für mein Kind, ${child}, Schüler(in) der Klasse ${cls}, eine Beurlaubung vom Schulunterricht für den Zeitraum ${period}.`,
          `Begründung des Antrags:\n„${reason}“`,
          `Dieser Anlass lässt sich aus zwingenden Gründen terminlich nicht in die reguläre Ferienzeit verlegen. Ich versichere Ihnen, dass mein Kind den gesamten während der Abwesenheit anfallenden Unterrichtsstoff eigenständig vor- bzw. nacharbeiten wird.`,
          `Ich bitte Sie höflich, dem Antrag stattzugeben und mir die schriftliche Genehmigung der Beurlaubung baldmöglichst zukommen zu lassen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kita-platz-anfrage',
    categoryId: 'kita_schule',
    isPremium: true,
    title: {
      ro: 'Cerere urgentă pentru loc la grădiniță / creșă (Kitaplatz gemäß § 24 SGB VIII)',
      de: 'Geltendmachung des Rechtsanspruchs auf einen Betreuungsplatz (§ 24 SGB VIII)',
    },
    shortDescription: {
      ro: 'Invocarea dreptului legal al copilului la un loc de grădiniță către Jugendamt / Primărie.',
      de: 'Offizielle Aufforderung an das Jugendamt zur Bereitstellung eines zumutbaren Kitaplatzes.',
    },
    bureaucraticTip: {
      ro: 'Copiii cu vârsta peste 1 an au drept legal la un loc de îngrijire în Germania. Dacă nu vi se oferă un loc în timp util, primăria poate fi obligată să suporte costurile unei bone private (Tagesmutter) sau despăgubiri pentru pierderea salariului.',
      de: 'Der Rechtsanspruch ab vollendetem 1. Lebensjahr ist gesetzlich in § 24 SGB VIII verankert. Setzen Sie dem Jugendamt eine Frist.',
    },
    fields: [
      {
        id: 'childName',
        label: { ro: 'Numele și data nașterii copilului', de: 'Name und Geburtsdatum des Kindes' },
        placeholder: { ro: 'ex: Matei Ionescu, geb. 15.04.2023', de: 'z.B. Max Mustermann, geb. 01.01.2023' },
        type: 'text',
        required: true,
      },
      {
        id: 'desiredDate',
        label: { ro: 'Data de la care doriți începerea frecventării grădiniței', de: 'Gewünschter Betreuungsbeginn' },
        type: 'date',
        required: true,
      },
      {
        id: 'hoursPerDay',
        label: { ro: 'Ore necesare de îngrijire pe zi (ex: 7-8 ore, din cauza programului de muncă)', de: 'Täglicher Betreuungsumfang (z.B. 40 Std./Woche)' },
        placeholder: { ro: 'ex: Ganztagsbetreuung (ca. 40 Stunden wöchentlich wegen Berufstätigkeit)', de: 'z.B. 40 Stunden pro Woche' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const child = answers.childName || 'Mein Kind';
      const dDate = answers.desiredDate || 'ab sofort';
      const hrs = answers.hoursPerDay || 'im vollen Umfang';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Bremen',
        subject: `Geltendmachung des Rechtsanspruchs auf einen Betreuungsplatz (§ 24 SGB VIII) für ${child}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit mache ich für mein Kind, ${child}, den gesetzlichen Rechtsanspruch auf frühkindliche Förderung in einer Tageseinrichtung bzw. Kindertagespflege gemäß § 24 Abs. 2 SGB VIII geltend.`,
          `Der Betreuungsplatz wird dringend ab dem ${dDate} mit einem Umfang von ${hrs} benötigt, da ich bzw. beide Erziehungsberechtigten einer geregelten Erwerbstätigkeit nachgehen. Bisherige Anmeldungen und Bemühungen um einen Kitaplatz blieben leider ohne Erfolg.`,
          `Ich fordere Sie daher auf, mir bis spätestens binnen 14 Tagen nach Zugang dieses Schreibens einen wohnortnahen und bedarfsgerechten Betreuungsplatz zuzuweisen.`,
          `Sollte kein geeigneter Platz rechtzeitig zur Verfügung gestellt werden, behalte ich mir vor, einen Platz bei einem privaten Träger oder einer Tagespflegeperson selbst zu beschaffen und die anfallenden Mehrkosten sowie Verdienstausfallschäden im Wege des Aufwendungsersatzes geltend zu machen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kita-kuendigung-platz',
    categoryId: 'kita_schule',
    isPremium: false,
    title: {
      ro: 'Reziliere loc grădiniță / after-school (Kündigung Kitaplatz / Hortplatz)',
      de: 'Kündigung des Betreuungsvertrages (Kita / Hort / Tagesmutter)',
    },
    shortDescription: {
      ro: 'Pentru rezilierea la termen sau extraordinară din cauza mutării în alt oraș sau a intrării la școală.',
      de: 'Fristgerechte Kündigung des Betreuungsplatzes für das Kind mit Bitte um Abmeldebestätigung.',
    },
    bureaucraticTip: {
      ro: 'Contractele de grădiniță au adesea un termen de preaviz de 1-3 luni până la sfârșitul lunii. Dacă vă mutați în alt oraș, puteți solicita încetarea amiabilă (Aufhebungsvertrag) sau Sonderkündigung.',
      de: 'Beachten Sie die Kündigungsfristen der Satzung bzw. des Betreuungsvertrages (oft zum Monatsende).',
    },
    fields: [
      {
        id: 'childName',
        label: { ro: 'Numele și data nașterii copilului', de: 'Name und Geburtsdatum des Kindes' },
        placeholder: { ro: 'ex: David Popa, geb. 12.06.2020', de: 'z.B. David Popa, geb. 12.06.2020' },
        type: 'text',
        required: true,
      },
      {
        id: 'groupName',
        label: { ro: 'Grupa sau denumirea clasei (ex: Sonnenscheingruppe)', de: 'Gruppe / Kitagruppe' },
        placeholder: { ro: 'ex: Bärengruppe / Gruppe Gelb', de: 'z.B. Regenbogengruppe' },
        type: 'text',
      },
      {
        id: 'terminationDate',
        label: { ro: 'Data de la care doriți încetarea contractului', de: 'Wirksam zum (Datum)' },
        type: 'date',
        required: true,
      },
      {
        id: 'reason',
        label: { ro: 'Motivul rezilierii (ex: mutare în alt oraș, începerea școlii)', de: 'Kündigungsgrund' },
        placeholder: { ro: 'ex: Umzug in eine andere Stadt / Einschulung zum neuen Schuljahr', de: 'z.B. Wohnortwechsel / Einschulung' },
        defaultValue: 'Wohnortwechsel in eine andere Gemeinde',
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const child = answers.childName || 'unser Kind';
      const grp = answers.groupName ? ` (${answers.groupName})` : '';
      const tDate = answers.terminationDate || 'zum nächstmöglichen Zeitpunkt';
      const rsn = answers.reason || 'persönlicher Gründe';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Hannover',
        subject: `Kündigung des Betreuungsvertrages für das Kind ${child}`,
        salutation: 'Sehr geehrte Damen und Herren, / Sehr geehrte Kitaleitung,',
        paragraphs: [
          `hiermit kündige ich den Betreuungsvertrag für mein Kind, ${child}${grp}, fristgerecht zum ${tDate}, hilfsweise zum nächstmöglichen Termin.`,
          `Grund für die Kündigung ist: ${rsn}.`,
          `Ich widerrufe hiermit zugleich die erteilte Einzugsermächtigung (SEPA-Lastschriftmandat) für die monatlichen Betreuungs- und Essensbeiträge mit Wirkung zum Kündigungszeitpunkt.`,
          `Ich bedanke mich herzlich bei dem gesamten pädagogischen Team für die liebevolle und engagierte Betreuung unseres Kindes.`,
          `Bitte senden Sie mir eine schriftliche Bestätigung über den Eingang dieser Kündigung sowie das genaue Beendigungsdatum des Betreuungsverhältnisses zu.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'schule-kostenuebernahme-but',
    categoryId: 'kita_schule',
    isPremium: false,
    title: {
      ro: 'Cerere decontare cheltuieli școlare / excursie (Bildung und Teilhabe - BuT)',
      de: 'Antrag auf Kostenübernahme für Klassenfahrt / Schulbedarf (BuT-Paket)',
    },
    shortDescription: {
      ro: 'Pentru decontarea rechizitelor (Schulbedarf) sau a excursiei clasei prin Jobcenter/Sozialamt.',
      de: 'Beantragung von Leistungen für Bildung und Teilhabe gemäß § 28 SGB II / § 34 SGB XII.',
    },
    bureaucraticTip: {
      ro: 'Familiile care primesc Bürgergeld, Wohngeld sau Kinderzuschlag au dreptul la decontarea 100% a excursiilor școlare și la 195 € / an pentru ghiozdan și rechizite!',
      de: 'Bezieher von Bürgergeld, Wohngeld oder Kinderzuschlag haben Anspruch auf volle Kostenübernahme für mehrtägige Klassenfahrten.',
    },
    fields: [
      {
        id: 'childNameSchool',
        label: { ro: 'Numele elevului, data nașterii și școala/clasa', de: 'Name des Schülers, Schule und Klasse' },
        placeholder: { ro: 'ex: Andrei Mureșan, geb. 10.03.2012, Klasse 6b, Goetheschule', de: 'z.B. Max, Klasse 6b' },
        type: 'text',
        required: true,
      },
      {
        id: 'benefitType',
        label: { ro: 'Ajutorul primit în prezent (ex: Bürgergeld, Wohngeld, Kinderzuschlag)', de: 'Laufender Leistungsbezug' },
        placeholder: { ro: 'ex: Wohngeld (Aktenzeichen: WG-12345) / Bürgergeld', de: 'z.B. Wohngeldempfänger' },
        type: 'text',
        required: true,
      },
      {
        id: 'tripOrItem',
        label: { ro: 'Scopul cererii (ex: Excursie școlară cu clasa / Rechizite)', de: 'Anlass des Antrags' },
        placeholder: { ro: 'ex: 4-tägige Klassenfahrt nach Hamburg vom 15.05. bis 19.05. (Kosten: 240 €)', de: 'z.B. Klassenfahrt oder Schulbedarf' },
        type: 'textarea',
        required: true,
      },
      {
        id: 'bankIbanSchool',
        label: { ro: 'IBAN pentru virarea banilor (al dvs. sau contul școlii)', de: 'Auszahlungskonto (IBAN)' },
        placeholder: { ro: 'ex: DE12 3456 7890 1234 5678 90', de: 'z.B. DE12 ...' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const child = answers.childNameSchool || 'mein Kind';
      const benefit = answers.benefitType || 'Leistungsbezug';
      const trip = answers.tripOrItem || 'Aufwendungen für Schulbedarf bzw. Schulfahrt';
      const iban = answers.bankIbanSchool || 'das angegebene Konto';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Dortmund',
        subject: `Antrag auf Leistungen für Bildung und Teilhabe (BuT) für ${child}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit beantrage ich Leistungen für Bildung und Teilhabe gemäß § 28 SGB II bzw. § 6b Bundeskindergeldgesetz (BKGG) für mein Kind:`,
          `Schüler(in): ${child}`,
          `Ich erhalte derzeit laufende Leistungen (${benefit}), sodass die Grundvoraussetzungen für die Gewährung des Bildungspakets uneingeschränkt erfüllt sind.`,
          `Konkret beantrage ich die Übernahme folgender Aufwendungen:`,
          `„${trip}“`,
          `Eine Kopie des Schreibens der Schule bzw. die Bestätigung über die Kosten und die Erforderlichkeit der Fahrt habe ich diesem Schreiben beigefügt.`,
          `Ich bitte Sie höflich um zeitnahe Bewilligung und Anweisung des Betrages auf folgende Bankverbindung:`,
          `IBAN: ${iban}`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Schreiben der Schule / Nachweis über die Kosten', 'Kopie des aktuellen Leistungsbescheids'],
      };
    },
  },
  {
    id: 'kita-schule-abmeldung',
    categoryId: 'kita_schule',
    isPremium: false,
    title: {
      ro: 'Retragere / Dezasociere de la școală sau grădiniță (Abmeldung)',
      de: 'Schriftliche Abmeldung von Schule oder Kindertagesstätte',
    },
    shortDescription: {
      ro: 'Pentru retragerea copilului din cauza mutării în alt oraș, întoarcerii în România sau schimbării școlii.',
      de: 'Offizielle Abmeldung des Kindes wegen Umzugs, Schulwechsels oder Fortzugs mit Bitte um Abmeldebescheinigung.',
    },
    bureaucraticTip: {
      ro: 'Pentru a înscrie copilul la o nouă școală, noua instituție are nevoie obligatoriu de adeverința de retragere (Abmeldebescheinigung) eliberată de școala actuală.',
      de: 'Für die Neuanmeldung an einer anderen Schule ist eine amtliche Schulabmeldebestätigung zwingend erforderlich.',
    },
    fields: [
      {
        id: 'childNameBirth',
        label: { ro: 'Numele, prenumele și data nașterii copilului', de: 'Name und Geburtsdatum des Kindes' },
        placeholder: { ro: 'ex: David Popescu, geb. 14.05.2016', de: 'z.B. David Popescu, geb. 14.05.2016' },
        type: 'text',
        required: true,
      },
      {
        id: 'currentClass',
        label: { ro: 'Clasa sau grupa actuală', de: 'Aktuelle Klasse oder Kitagruppe' },
        placeholder: { ro: 'ex: Klasse 2b / Dinogruppe', de: 'z.B. Klasse 3a' },
        type: 'text',
        required: true,
      },
      {
        id: 'deregistrationDate',
        label: { ro: 'Ultima zi de frecventare a școlii / grădiniței', de: 'Letzter Schultag / Wirksam zum' },
        type: 'date',
        required: true,
      },
      {
        id: 'abmeldeGrund',
        label: { ro: 'Motivul retragerii și viitoarea destinație', de: 'Grund der Abmeldung & künftige Schule/Ort' },
        placeholder: { ro: 'ex: Umzug nach München / Rückkehr nach Rumänien / Wechsel auf das Gymnasium', de: 'z.B. Wohnortwechsel nach München' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const child = answers.childNameBirth || 'mein Kind';
      const cls = answers.currentClass || 'die aktuelle Klasse';
      const dDate = answers.deregistrationDate || 'zum Schuljahresende';
      const reason = answers.abmeldeGrund || 'Wohnortwechsels';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Stuttgart',
        subject: `Abmeldung von der Schule / Einrichtung: ${child} (${cls})`,
        salutation: 'Sehr geehrte Schulleitung, sehr geehrte Lehrkräfte,',
        paragraphs: [
          `hiermit melde ich mein Kind, ${child}, derzeit Schüler(in) der ${cls}, zum ${dDate} offiziell von Ihrer Einrichtung ab.`,
          `Grund für die Abmeldung ist: ${reason}.`,
          `Ab dem genannten Zeitpunkt wird mein Kind den Unterricht bzw. die Betreuung an Ihrer Einrichtung nicht mehr besuchen. Eine entsprechende Neuanmeldung an der zuständigen aufnehmenden Schule bzw. Einrichtung wird ordnungsgemäß veranlasst.`,
          `Ich bitte Sie höflich, mir eine schriftliche Schulabmeldebescheinigung (bzw. Abmeldebestätigung) sowie die Schullaufbahnunterlagen postalisch an meine oben stehende Adresse zukommen zu lassen.`,
          `Wir bedanken uns herzlich bei der Schulleitung und allen Lehrkräften für die Unterstützung und Betreuung in der vergangenen Zeit.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kita-schule-anmeldung',
    categoryId: 'kita_schule',
    isPremium: false,
    title: {
      ro: 'Cerere de înscriere la școală / grădiniță / semi-internat (Anmeldung)',
      de: 'Schriftliche Anmeldung / Aufnahmeantrag für Schule oder Kita',
    },
    shortDescription: {
      ro: 'Pentru înscrierea oficială a copilului la școala de circumscripție, grădiniță sau programul prelungit (Ganztag/Hort).',
      de: 'Formeller Antrag auf Aufnahme des Kindes zum Schuljahr bzw. Betreuungsjahr.',
    },
    bureaucraticTip: {
      ro: 'La mutarea într-o nouă localitate din Germania, copilul trebuie înscris la școala arondată (Sprengelschule / Einzugsschule). Atașați copia certificatului de naștere și a adeverinței de înregistrare (Meldebescheinigung).',
      de: 'Fügen Sie eine Kopie der Geburtsurkunde, der Meldebescheinigung und des Impfausweises (Masernnachweis) bei.',
    },
    fields: [
      {
        id: 'childNameBirth',
        label: { ro: 'Numele, prenumele și data nașterii copilului', de: 'Name und Geburtsdatum des Kindes' },
        placeholder: { ro: 'ex: Matei Ionescu, geb. 20.08.2017', de: 'z.B. Matei Ionescu, geb. 20.08.2017' },
        type: 'text',
        required: true,
      },
      {
        id: 'targetGrade',
        label: { ro: 'Clasa sau grupa dorită (ex: Clasa 1 / Clasa 5 / Ganztagsbetreuung)', de: 'Gewünschte Klassenstufe / Betreuungsform' },
        placeholder: { ro: 'ex: Aufnahme in die 1. Grundschulklasse mit Ganztagsbetreuung', de: 'z.B. 1. Klasse Grundschule' },
        type: 'text',
        required: true,
      },
      {
        id: 'startDate',
        label: { ro: 'Data dorită pentru începere (ex: început de an școlar)', de: 'Gewünschter Aufnahmetermin' },
        type: 'date',
        required: true,
      },
      {
        id: 'specialNotes',
        label: { ro: 'Informații suplimentare (limbi vorbite, mutare recentă, frați în școală)', de: 'Besondere Angaben / Vorkenntnisse' },
        placeholder: { ro: 'ex: Kürzlicher Umzug nach Deutschland; Kind lernt engagiert Deutsch; Geschwisterkind besucht bereits die Schule.', de: 'z.B. Zuzug aus Rumänien, Förderbedarf' },
        type: 'textarea',
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const child = answers.childNameBirth || 'mein Kind';
      const grade = answers.targetGrade || 'die entsprechende Klassenstufe';
      const sDate = answers.startDate || 'zum kommenden Schuljahr';
      const notes = answers.specialNotes ? `\nErgänzende Angaben:\n„${answers.specialNotes}“` : '';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Nürnberg',
        subject: `Antrag auf Aufnahme / Anmeldung an Ihrer Einrichtung für ${child}`,
        salutation: 'Sehr geehrte Schulleitung, sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit melde ich mein Kind, ${child}, verbindlich für die Aufnahme an Ihrer Schule bzw. Einrichtung zum ${sDate} an.`,
          `Beantragt wird die Aufnahme in: ${grade}.${notes}`,
          `Wir haben unseren Wohnsitz im Einzugsgebiet Ihrer Einrichtung begründet. Kopien der amtlichen Meldebescheinigung sowie der Geburtsurkunde sind diesem Schreiben beigefügt.`,
          `Der gesetzlich vorgeschriebene Nachweis über einen ausreichenden Masernschutz (Impfnachweis) liegt ebenfalls vor und kann jederzeit vorgelegt werden.`,
          `Ich bitte Sie höflich um Prüfung der Unterlagen und um Zusendung der Anmeldebestätigung sowie aller weiteren Informationen zum Einschulungs- bzw. Aufnahmeverfahren.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Kopie der amtlichen Meldebestätigung', 'Kopie der Geburtsurkunde'],
      };
    },
  },
  {
    id: 'schule-kita-auskunft',
    categoryId: 'kita_schule',
    isPremium: false,
    title: {
      ro: 'Cerere de informații / dialog pedagogic (Auskunft & Elterngespräch)',
      de: 'Anfrage nach Auskunft zum Entwicklungsstand und Bitte um Elterngespräch',
    },
    shortDescription: {
      ro: 'Solicitare oficială pentru clarificarea situației școlare, a progresului copilului sau programarea unei discuții cu învățătorul.',
      de: 'Formelle Terminanfrage für ein persönliches Elterngespräch zur schulischen Entwicklung und Förderung.',
    },
    bureaucraticTip: {
      ro: 'Părinții au dreptul la informare periodică din partea cadrelor didactice. O solicitare scrisă politicoasă asigură stabilirea rapidă a unei întâlniri (Elterngespräch) sau a unui raport de progres.',
      de: 'Eltern haben nach den Schulgesetzen der Länder ein Recht auf Auskunft über den Leistungs- und Entwicklungsstand ihres Kindes.',
    },
    fields: [
      {
        id: 'childName',
        label: { ro: 'Numele și prenumele elevului / copilului', de: 'Name des Kindes' },
        placeholder: { ro: 'ex: Matei Popescu', de: 'z.B. Matei Popescu' },
        type: 'text',
        required: true,
      },
      {
        id: 'className',
        label: { ro: 'Clasa sau grupa (Klasse / Gruppe)', de: 'Klasse oder Gruppe' },
        placeholder: { ro: 'ex: Klasse 3b', de: 'z.B. Klasse 3b' },
        type: 'text',
        required: true,
      },
      {
        id: 'topicDetails',
        label: { ro: 'Subiectul despre care doriți informații sau lămuriri', de: 'Anlass der Anfrage / Themen' },
        placeholder: { ro: 'ex: Aktueller Leistungsstand im Fach Deutsch, Empfehlungen zur Sprachförderung und Notenentwicklung', de: 'z.B. Leistungsstand und Fördermöglichkeiten' },
        type: 'textarea',
        required: true,
      },
      {
        id: 'availabilityTime',
        label: { ro: 'Zilele sau orele când sunteți disponibil(ă) pentru o întâlnire', de: 'Terminwünsche / Erreichbarkeit' },
        placeholder: { ro: 'ex: Dienstags oder Donnerstags ab 15:00 Uhr, telefonisch oder vor Ort', de: 'z.B. Nachmittags ab 14 Uhr' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const child = answers.childName || 'unser Kind';
      const cls = answers.className || 'die Schulklasse';
      const topic = answers.topicDetails || 'den aktuellen schulischen Leistungs- und Entwicklungsstand';
      const avail = answers.availabilityTime || 'nach Absprache';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Hannover',
        subject: `Anfrage zum Leistungsstand und Bitte um ein Elterngespräch für ${child} (${cls})`,
        salutation: 'Sehr geehrte(r) Klassenlehrer(in), sehr geehrte Lehrkräfte,',
        paragraphs: [
          `als Erziehungsberechtigte(r) von ${child}, Schüler(in) der Klasse ${cls}, wende ich mich heute mit einer Bitte um Auskunft an Sie.`,
          `Um mein Kind bestmöglich im häuslichen Umfeld zu begleiten und gezielt zu fördern, möchte ich mich über folgende Themen erkundigen:`,
          `„${topic}“`,
          `Ich bitte Sie höflich um die Vereinbarung eines persönlichen oder telefonischen Elterngesprächs.`,
          `Für einen Gesprächstermin stehe ich Ihnen zeitlich gerne wie folgt zur Verfügung:\n${avail}`,
          `Ich danke Ihnen herzlich für Ihren geschätzten pädagogischen Einsatz und freue mich auf Ihre Rückmeldung zur Terminkoordination.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
];

