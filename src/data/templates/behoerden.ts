import { LetterTemplate } from '../../types';

export const behoerdenTemplates: LetterTemplate[] = [
  {
    id: 'behoerde-fristverlaengerung',
    categoryId: 'behoerden',
    isPremium: false,
    title: {
      ro: 'Cerere de prelungire a termenului limită (Fristverlängerung)',
      de: 'Antrag auf Fristverlängerung zur Einreichung von Unterlagen',
    },
    shortDescription: {
      ro: 'Când o autoritate (Jobcenter, Finanzamt, Ausländerbehörde) îți cere acte și ai nevoie de timp suplimentar.',
      de: 'Fristverlängerungsantrag zur Vermeidung von Leistungskürzungen oder Säumniszuschlägen.',
    },
    bureaucraticTip: {
      ro: 'Trimiteți cererea DE ÎNDATĂ, înainte de expirarea termenului inițial! Menționați clar numărul de dosar (Aktenzeichen) de pe scrisoarea primită.',
      de: 'Stellen Sie den Antrag immer VOR Ablauf der ursprünglichen Frist unter Angabe des Aktenzeichens.',
    },
    fields: [
      {
        id: 'aktenzeichen',
        label: { ro: 'Număr de dosar (Aktenzeichen / Geschäftszeichen)', de: 'Aktenzeichen / Geschäftszeichen' },
        placeholder: { ro: 'ex: AZ: 123/4567/8900 sau BG-Nummer', de: 'z.B. AZ: 123/4567/8900' },
        type: 'text',
        required: true,
      },
      {
        id: 'originalDeadline',
        label: { ro: 'Termenul limită inițial primit', de: 'Bisherige Frist' },
        type: 'date',
        required: true,
      },
      {
        id: 'requestedDeadline',
        label: { ro: 'Noul termen solicitat', de: 'Beantragte Fristverlängerung bis' },
        type: 'date',
        required: true,
      },
      {
        id: 'delayReason',
        label: { ro: 'Motivul întârzierii (ex: aștept acte traduse din România, programare la medic)', de: 'Begründung der Verzögerung' },
        placeholder: { ro: 'ex: Die angeforderten Urkunden aus Rumänien befinden sich noch bei der amtlichen Übersetzung / Beglaubigung.', de: 'z.B. Unterlagen aus dem Heimatland sind noch in Übersetzung.' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const az = answers.aktenzeichen || 'ohne AZ';
      const oDl = answers.originalDeadline || 'zurzeit';
      const rDl = answers.requestedDeadline || 'zum nächstmöglichen Zeitpunkt';
      const reason = answers.delayReason || 'notwendige behördliche Wege und Beschaffungszeiten';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `Antrag auf Fristverlängerung – Aktenzeichen: ${az}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `mit Schreiben vom heutigen Bezug haben Sie mir zur Einreichung der noch ausstehenden Unterlagen eine Frist bis zum ${oDl} gesetzt.`,
          `Ich bemühe mich intensiv um die vollständige Beibringung aller Unterlagen. Leider verzögert sich die Beschaffung aus folgendem unverschuldeten Grund:`,
          `„${reason}“`,
          `Aus diesem Grund beantrage ich hiermit höflich eine Verlängerung der Frist bis zum ${rDl}. Ich gehe davon aus, dass mir bis zu diesem Datum alle erforderlichen Dokumente vorliegen und ich sie Ihnen umgehend nachreichen kann.`,
          `Ich danke Ihnen für Ihr Verständnis und bitte um eine kurze schriftliche Bestätigung der Fristverlängerung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'behoerde-sachstandsanfrage',
    categoryId: 'behoerden',
    isPremium: false,
    title: {
      ro: 'Întrebare oficială privind stadiul dosarului (Sachstandsanfrage)',
      de: 'Sachstandsanfrage zu einem laufenden Antrag',
    },
    shortDescription: {
      ro: 'Pentru cereri depuse de mult timp fără răspuns (Kindergeld, permis de ședere, cetățenie, alocații).',
      de: 'Höfliche Nachfrage zum aktuellen Bearbeitungsstand eines Antrags nach Ablauf angemessener Zeit.',
    },
    bureaucraticTip: {
      ro: 'Dacă o autoritate germană nu răspunde timp de 6 luni la o cerere, legea prevede posibilitatea de „Untätigkeitsklage” (acțiune în instanță pentru inactivitate conform § 75 VwGO sau § 88 SGG).',
      de: 'Geben Sie der Behörde mindestens 6 bis 8 Wochen Bearbeitungszeit vor einer ersten Sachstandsanfrage.',
    },
    fields: [
      {
        id: 'applicationType',
        label: { ro: 'Tipul cererii depuse (Antrag)', de: 'Art des Antrags' },
        placeholder: { ro: 'ex: Antrag auf Kindergeld / Antrag auf Erteilung eines Aufenthaltstitels / Einbürgerung', de: 'z.B. Antrag auf Kindergeld' },
        type: 'text',
        required: true,
      },
      {
        id: 'aktenzeichen',
        label: { ro: 'Număr de dosar (Aktenzeichen / Antragsnummer)', de: 'Aktenzeichen / Vorgangsnummer' },
        placeholder: { ro: 'ex: KG-991204 sau AZ: 512-AB', de: 'z.B. AZ: 512-AB' },
        type: 'text',
        required: true,
      },
      {
        id: 'submissionDate',
        label: { ro: 'Data la care ai depus dosarul', de: 'Datum der Antragstellung' },
        type: 'date',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const appType = answers.applicationType || 'den gestellten Antrag';
      const az = answers.aktenzeichen || 'ohne AZ';
      const subDate = answers.submissionDate || 'vor einiger Zeit';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt',
        subject: `Sachstandsanfrage zum ${appType} – Aktenzeichen: ${az}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `am ${subDate} habe ich bei Ihnen den oben bezeichneten Antrag eingereicht.`,
          `Seit der vollständigen Einreichung der erforderlichen Antragsunterlagen ist ein längerer Zeitraum vergangen, ohne dass mir ein Zwischenbescheid oder eine Mitteilung zugegangen ist.`,
          `Ich erkundige mich daher höflich nach dem aktuellen Bearbeitungsstand meines Vorgangs und bitte Sie um Auskunft, wann voraussichtlich mit einer Entscheidung gerechnet werden kann.`,
          `Sollten für die abschließende Bearbeitung meinerseits noch weitere Auskünfte oder Unterlagen benötigt werden, stehe ich Ihnen jederzeit gern zur Verfügung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'behoerde-widerspruch-bescheid',
    categoryId: 'behoerden',
    isPremium: true,
    title: {
      ro: 'Contestație oficială împotriva unei decizii nefavorabile (Widerspruch)',
      de: 'Fristwahrender Widerspruch gegen einen behördlichen Bescheid',
    },
    shortDescription: {
      ro: 'Pentru atacarea unei decizii de respingere de la Jobcenter, Familienkasse, Finanzamt sau alte instituții.',
      de: 'Rechtsbehelf zur Wahrung der einmonatigen Widerspruchsfrist mit Ankündigung der Begründung.',
    },
    bureaucraticTip: {
      ro: 'FOARTE IMPORTANT: Termenul legal de contestație este strict de 1 LUNĂ de la primirea deciziei (Bescheid). Se poate trimite mai întâi contestația pentru a salva termenul („zur Fristwahrung”), iar argumentația detaliată se trimite ulterior!',
      de: 'Die Widerspruchsfrist beträgt genau 1 Monat ab Bekanntgabe. Senden Sie das Schreiben unbedingt fristwahrend vorab per Einschreiben oder Fax.',
    },
    fields: [
      {
        id: 'bescheidName',
        label: { ro: 'Denumirea deciziei atacate (Bescheid über ...)', de: 'Bezeichnung des Bescheids' },
        placeholder: { ro: 'ex: Ablehnungsbescheid über Leistungen nach dem SGB II / Aufhebungsbescheid Kindergeld', de: 'z.B. Ablehnungsbescheid' },
        type: 'text',
        required: true,
      },
      {
        id: 'bescheidDate',
        label: { ro: 'Data deciziei (Bescheiddatum)', de: 'Datum des Bescheids' },
        type: 'date',
        required: true,
      },
      {
        id: 'aktenzeichen',
        label: { ro: 'Număr dosar / Aktenzeichen de pe decizie', de: 'Aktenzeichen' },
        placeholder: { ro: 'ex: 442-BG-109283 / 2025', de: 'z.B. 442-BG-109283' },
        type: 'text',
        required: true,
      },
      {
        id: 'argumentSummary',
        label: { ro: 'Motivele pe scurt pe care le contești', de: 'Kurze Begründung' },
        placeholder: { ro: 'ex: Die Berechnung meines Einkommens ist fehlerhaft. Die tatsächlichen Miet- und Heizkosten wurden nicht vollständig berücksichtigt.', de: 'z.B. Das Einkommen wurde fehlerhaft berechnet.' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const bName = answers.bescheidName || 'Bescheid';
      const bDate = answers.bescheidDate || 'kürzlich ergangen';
      const az = answers.aktenzeichen || 'N/A';
      const args = answers.argumentSummary || 'Der Bescheid beruht auf unzutreffenden Tatsachenfeststellungen.';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Köln',
        subject: `Widerspruch gegen den ${bName} vom ${bDate} – Aktenzeichen: ${az}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `gegen Ihren oben genannten Bescheid vom ${bDate}, mir zugegangen vor wenigen Tagen, lege ich hiermit form- und fristgerecht`,
          `WIDERSPRUCH`,
          `ein. Zur Begründung führe ich Folgendes an:`,
          `„${args}“`,
          `Der angefochtene Bescheid ist sowohl in tatsächlicher als auch in rechtlicher Hinsicht rechtswidrig und verletzt mich in meinen Rechten. Eine ergänzende und detaillierte rechtliche Begründung behalte ich mir ausdrücklich in einem gesonderten Schriftsatz vor.`,
          `Ich beantrage daher, den Bescheid vom ${bDate} vollumfänglich aufzuheben und meinem ursprünglichen Antrag stattzugeben. Ich bitte um schriftliche Eingangsbestätigung dieses Widerspruchs.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'behoerde-ratenzahlung-antrag',
    categoryId: 'behoerden',
    isPremium: false,
    title: {
      ro: 'Cerere de plată în rate sau amânare (Ratenzahlung / Stundung)',
      de: 'Antrag auf Ratenzahlung / Stundung einer Zahlungsforderung',
    },
    shortDescription: {
      ro: 'Pentru Finanzamt, Zoll, Jobcenter sau primărie când nu poți achita dintr-o dată o sumă mare.',
      de: 'Formeller Antrag auf Ratenzahlung zur Vermeidung von Vollstreckungsmaßnahmen und Säumniszuschlägen.',
    },
    bureaucraticTip: {
      ro: 'Autoritățile germane aprobă aproape întotdeauna plata în rate dacă solicitați înainte de termenul limită și propuneți o sumă lunară realistă (ex: 50 € sau 100 €/lună)!',
      de: 'Stellen Sie den Antrag unbedingt vor Fristablauf, um teure Mahn- und Säumniszuschläge zu verhindern.',
    },
    fields: [
      {
        id: 'aktenzeichen',
        label: { ro: 'Număr dosar / număr de identificare fiscală (Steuernummer / Kassenzeichen)', de: 'Aktenzeichen / Steuernummer / Kassenzeichen' },
        placeholder: { ro: 'ex: St.-Nr. 18/234/56789 sau AZ: 2024-9912', de: 'z.B. 12/345/67890' },
        type: 'text',
        required: true,
      },
      {
        id: 'totalDebt',
        label: { ro: 'Suma totală datorată (€)', de: 'Gesamtforderungsbetrag (€)' },
        placeholder: { ro: 'ex: 850,00', de: 'z.B. 650,00' },
        type: 'text',
        required: true,
      },
      {
        id: 'monthlyInstallment',
        label: { ro: 'Rata lunară propusă (€/lună) și data primei plăți', de: 'Monatliche Ratenhöhe (€) & Erstzahlung' },
        placeholder: { ro: 'ex: 100,00 € monatlich, beginnend zum 15. des nächsten Monats', de: 'z.B. 75 € ab dem 01. nächsten Monats' },
        type: 'text',
        required: true,
      },
      {
        id: 'financialHardshipReason',
        label: { ro: 'Motivul dificultății financiare temporare', de: 'Begründung der wirtschaftlichen Notlage' },
        placeholder: { ro: 'ex: Unerwartete Reparaturkosten und befristetes Einkommen', de: 'z.B. Vorübergehende finanzielle Engpässe' },
        defaultValue: 'Aufgrund unvorhergesehener persönlicher Ausgaben und meiner aktuellen Einkommenssituation ist eine Einmalzahlung wirtschaftlich nicht tragbar.',
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const az = answers.aktenzeichen || 'N/A';
      const tot = answers.totalDebt || 'den geforderten Betrag';
      const rate = answers.monthlyInstallment || 'angemessene monatliche Raten';
      const rsn = answers.financialHardshipReason || 'vorübergehender finanzieller Härte';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt am Main',
        subject: `Antrag auf Ratenzahlung zur Zahlungsaufforderung – Zeichen: ${az}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `mit Bescheid bzw. Zahlungsaufforderung fordern Sie von mir die Begleichung eines Betrages in Höhe von ${tot} €.`,
          `Ich erkenne die Forderung dem Grunde nach an. Eine vollständige Begleichung in einer Summe ist mir zum jetzigen Zeitpunkt jedoch unverschuldet nicht möglich:`,
          `„${rsn}“`,
          `Um die Forderung dennoch verlässlich und vollständig zu tilgen, beantrage ich hiermit, mir eine Ratenzahlung in folgender Höhe zu gewähren:`,
          `Monatliche Rate: ${rate}`,
          `Ich versichere Ihnen, die vereinbarten Teilbeträge pünktlich zu überweisen und bitte Sie höflich, bis zur Entscheidung über diesen Antrag von Vollstreckungsmaßnahmen oder weiteren Mahngebühren abzusehen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'behoerde-akteneinsicht-antrag',
    categoryId: 'behoerden',
    isPremium: false,
    title: {
      ro: 'Cerere de acces la dosarul administrativ (Akteneinsicht § 25 SGB X / § 29 VwVfG)',
      de: 'Antrag auf Akteneinsicht gemäß § 25 SGB X / § 29 VwVfG',
    },
    shortDescription: {
      ro: 'Pentru a vedea toate actele, calculele și notele interne deținute de autoritate despre cazul tău.',
      de: 'Einsicht in alle verfahrensbezogenen behördlichen Unterlagen zur Wahrnehmung der rechtlichen Interessen.',
    },
    bureaucraticTip: {
      ro: 'Aveți dreptul legal de a vedea dosarul complet înainte de a formula o contestație detaliată. Autoritatea vă poate trimite copii prin poștă sau permite consultarea dosarului la sediu.',
      de: 'Das Recht auf Akteneinsicht ist ein elementarer Bestandteil des rechtsstaatlichen Verwaltungsverfahrens.',
    },
    fields: [
      {
        id: 'aktenzeichen',
        label: { ro: 'Numărul de dosar / referință (Aktenzeichen)', de: 'Aktenzeichen / Geschäftszeichen' },
        placeholder: { ro: 'ex: AZ: 33/452/100-2025', de: 'z.B. AZ: 123/45' },
        type: 'text',
        required: true,
      },
      {
        id: 'matterDescription',
        label: { ro: 'Denumirea procedurii sau a cererii tale', de: 'Bezeichnung des Verfahrens' },
        placeholder: { ro: 'ex: Antrag auf Bürgergeld / Kinderzuschlag / Einbürgerung', de: 'z.B. Laufendes Antragsverfahren' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const az = answers.aktenzeichen || 'N/A';
      const matter = answers.matterDescription || 'das laufende Verfahren';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Stuttgart',
        subject: `Antrag auf Gewährung von Akteneinsicht – Aktenzeichen: ${az}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `im oben genannten Verfahren betreffend „${matter}“ (Aktenzeichen: ${az}) beantrage ich hiermit gemäß § 25 SGB X bzw. § 29 VwVfG die Gewährung vollständiger Akteneinsicht.`,
          `Die Kenntnis der vollständigen Aktenvorgänge ist zur Geltendmachung und Wahrnehmung meiner rechtlichen Interessen zwingend erforderlich.`,
          `Ich bitte Sie höflich, mir Kopien der maßgeblichen Aktenbestandteile per Post oder digital an meine bekannte Adresse zukommen zu lassen bzw. mir einen zeitnahen Termin zur Einsichtnahme in Ihren Geschäftsräumen mitzuteilen.`,
          `Eventuell anfallende Auslagen für Ablichtungen bitte ich mir vorab kurz mitzuteilen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'behoerde-adressenaenderung-mitteilung',
    categoryId: 'behoerden',
    isPremium: false,
    title: {
      ro: 'Notificare oficială schimbare de adresă către autorități (Adressänderung)',
      de: 'Mitteilung über Wohnsitz- und Adressänderung an Behörden',
    },
    shortDescription: {
      ro: 'Pentru Finanzamt, Familienkasse, Rentenversicherung etc. la mutarea la o nouă locuință.',
      de: 'Formelle Adressmitteilung mit Angabe von Steuer-ID, Versicherungsnummer oder Aktenzeichen.',
    },
    bureaucraticTip: {
      ro: 'Trimiteți notificarea către Familienkasse (alocație copii) și Finanzamt pentru a preveni oprirea plăților sau trimiterea scrisorilor la vechea adresă!',
      de: 'Behördenbriefe gelten als zugestellt, wenn sie an die letzte bekannte Anschrift gesandt werden. Eine Mitteilung verhindert Rechtsnachteile.',
    },
    fields: [
      {
        id: 'referenceNumber',
        label: { ro: 'Număr dosar / ID fiscal / Kindergeldnummer', de: 'Aktenzeichen / Steuer-ID / Kindergeldnummer' },
        placeholder: { ro: 'ex: Kindergeld-Nr.: 123FK456789 sau Steuer-ID: 75 829 104 382', de: 'z.B. AZ: 12345' },
        type: 'text',
        required: true,
      },
      {
        id: 'movingDate',
        label: { ro: 'Data la care a avut / va avea loc mutarea', de: 'Datum des Umzugs' },
        type: 'date',
        required: true,
      },
      {
        id: 'oldAddress',
        label: { ro: 'Vechea adresă completă', de: 'Bisherige Anschrift' },
        placeholder: { ro: 'ex: Musterweg 5, 10115 Berlin', de: 'z.B. Musterweg 5, 10115 Berlin' },
        type: 'text',
        required: true,
      },
      {
        id: 'newAddress',
        label: { ro: 'Noua adresă completă', de: 'Neue Anschrift' },
        placeholder: { ro: 'ex: Neue Straße 10, 80331 München', de: 'z.B. Neue Straße 10, 80331 München' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const ref = answers.referenceNumber || 'N/A';
      const mDate = answers.movingDate || 'vor Kurzem';
      const oldA = answers.oldAddress || 'bisherige Adresse';
      const newA = answers.newAddress || `${sender.street}, ${sender.postalCode} ${sender.city}`;

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Mitteilung über Adressänderung – Referenz: ${ref}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit teile ich Ihnen mit, dass sich mein ständiger Wohnsitz mit Wirkung zum ${mDate} geändert hat.`,
          `Bisherige Anschrift:\n${oldA}`,
          `Neue Anschrift ab ${mDate}:\n${newA}`,
          `Ich bitte Sie, meine neuen Kontaktdaten in Ihren Systemen unter der Referenz ${ref} zu hinterlegen und künftigen Schriftverkehr ausschließlich an die neue Anschrift zu richten.`,
          `Eine Kopie der aktuellen amtlichen Meldebescheinigung ist diesem Schreiben zur Verifizierung beigefügt.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: ['Kopie der amtlichen Meldebestätigung'],
      };
    },
  },
  {
    id: 'behoerde-terminanfrage',
    categoryId: 'behoerden',
    isPremium: false,
    title: {
      ro: 'Solicitare oficială de programare / audiență (Terminanfrage)',
      de: 'Dringende Terminanfrage zur persönlichen Vorsprache',
    },
    shortDescription: {
      ro: 'Pentru Bürgeramt, Ausländerbehörde, Jobcenter sau Finanzamt când nu găsești programări online.',
      de: 'Formelle Terminanfrage unter Darlegung der Dringlichkeit zur Vermeidung rechtlicher Fristversäumnisse.',
    },
    bureaucraticTip: {
      ro: 'Dacă sistemul online de programări este blocat, o cerere scrisă oficială este dovada că ați încercat să respectați termenele legale (Fristwahrung) și obligă instituția să vă ofere un termen!',
      de: 'Eine schriftliche Terminanfrage wahrt Fristen, falls das behördliche Online-Buchungssystem überlastet oder ausgebucht ist.',
    },
    fields: [
      {
        id: 'authorityMatter',
        label: { ro: 'Scopul întâlnirii / cererea vizată', de: 'Anlass des Termins / Anliegen' },
        placeholder: { ro: 'ex: Verlängerung der Aufenthaltserlaubnis / Beantragung eines Ausweisdokuments / Anmeldung', de: 'z.B. Verlängerung des Aufenthaltstitels' },
        type: 'text',
        required: true,
      },
      {
        id: 'fileOrIdNumber',
        label: { ro: 'Număr dosar, ID sau data nașterii', de: 'Aktenzeichen / Geburtsdatum / ID' },
        placeholder: { ro: 'ex: AZ: 12345 sau geb. 15.05.1990', de: 'z.B. AZ: 12345' },
        type: 'text',
        required: true,
      },
      {
        id: 'urgencyReason',
        label: { ro: 'De ce este urgent? (ex: expirare document, începere serviciu, călătorie)', de: 'Begründung der Dringlichkeit' },
        placeholder: { ro: 'ex: Mein bisheriger Aufenthaltstitel läuft am [Datum] ab. Ohne rechtzeitigen Termin droht der Verlust meines Arbeitsplatzes.', de: 'z.B. Ablauf von Ausweispapieren' },
        type: 'textarea',
        required: true,
      },
      {
        id: 'timeAvailability',
        label: { ro: 'Zile sau intervale orare în care puteți veni', de: 'Mögliche Termintage / Erreichbarkeit' },
        placeholder: { ro: 'ex: Jederzeit kurzfristig verfügbar, telefonisch erreichbar unter 0176 ...', de: 'z.B. Jederzeit kurzfristig verfügbar' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const matter = answers.authorityMatter || 'ein dringendes behördliches Anliegen';
      const ref = answers.fileOrIdNumber || 'N/A';
      const urgency = answers.urgencyReason || 'dringender Handlungsbedarf';
      const avail = answers.timeAvailability || 'jederzeit kurzfristig';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `Dringende Terminanfrage zur persönlichen Vorsprache – Betreff: ${matter} (Ref.: ${ref})`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `bezüglich meines Anliegens „${matter}“ (Referenz / Aktenzeichen: ${ref}) bemühe ich mich seit geraumer Zeit vergeblich um die Buchung eines Vorsprachetermins über Ihr Online-Portal.`,
          `Da die Angelegenheit von erheblicher Dringlichkeit ist, wende ich mich nunmehr auf diesem Wege schriftlich an Sie:`,
          `Begründung der Dringlichkeit:\n„${urgency}“`,
          `Ich bitte Sie daher mit Nachdruck, mir zeitnah einen verbindlichen Termin zur persönlichen Vorsprache zuzuweisen.`,
          `Zur Wahrnehmung des Termins stehe ich wie folgt zur Verfügung:\n${avail}`,
          `Ich danke Ihnen für Ihre Unterstützung und erbitte eine zeitnahe Mitteilung des Termins per Brief oder E-Mail.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'behoerde-unterlagen-anforderung',
    categoryId: 'behoerden',
    isPremium: false,
    title: {
      ro: 'Solicitare duplicate de documente / adeverințe oficiale (Unterlagenanforderung)',
      de: 'Anforderung von Unterlagen, Bescheinigungen und Bescheidabschriften',
    },
    shortDescription: {
      ro: 'Pentru obținerea de copii legalizate, duplicate după decizii pierdute, Meldebescheinigung sau adeverințe fiscale.',
      de: 'Formeller Antrag auf Ausstellung von Zweitschriften, amtlichen Bestätigungen oder Bescheidkopien.',
    },
    bureaucraticTip: {
      ro: 'Instituțiile germane pot elibera duplicate după aproape orice decizie anterioară (Zweitschrift / Abschrift). Menționați numărul dosarului și anul aproximativ.',
      de: 'Geben Sie nach Möglichkeit das damalige Aktenzeichen oder den Zeitraum an, um die Archivsuche zu beschleunigen.',
    },
    fields: [
      {
        id: 'documentRequested',
        label: { ro: 'Ce document sau adeverință solicitați?', de: 'Bezeichnung der benötigten Unterlage' },
        placeholder: { ro: 'ex: Zweitschrift des Bewilligungsbescheids / Meldebescheinigung / Nichtveranlagungs-Bescheinigung', de: 'z.B. Abschrift des Bescheids' },
        type: 'text',
        required: true,
      },
      {
        id: 'referenceNumber',
        label: { ro: 'Număr de dosar, Steuer-ID sau alt identificator', de: 'Aktenzeichen / Steuernummer / Kennziffer' },
        placeholder: { ro: 'ex: AZ: 99/120/45123 sau Steuer-ID', de: 'z.B. AZ: 12345' },
        type: 'text',
        required: true,
      },
      {
        id: 'purposeDetails',
        label: { ro: 'Scopul solicitării (unde trebuie prezentat documentul)', de: 'Verwendungszweck / Begründung' },
        placeholder: { ro: 'ex: Zur Vorlage bei der Ausländerbehörde / beim Jobcenter / für den Mietvertrag', de: 'z.B. Zur Vorlage bei einer Behörde' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const doc = answers.documentRequested || 'die amtliche Bescheinigung / Bescheidabschrift';
      const ref = answers.referenceNumber || 'N/A';
      const purp = answers.purposeDetails || 'behördliche Nachweiszwecke';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Anforderung von Unterlagen: ${doc} – Zeichen: ${ref}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `für ${purp} benötige ich zeitnah folgende behördliche Unterlage bzw. Bestätigung aus Ihrem Hause:`,
          `Angefordertes Dokument: „${doc}“\nAktenzeichen / Registriernummer: ${ref}`,
          `Ich bitte Sie höflich, mir eine entsprechende Zweitschrift bzw. amtliche Bescheinigung auszustellen und postalisch an meine oben angegebene Wohnanschrift zu übersenden.`,
          `Sollten für die Ausstellung Verwaltungskosten oder Gebühren anfallen, bitte ich um einen kurzen Gebührenbescheid bzw. eine Vorabinformation.`,
          `Ich bedanke mich herzlich im Voraus für Ihre Mühe und Bearbeitung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
];

