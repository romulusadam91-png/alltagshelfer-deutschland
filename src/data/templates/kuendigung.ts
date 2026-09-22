import { LetterTemplate } from '../../types';

export const kuendigungTemplates: LetterTemplate[] = [
  {
    id: 'kuendigung-fitness',
    categoryId: 'kuendigung',
    isPremium: false,
    title: {
      ro: 'Reziliere abonament sală de fitness',
      de: 'Kündigung Fitnessstudio-Vertrag',
    },
    shortDescription: {
      ro: 'Rezilierea contractului la sala de sport la termenul cel mai apropiat posibil.',
      de: 'Ordentliche Kündigung der Fitnessstudio-Mitgliedschaft zum nächstmöglichen Termin.',
    },
    bureaucraticTip: {
      ro: 'Atenție la termenul de preaviz (Kündigungsfrist) din contract, de regulă 1 sau 3 luni înainte de expirare. Cereți întotdeauna confirmare scrisă a datei de reziliere.',
      de: 'Beachten Sie die vertragliche Kündigungsfrist. Bitten Sie stets um eine schriftliche Bestätigung des Beendigungszeitpunktes.',
    },
    fields: [
      {
        id: 'memberNumber',
        label: {
          ro: 'Număr membru / client (Mitgliedsnummer)',
          de: 'Mitgliedsnummer',
        },
        placeholder: {
          ro: 'ex: M-982143',
          de: 'z.B. M-982143',
        },
        helpText: {
          ro: 'Se găsește pe cardul de sală, în contract sau pe extrasul de cont bancar la detaliile plății.',
          de: 'Zu finden auf Ihrer Mitgliedskarte, im Vertrag oder im Verwendungszweck der Abbuchung.',
        },
        type: 'text',
        required: true,
      },
      {
        id: 'terminationDate',
        label: {
          ro: 'Termenul de încetare a contractului (Kündigungstermin)',
          de: 'Kündigungszeitpunkt',
        },
        placeholder: {
          ro: 'zum nächstmöglichen Termin sau o dată specifică (ex: 31.12.2026)',
          de: 'zum nächstmöglichen Termin oder z.B. 31.12.2026',
        },
        defaultValue: 'zum nächstmöglichen Termin',
        helpText: {
          ro: 'Alegeți „zum nächstmöglichen Termin” (termenul legal cel mai rapid) sau introduceți o dată fixă.',
          de: 'Wählen Sie „zum nächstmöglichen Termin“ oder tragen Sie ein konkretes Datum ein.',
        },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const memberNo = (answers.memberNumber || '').trim();
      const rawTermination = (answers.terminationDate || '').trim();

      // Check if user selected or left default "zum nächstmöglichen Termin"
      const isEarliestPossible =
        !rawTermination ||
        rawTermination.toLowerCase().includes('nächstmöglichen') ||
        rawTermination.toLowerCase().includes('naechstmoeglichen') ||
        rawTermination.toLowerCase() === 'zum nächstmöglichen termin';

      let terminationDatePhrase = 'zum nächstmöglichen Termin';

      if (!isEarliestPossible) {
        // If an ISO date (YYYY-MM-DD) was entered
        const isoMatch = rawTermination.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoMatch) {
          const [, y, m, d] = isoMatch;
          terminationDatePhrase = `zum ${d}.${m}.${y}`;
        } else if (/^zum\s+/i.test(rawTermination)) {
          terminationDatePhrase = rawTermination;
        } else {
          terminationDatePhrase = `zum ${rawTermination}`;
        }
      }

      // Exact subject line required by prompt:
      // subject: "Kündigung meiner Mitgliedschaft – Mitgliedsnummer [number]"
      const subject = memberNo
        ? `Kündigung meiner Mitgliedschaft – Mitgliedsnummer ${memberNo}`
        : 'Kündigung meiner Mitgliedschaft';

      // First paragraph: clear termination request with exact wording
      const firstParagraph = isEarliestPossible
        ? 'hiermit kündige ich meine oben genannte Mitgliedschaft ordentlich und fristgerecht zum nächstmöglichen Termin.'
        : `hiermit kündige ich meine oben genannte Mitgliedschaft ordentlich und fristgerecht ${terminationDatePhrase}.`;

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          firstParagraph,
          'Ein Ihnen erteiltes SEPA-Lastschriftmandat bzw. eine Einzugsermächtigung zum Einzug der Mitgliedsbeiträge widerrufe ich hiermit ausdrücklich mit Wirkung zum Beendigungszeitpunkt der Mitgliedschaft. Bitte nehmen Sie nach dem Beendigungszeitpunkt keine weiteren Abbuchungen mehr von meinem Konto vor.',
          'Bitte senden Sie mir eine schriftliche Bestätigung über den Erhalt dieser Kündigung sowie über das verbindliche Datum des Vertragsendes an meine oben angegebene Anschrift zu.',
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kuendigung-versicherung',
    categoryId: 'kuendigung',
    isPremium: false,
    title: {
      ro: 'Reziliere poliță de asigurare (Răspundere civilă, Bunuri etc.)',
      de: 'Kündigung einer Versicherung (Haftpflicht, Hausrat etc.)',
    },
    shortDescription: {
      ro: 'Reziliere la scadență pentru asigurări private uzuale în Germania.',
      de: 'Ordentliche Kündigung einer privaten Versicherungspolice zum Laufzeitende.',
    },
    bureaucraticTip: {
      ro: 'Multe asigurări în Germania au data scadentă pe 31 decembrie, cu termen de reziliere de 3 luni (până pe 30 septembrie). Verificați polița.',
      de: 'Oft gilt der 31. Dezember als Stichtag mit einer 3-Monats-Frist (Kündigungseingang bis 30. September).',
    },
    fields: [
      {
        id: 'policyNumber',
        label: {
          ro: 'Număr poliță de asigurare (Versicherungsscheinnummer)',
          de: 'Versicherungsscheinnummer / Policennummer',
        },
        placeholder: {
          ro: 'ex: VS-4491829-01',
          de: 'z.B. VS-4491829-01',
        },
        type: 'text',
        required: true,
      },
      {
        id: 'insuranceType',
        label: {
          ro: 'Tipul asigurării',
          de: 'Versicherungsart',
        },
        type: 'select',
        options: [
          { value: 'Privathaftpflichtversicherung', label: { ro: 'Răspundere civilă privată (Haftpflicht)', de: 'Privathaftpflicht' } },
          { value: 'Hausratversicherung', label: { ro: 'Bunuri din locuință (Hausrat)', de: 'Hausratversicherung' } },
          { value: 'Rechtsschutzversicherung', label: { ro: 'Protecție juridică (Rechtsschutz)', de: 'Rechtsschutz' } },
          { value: 'Unfallversicherung', label: { ro: 'Accidente (Unfall)', de: 'Unfallversicherung' } },
          { value: 'KFZ-Versicherung', label: { ro: 'Auto (KFZ)', de: 'KFZ-Versicherung' } },
        ],
        defaultValue: 'Privathaftpflichtversicherung',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const polNo = answers.policyNumber || 'N/A';
      const insType = answers.insuranceType || 'Versicherung';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Frankfurt',
        subject: `Kündigung der ${insType} – Versicherungsscheinnummer: ${polNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit kündige ich den oben genannten Versicherungsvertrag fristgerecht zum nächstmöglichen Termin, hilfsweise zum Ablauf des aktuellen Versicherungsjahres.`,
          `Mit Beendigung des Versicherungsverhältnisses erlischt zugleich das bestehende SEPA-Lastschriftmandat für die Beitragsabbuchung.`,
          `Bitte senden Sie mir eine schriftliche Bestätigung dieser Kündigung unter Angabe des verbindlichen Beendigungsdatums an meine oben angegebene Anschrift zu.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kuendigung-sonder-preiserhoehung',
    categoryId: 'kuendigung',
    isPremium: true,
    title: {
      ro: 'Reziliere extraordinară din cauza scumpirii prețului (Sonderkündigung)',
      de: 'Sonderkündigung wegen Preiserhöhung',
    },
    shortDescription: {
      ro: 'Drept special de reziliere când furnizorul sau sala crește prețul fără acordul tău.',
      de: 'Außerordentliche Kündigung aufgrund einer einseitigen Preisanpassung.',
    },
    bureaucraticTip: {
      ro: 'Trebuie trimisă în termen de maxim 1 lună de la primirea notificării de scumpire. Menționați expres data când ați fost înștiințat.',
      de: 'Die Sonderkündigung muss in der Regel innerhalb eines Monats nach Zugang der Preiserhöhungsmitteilung erfolgen.',
    },
    fields: [
      {
        id: 'contractNumber',
        label: { ro: 'Număr contract / client', de: 'Vertragsnummer / Kundennummer' },
        placeholder: { ro: 'ex: KD-55102', de: 'z.B. KD-55102' },
        type: 'text',
        required: true,
      },
      {
        id: 'noticeDate',
        label: { ro: 'Data la care ai primit notificarea de scumpire', de: 'Datum der Preiserhöhungsmitteilung' },
        type: 'date',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cNo = answers.contractNumber || 'N/A';
      const nDate = answers.noticeDate || 'kürzlich';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `Außerordentliche Sonderkündigung wegen Preiserhöhung – Vertragsnummer: ${cNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `mit Schreiben vom ${nDate} haben Sie mir eine einseitige Erhöhung der monatlichen Gebühren für den Vertrag ${cNo} mitgeteilt.`,
          `Dieser Preiserhöhung widerspreche ich hiermit ausdrücklich. Gleichzeitig mache ich von meinem gesetzlichen bzw. vertraglichen Sonderkündigungsrecht Gebrauch und kündige das Vertragsverhältnis fristlos mit sofortiger Wirkung, hilfsweise zum Zeitpunkt des Inkrafttretens der angekündigten Preiserhöhung.`,
          `Die erteilte Einzugsermächtigung bzw. das SEPA-Lastschriftmandat widerrufe ich hiermit unwiderruflich. Bitte bestätigen Sie mir den Eingang dieses Schreibens sowie das Beendigungsdatum schriftlich innerhalb von 14 Tagen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kuendigung-abo-zeitung-streaming',
    categoryId: 'kuendigung',
    isPremium: false,
    title: {
      ro: 'Reziliere abonament ziar, revistă sau streaming (§ 309 Nr. 9 BGB)',
      de: 'Kündigung eines Zeitungs-, Streaming- oder Software-Abonnements',
    },
    shortDescription: {
      ro: 'Conform noii legi a contractelor echitabile, după perioada inițială poți rezilia lunar!',
      de: 'Fristgerechte Kündigung laufender Abonnements mit monatlicher Kündigungsfrist nach Ablauf der Erstlaufzeit.',
    },
    bureaucraticTip: {
      ro: 'În Germania, legea „Faire Verbraucherverträge” interzice prelungirea automată pe un an! După perioada minimă, orice abonament poate fi reziliat cu un preaviz de doar 1 lună.',
      de: 'Nach § 309 Nr. 9 BGB verlängern sich Verbraucherverträge nach der Erstlaufzeit nur noch auf unbestimmte Zeit mit einmonatiger Kündigungsfrist.',
    },
    fields: [
      {
        id: 'aboName',
        label: { ro: 'Denumirea abonamentului / publicației sau serviciului', de: 'Bezeichnung des Abonnements' },
        placeholder: { ro: 'ex: Zeitschrift Focus / Streaming-Paket / Software-Lizenz', de: 'z.B. Zeitschrift / Online-Dienst' },
        type: 'text',
        required: true,
      },
      {
        id: 'customerOrAboNo',
        label: { ro: 'Număr abonat / client', de: 'Abonnenten- / Kundennummer' },
        placeholder: { ro: 'ex: ABO-123456', de: 'z.B. 123456' },
        type: 'text',
        required: true,
      },
      {
        id: 'effectiveDate',
        label: { ro: 'Data dorită pentru încetare (sau la primul termen)', de: 'Kündigungstermin' },
        type: 'date',
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const abo = answers.aboName || 'das Abonnement';
      const aNo = answers.customerOrAboNo || 'N/A';
      const eDate = answers.effectiveDate || 'zum nächstmöglichen Zeitpunkt';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `Kündigung meines Abonnements: ${abo} – Abo-Nr.: ${aNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit kündige ich mein Abonnement für „${abo}“ zur Kundennummer ${aNo} fristgerecht zum ${eDate}, hilfsweise zum nächstmöglichen Termin.`,
          `Ich mache Sie vorsorglich auf die gesetzliche Regelung gemäß § 309 Nr. 9 BGB aufmerksam, wonach das Abonnement nach Ablauf der ursprünglichen Erstvertragslaufzeit jederzeit mit einer Frist von höchstens einem Monat gekündigt werden kann.`,
          `Eine Ihnen erteilte Einzugsermächtigung bzw. das SEPA-Lastschriftmandat widerrufe ich mit Wirksamwerden der Kündigung.`,
          `Bitte senden Sie mir eine schriftliche Bestätigung über den Eingang dieser Kündigung sowie das genaue Vertragsende zu.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'kuendigung-mitgliedschaft-adac-verein',
    categoryId: 'kuendigung',
    isPremium: false,
    title: {
      ro: 'Reziliere membru club, ADAC sau asociație (Mitgliedschaft kündigen)',
      de: 'Kündigung der Mitgliedschaft (ADAC, Verein, Club)',
    },
    shortDescription: {
      ro: 'Pentru asistență rutieră, asociații sportive sau alte calități de membru cotizant.',
      de: 'Fristgerechte Beendigung einer Vereins- oder Verbandsmitgliedschaft zum Ende des Beitragsjahres.',
    },
    bureaucraticTip: {
      ro: 'Multe asociații (inclusiv ADAC) au termene de preaviz de 3 luni înainte de sfârșitul anului calendaristic sau anului de cotizație. Trimiteți scrisoarea din timp!',
      de: 'Beachten Sie die satzungsgemäße Kündigungsfrist (häufig 3 Monate zum Jahresende).',
    },
    fields: [
      {
        id: 'organizationName',
        label: { ro: 'Numele asociației / clubului (ex: ADAC e.V., Sportverein)', de: 'Name des Vereins / Clubs' },
        placeholder: { ro: 'ex: ADAC e.V. / Turnverein 1890', de: 'z.B. ADAC e.V.' },
        defaultValue: 'ADAC e.V.',
        type: 'text',
        required: true,
      },
      {
        id: 'memberNumber',
        label: { ro: 'Numărul de membru (Mitgliedsnummer)', de: 'Mitgliedsnummer' },
        placeholder: { ro: 'ex: 123 456 789', de: 'z.B. 123456789' },
        type: 'text',
        required: true,
      },
      {
        id: 'terminationDate',
        label: { ro: 'Data de la care doriți încetarea (sau la sfârșitul anului curent)', de: 'Kündigungstermin' },
        type: 'date',
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const org = answers.organizationName || 'den Verein / Club';
      const mNo = answers.memberNumber || 'N/A';
      const tDate = answers.terminationDate || 'zum Ende des laufenden Beitragsjahres';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'München',
        subject: `Kündigung meiner Mitgliedschaft bei ${org} – Mitglieds-Nr.: ${mNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit kündige ich meine Mitgliedschaft bei ${org} zur Mitgliedsnummer ${mNo} fristgerecht zum ${tDate}, hilfsweise zum nächstmöglichen Termin.`,
          `Mit Wirksamwerden der Kündigung erlischt zugleich das Ihnen erteilte SEPA-Lastschriftmandat für den Einzug künftiger Mitgliedsbeiträge.`,
          `Ich bedanke mich für die bisherige Betreuung und bitte Sie höflich, mir den Eingang dieses Kündigungsschreibens sowie das Beendigungsdatum meiner Mitgliedschaft schriftlich zu bestätigen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
];
