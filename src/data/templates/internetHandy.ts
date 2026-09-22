import { LetterTemplate } from '../../types';

export const internetHandyTemplates: LetterTemplate[] = [
  {
    id: 'tkg-kuendigung-regulaer',
    categoryId: 'internet_handy',
    isPremium: false,
    title: {
      ro: 'Reziliere standard abonament Internet / Telefonie mobilă',
      de: 'Ordentliche Kündigung des Internet- oder Mobilfunkvertrags',
    },
    shortDescription: {
      ro: 'Pentru Vodafone, Telekom, O2, 1&1 la termenul prevăzut în contract.',
      de: 'Fristgerechte Beendigung des Festnetz-, DSL- oder Handyvertrags zum Laufzeitende.',
    },
    bureaucraticTip: {
      ro: 'Noua lege a telecomunicațiilor din Germania (TKG): după expirarea perioadei inițiale minime (de ex. 24 de luni), orice contract poate fi reziliat lunar cu preaviz de doar o lună!',
      de: 'Nach Ablauf der Mindestvertragslaufzeit (meist 24 Monate) sind Verträge nach neuem TKG monatlich kündbar.',
    },
    fields: [
      {
        id: 'contractNumber',
        label: { ro: 'Număr contract (Vertragsnummer)', de: 'Vertragsnummer' },
        placeholder: { ro: 'ex: DE-90412891', de: 'z.B. DE-90412891' },
        type: 'text',
        required: true,
      },
      {
        id: 'customerNumber',
        label: { ro: 'Număr client (Kundennummer)', de: 'Kundennummer' },
        placeholder: { ro: 'ex: KD-771204', de: 'z.B. KD-771204' },
        type: 'text',
        required: true,
      },
      {
        id: 'phoneNumber',
        label: { ro: 'Numărul de telefon asociat (opțional)', de: 'Rufnummer (optional)' },
        placeholder: { ro: 'ex: 0176 12345678', de: 'z.B. 0176 12345678' },
        type: 'text',
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cNo = answers.contractNumber || 'N/A';
      const kdNo = answers.customerNumber || 'N/A';
      const phone = answers.phoneNumber ? ` / Rufnummer: ${answers.phoneNumber}` : '';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Bonn',
        subject: `Kündigung meines Vertrages – Vertragsnr.: ${cNo} | Kundennr.: ${kdNo}${phone}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit kündige ich den oben genannten Vertrag fristgerecht zum nächstmöglichen Zeitpunkt.`,
          `Ein eventuell bestehendes SEPA-Lastschriftmandat widerrufe ich mit Wirksamkeit zum Beendigungszeitpunkt.`,
          `Ich widerspreche hiermit ausdrücklich einer weiteren telefonischen oder schriftlichen Kontaktaufnahme zwecks Rückwerbung oder Angeboten zur Vertragsverlängerung gemäß DSGVO.`,
          `Bitte senden Sie mir eine schriftliche Kündigungsbestätigung mit verbindlicher Angabe des Beendigungsdatums innerhalb von 14 Tagen an meine oben angegebene Adresse.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'tkg-sonderkuendigung-umzug',
    categoryId: 'internet_handy',
    isPremium: false,
    title: {
      ro: 'Reziliere specială la mutare / plecare în România (§ 60 TKG)',
      de: 'Sonderkündigung wegen Umzugs (§ 60 TKG) oder Auslandsfortzugs',
    },
    shortDescription: {
      ro: 'Dacă furnizorul nu poate asigura aceeași viteză la noua adresă sau te muți definitiv din Germania.',
      de: 'Außerordentliche Kündigung mit 1 Monat Frist, wenn Leistung am neuen Wohnsitz nicht erbracht werden kann.',
    },
    bureaucraticTip: {
      ro: 'Conform § 60 TKG, aveți dreptul la reziliere cu 1 lună preaviz dacă vă mutați în străinătate sau furnizorul nu oferă serviciul la noua adresă. Atașați Abmeldebestätigung sau noul contract de chirie!',
      de: 'Fügen Sie als Nachweis die amtliche Abmeldebestätigung (Bürgeramt) oder den Mietvertrag der neuen Wohnung bei.',
    },
    fields: [
      {
        id: 'contractNumber',
        label: { ro: 'Număr contract / Număr client', de: 'Vertragsnummer / Kundennummer' },
        placeholder: { ro: 'ex: VT-882109', de: 'z.B. VT-882109' },
        type: 'text',
        required: true,
      },
      {
        id: 'moveDate',
        label: { ro: 'Data mutării (Umzugsdatum)', de: 'Datum des Umzugs' },
        type: 'date',
        required: true,
      },
      {
        id: 'moveReason',
        label: { ro: 'Motivul mutării', de: 'Grund des Umzugs' },
        type: 'select',
        options: [
          { value: 'ausland', label: { ro: 'Mutare definitivă în România / străinătate', de: 'Verzug ins Ausland (Rumänien)' } },
          { value: 'kein_empfang', label: { ro: 'Furnizorul nu are acoperire la noua adresă din Germania', de: 'Leistung an neuer Anschrift nicht verfügbar' } },
        ],
        defaultValue: 'ausland',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cNo = answers.contractNumber || 'N/A';
      const mDate = answers.moveDate || 'in Kürze';
      const isAusland = answers.moveReason === 'ausland';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Düsseldorf',
        subject: `Außerordentliche Kündigung gemäß § 60 TKG wegen Umzugs – Vertragsnr.: ${cNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit kündige ich meinen oben genannten Telekommunikationsvertrag außerordentlich unter Berufung auf § 60 Telekommunikationsgesetz (TKG) mit einer Frist von einem Monat zum ${mDate}, hilfsweise zum nächstmöglichen Termin.`,
          isAusland
            ? `Grund hierfür ist mein dauerhafter Umzug ins Ausland (Rumänien), an dem die vertraglich vereinbarte Leistung naturgemäß nicht von Ihnen erbracht werden kann. Eine amtliche Abmeldebescheinigung ist diesem Schreiben in Kopie beigefügt.`
            : `Grund hierfür ist mein Umzug an eine neue Anschrift in Deutschland, an welcher die bisher vertraglich vereinbarte Leistung bzw. Bandbreite von Ihnen nachweislich nicht erbracht werden kann.`,
          `Ich widerrufe zugleich das erteilte SEPA-Lastschriftmandat zum genannten Kündigungszeitpunkt.`,
          `Bitte senden Sie mir eine schriftliche Bestätigung des Kündigungseingangs sowie der Vertragsbeendigung zu.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
        enclosures: isAusland ? ['Amtliche Abmeldebestätigung des Einwohnermeldeamtes'] : ['Nachweis über neue Anschrift'],
      };
    },
  },
  {
    id: 'tkg-stoerungsmeldung',
    categoryId: 'internet_handy',
    isPremium: true,
    title: {
      ro: 'Sesizare avarie internet și termen de remediere (Störungsmeldung & Minderung)',
      de: 'Störungsmeldung mit Fristsetzung zur Entstörung (§ 58 TKG)',
    },
    shortDescription: {
      ro: 'Când internetul pică repetat sau viteza este mult sub cea contractată, cu cerere de despăgubire.',
      de: 'Fristsetzung zur Behebung von Ausfällen und Ankündigung von Minderungs- und Schadensersatzansprüchen.',
    },
    bureaucraticTip: {
      ro: 'Faceți măsurători oficiale cu aplicația gratuită a autorității germane Breitbandmessung (Bundesnetzagentur). Dacă viteza este sub nivelul garantat, puteți cere reducerea facturii sau rezilierea imediată!',
      de: 'Nutzen Sie die offizielle Breitbandmessung-App der Bundesnetzagentur zur Dokumentation.',
    },
    fields: [
      {
        id: 'contractNumber',
        label: { ro: 'Număr contract și client', de: 'Vertrags- und Kundennummer' },
        placeholder: { ro: 'ex: DSL-559123', de: 'z.B. DSL-559123' },
        type: 'text',
        required: true,
      },
      {
        id: 'outageSince',
        label: { ro: 'Avaria persistă din data de', de: 'Störung besteht seit' },
        type: 'date',
        required: true,
      },
      {
        id: 'outageDescription',
        label: { ro: 'Descrierea defecțiunii (ex: viteza scăzută, întrerupere totală semnal DSL)', de: 'Art der Störung' },
        placeholder: { ro: 'ex: Vollständiger Ausfall der DSL-Internetverbindung und Telefonie', de: 'z.B. Totalausfall Internet' },
        type: 'textarea',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cNo = answers.contractNumber || 'N/A';
      const oDate = answers.outageSince || 'mehreren Tagen';
      const oDesc = answers.outageDescription || 'vollständige Störung des Anschlusses';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Leipzig',
        subject: `Störungsmeldung und Fristsetzung zur Entstörung gemäß § 58 TKG – Vertragsnr.: ${cNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `seit dem ${oDate} liegt an meinem Anschluss eine erhebliche Störung vor:`,
          `„${oDesc}“`,
          `Telefonische Meldungen bei Ihrem Kundenservice führten bislang leider zu keiner nachhaltigen Entstörung. Gemäß § 58 TKG sind Sie verpflichtet, Störungen unverzüglich und unentgeltlich zu beseitigen.`,
          `Ich setze Ihnen hiermit eine verbindliche Frist zur vollständigen Behebung der Störung bis spätestens binnen 7 Tagen nach Zugang dieses Schreibens.`,
          `Sollte die Störung bis zum Ablauf der Frist nicht behoben sein, behalte ich mir vor, die monatlichen Grundgebühren anteilig zu mindern sowie den Vertrag nach § 58 Abs. 3 TKG bzw. § 314 BGB fristlos aus wichtigem Grund zu kündigen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'tkg-rufnummernmitnahme-portierung',
    categoryId: 'internet_handy',
    isPremium: false,
    title: {
      ro: 'Reziliere contract mobil cu păstrarea numărului de telefon (Portierung § 68 TKG)',
      de: 'Kündigung mit Freigabe zur Rufnummernmitnahme (Portierungsauftrag)',
    },
    shortDescription: {
      ro: 'Pentru trecerea numărului existent la un nou operator (gratuit prin lege conform TKG).',
      de: 'Rechtssichere Kündigung und Freigabe der Rufnummer (Opt-in) zur Mitnahme zum neuen Provider.',
    },
    bureaucraticTip: {
      ro: 'Conform reformei TKG, portarea numărului de telefon în Germania este complet GRATUITĂ! Furnizorul vechi nu mai are voie să vă taxeze niciun cent.',
      de: 'Gemäß § 68 TKG ist die Mitnahme der Mobilfunknummer für den Verbraucher völlig kostenlos.',
    },
    fields: [
      {
        id: 'contractNumber',
        label: { ro: 'Număr contract sau client', de: 'Kundennummer / Vertragsnummer' },
        placeholder: { ro: 'ex: MOB-9941032', de: 'z.B. KD-88123' },
        type: 'text',
        required: true,
      },
      {
        id: 'phoneNumber',
        label: { ro: 'Numărul de telefon mobil care trebuie portat', de: 'Zu portierende Mobilfunknummer' },
        placeholder: { ro: 'ex: 0176 12345678', de: 'z.B. 0176 12345678' },
        type: 'text',
        required: true,
      },
      {
        id: 'portingType',
        label: { ro: 'Când doriți portarea numărului?', de: 'Zeitpunkt der Portierung' },
        type: 'select',
        options: [
          { value: 'vertragsende', label: { ro: 'La data încheierii contractului (zum Vertragsende)', de: 'Zum regulären Vertragsende' } },
          { value: 'sofort', label: { ro: 'Imediat / înainte de termen (vorzeitige Portierung / Opt-in)', de: 'Vorzeitig (sofortiges Opt-in)' } },
        ],
        defaultValue: 'vertragsende',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cNo = answers.contractNumber || 'N/A';
      const phone = answers.phoneNumber || 'meine Mobilfunknummer';
      const isImmediate = answers.portingType === 'sofort';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Nürnberg',
        subject: `Kündigung meines Mobilfunkvertrags und Freigabe zur Rufnummernmitnahme – Rufnummer: ${phone}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit kündige ich meinen Mobilfunkvertrag zur Kundennummer ${cNo} bzw. Rufnummer ${phone} fristgerecht zum nächstmöglichen Termin.`,
          isImmediate
            ? `Ich beabsichtige, meine Mobilfunknummer ${phone} vorzeitig zu einem neuen Anbieter mitzunehmen. Ich bitte Sie daher, unverzüglich das sogenannte „Opt-in“ für die vorzeitige Portierung gemäß § 68 TKG zu setzen und mir die Freigabe per SMS oder E-Mail zu bestätigen.`
            : `Ich beabsichtige, meine Mobilfunknummer ${phone} zum Vertragsende zu einem neuen Anbieter mitzunehmen. Bitte geben Sie die Rufnummer zur Mitnahme frei.`,
          `Gemäß § 68 Abs. 3 TKG erfolgt die Rufnummernübertragung für mich als Verbraucher unentgeltlich. Ein SEPA-Lastschriftmandat für Zahlungen nach Vertragsende widerrufe ich hiermit vorsorglich.`,
          `Bitte senden Sie mir eine schriftliche Bestätigung der Kündigung sowie der Freigabe zur Rufnummernmitnahme unter Angabe des Kündigungsdatums zu.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'tkg-drittanbietersperre-erstattung',
    categoryId: 'internet_handy',
    isPremium: false,
    title: {
      ro: 'Blocare servicii cu suprataxă și restituire costuri (Drittanbietersperre § 61 TKG)',
      de: 'Einrichtung einer Drittanbietersperre und Rückforderung von Drittanbieterkosten',
    },
    shortDescription: {
      ro: 'Pentru abonamente ascunse apărute pe factura de telefon mobil și activarea blocării terților.',
      de: 'Widerspruch gegen unberechtigte Entgelte Dritter auf der Mobilfunkrechnung gemäß § 61 TKG.',
    },
    bureaucraticTip: {
      ro: 'Operatorii sunt obligați prin lege (§ 61 TKG) să activeze gratuit „Drittanbietersperre” la simpla cerere, protejându-vă de abonamente capcană!',
      de: 'Die Drittanbietersperre ist gesetzlich kostenfrei. Ohne Nachweis eines wirksamen Vertragsschlusses müssen unberechtigte Beträge erstattet werden.',
    },
    fields: [
      {
        id: 'customerNumber',
        label: { ro: 'Număr client / număr telefon mobil', de: 'Kundennummer / Mobilfunknummer' },
        placeholder: { ro: 'ex: 0172 9876543 / KD-44912', de: 'z.B. 0172 ...' },
        type: 'text',
        required: true,
      },
      {
        id: 'disputedAmount',
        label: { ro: 'Suma contestată de pe factură (€) și denumirea serviciului', de: 'Beanstandeter Betrag (€) und Anbieter' },
        placeholder: { ro: 'ex: 29,99 € für „Mobile Info Abo / Game Service“', de: 'z.B. 19,99 € Abo-Dienst' },
        type: 'text',
        required: true,
      },
      {
        id: 'invoiceDate',
        label: { ro: 'Data facturii pe care au apărut costurile', de: 'Datum der Mobilfunkrechnung' },
        type: 'date',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cNo = answers.customerNumber || 'N/A';
      const amt = answers.disputedAmount || 'die aufgeführten Drittanbieterposten';
      const invDate = answers.invoiceDate || 'der aktuellen Rechnung';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Düsseldorf',
        subject: `Widerspruch gegen Drittanbieterkosten und Einrichtung einer Drittanbietersperre – Knd.-Nr.: ${cNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `mit großem Befremden habe ich auf meiner Mobilfunkrechnung vom ${invDate} folgende Fremdkosten festgestellt:`,
          `„${amt}“`,
          `Ich habe zu keinem Zeitpunkt wissentlich einen kostenpflichtigen Vertrag mit diesem Drittanbieter abgeschlossen. Ich bestreite das Zustandekommen eines wirksamen Vertrages und widerspreche der Abrechnung dieser Positionen hiermit ausdrücklich.`,
          `Ich fordere Sie auf, den abgebuchten Betrag unverzüglich meinem Kundenkonto gutzuschreiben bzw. auf mein Girokonto zurückzuerstatten.`,
          `Zudem verlange ich gemäß § 61 TKG die sofortige und vollständige Einrichtung einer kostenfreien Drittanbietersperre (für alle Kategorien / Mehrwertdienste) für meinen Mobilfunkanschluss.`,
          `Bitte bestätigen Sie mir die Aktivierung der Drittanbietersperre sowie die Gutschrift schriftlich.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'tkg-adressaenderung-umzug',
    categoryId: 'internet_handy',
    isPremium: false,
    title: {
      ro: 'Notificare schimbare de adresă și transfer conexiune (Umzugsservice § 60 TKG)',
      de: 'Mitteilung über Umzug und Weiterführung des Anschlusses (§ 60 TKG)',
    },
    shortDescription: {
      ro: 'Pentru mutarea contractului de internet fix / DSL / fibră sau a facturării la noua adresă.',
      de: 'Formelle Umzugsmeldung an den Anbieter mit Bitte um nahtlose Weiterschaltung des Anschlusses.',
    },
    bureaucraticTip: {
      ro: 'Conform § 60 TKG, furnizorul este obligat să vă asigure serviciul la noua adresă fără a prelungi durata inițială a contractului! Dacă nu poate asigura aceeași viteză, aveți dreptul la reziliere cu preaviz de 1 lună.',
      de: 'Durch einen Umzug darf sich die Vertragslaufzeit nach dem neuen TKG nicht automatisch verlängern.',
    },
    fields: [
      {
        id: 'contractNumber',
        label: { ro: 'Număr contract și client', de: 'Vertrags- und Kundennummer' },
        placeholder: { ro: 'ex: VT-109284 / KD-99120', de: 'z.B. VT-109284' },
        type: 'text',
        required: true,
      },
      {
        id: 'movingDate',
        label: { ro: 'Data mutării la noua locuință', de: 'Datum des Umzugs' },
        type: 'date',
        required: true,
      },
      {
        id: 'newAddress',
        label: { ro: 'Noua adresă completă (inclusiv etaj/apartament)', de: 'Neue Anschlussadresse (inkl. Lage/Stockwerk)' },
        placeholder: { ro: 'ex: Musterstraße 45, 10115 Berlin, 3. OG', de: 'z.B. Musterstraße 45, 10115 Berlin' },
        type: 'text',
        required: true,
      },
      {
        id: 'previousTenant',
        label: { ro: 'Numele fostului locatar / chiriaș (Vormieter - opțional, grăbește conectarea)', de: 'Name des Vormieters (optional)' },
        placeholder: { ro: 'ex: Max Müller (falls bekannt)', de: 'z.B. Max Müller' },
        type: 'text',
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cNo = answers.contractNumber || 'N/A';
      const mDate = answers.movingDate || 'demnächst';
      const newAddr = answers.newAddress || `${sender.street}, ${sender.postalCode} ${sender.city}`;
      const vm = answers.previousTenant ? `\nName des Vormieters: ${answers.previousTenant}` : '';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Berlin',
        subject: `Umzugsmeldung und Weiterführung des Telekommunikationsvertrags – Vertragsnr.: ${cNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `hiermit zeige ich Ihnen meinen bevorstehenden Wohnsitzwechsel zum ${mDate} an.`,
          `Ich bitte Sie, meinen oben genannten Vertrag (Vertragsnummer: ${cNo}) gemäß § 60 TKG nahtlos an der neuen Anschrift fortzuführen:`,
          `Neue Anschlussadresse:\n${newAddr}${vm}`,
          `Gemäß § 60 Abs. 1 TKG ist der Anbieter verpflichtet, die vertraglich geschuldete Leistung am neuen Wohnsitz ohne Änderung der vereinbarten Vertragslaufzeit und der sonstigen Vertragsinhalte zu erbringen.`,
          `Sollte die vertraglich vereinbarte Leistung bzw. Bandbreite an der neuen Anschrift nachweislich nicht erbracht werden können, mache ich hiermit hilfsweise von meinem gesetzlichen Sonderkündigungsrecht mit einmonatiger Frist Gebrauch.`,
          `Bitte teilen Sie mir zeitnah den Termin für die Umschaltung bzw. den Bereitstellungstermin durch einen Techniker schriftlich mit.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'tkg-tarifwechsel-anfrage',
    categoryId: 'internet_handy',
    isPremium: false,
    title: {
      ro: 'Cerere de schimbare / optimizare abonament (Tarifwechsel)',
      de: 'Antrag auf Tarifwechsel / Vertragsanpassung',
    },
    shortDescription: {
      ro: 'Trecerea la un abonament mai ieftin, cu viteză mai mare sau adaptat la nevoile actuale.',
      de: 'Anfrage nach Umstellung auf einen günstigeren oder leistungsstärkeren Tarif ohne Nachteile.',
    },
    bureaucraticTip: {
      ro: 'Verificați mereu dacă schimbarea de tarif prelungește perioada contractuală cu 24 de luni. Conform legii, furnizorul trebuie să vă trimită în prealabil o sinteză clară a contractului (Vertragszusammenfassung gemäß § 54 TKG)!',
      de: 'Der Anbieter ist nach § 54 TKG gesetzlich verpflichtet, vor Vertragsabschluss eine standardisierte Vertragszusammenfassung bereitzustellen.',
    },
    fields: [
      {
        id: 'contractNumber',
        label: { ro: 'Număr contract / client', de: 'Vertragsnummer / Kundennummer' },
        placeholder: { ro: 'ex: KND-77120 / VTR-8812', de: 'z.B. KD-88123' },
        type: 'text',
        required: true,
      },
      {
        id: 'currentTariff',
        label: { ro: 'Abonamentul actual', de: 'Aktueller Tarif' },
        placeholder: { ro: 'ex: Red Internet & Phone 250 Cable (44,99 €/Monat)', de: 'z.B. DSL 100' },
        type: 'text',
        required: true,
      },
      {
        id: 'desiredTariff',
        label: { ro: 'Tariful dorit sau modificarea dorită (ex: viteză mai mare, reducere cost)', de: 'Gewünschter Zieltarif / Anpassung' },
        placeholder: { ro: 'ex: GigaZuhause 100 zum Dauertiefpreis von max. 29,99 €/Monat', de: 'z.B. Wechsel in günstigeren Tarif' },
        type: 'text',
        required: true,
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cNo = answers.contractNumber || 'N/A';
      const cur = answers.currentTariff || 'mein bestehender Tarif';
      const des = answers.desiredTariff || 'ein günstigerer Tarif';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Köln',
        subject: `Antrag auf Tarifwechsel für Kundennummer / Vertragsnummer: ${cNo}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `ich nutze derzeit unter der oben genannten Vertragsnummer den Tarif „${cur}“.`,
          `Ich beabsichtige, meinen laufenden Vertrag umzustellen und beantrage hiermit den Wechsel in folgenden Zieltarif bzw. zu folgenden Konditionen:`,
          `Angestrebter Tarif: ${des}`,
          `Ich bitte Sie höflich, mir ein entsprechendes Angebot nebst der gesetzlich vorgeschriebenen Vertragszusammenfassung gemäß § 54 TKG schriftlich oder per E-Mail zu unterbreiten.`,
          `Sollte ein Wechsel zu den gewünschten Konditionen im bestehenden Vertragsverhältnis nicht möglich sein, behalte ich mir vor, den Vertrag zum nächstmöglichen Termin ordentlich zu kündigen.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
  {
    id: 'tkg-bestaetigung-anfordern',
    categoryId: 'internet_handy',
    isPremium: false,
    title: {
      ro: 'Solicitare confirmare scrisă a rezilierii / a contractului (Bestätigung)',
      de: 'Anforderung einer schriftlichen Vertrags- oder Kündigungsbestätigung',
    },
    shortDescription: {
      ro: 'Când operatorul nu a trimis confirmarea scrisă a rezilierii sau a datei de finalizare a abonamentului.',
      de: 'Ausdrückliche Fristsetzung zur Übersendung der rechtsverbindlichen Kündigungsbestätigung.',
    },
    bureaucraticTip: {
      ro: 'Operatorii au obligația legală să confirme în scris data exactă de încheiere a contractului. Păstrați confirmarea pentru a evita prelungiri automate sau taxe nejustificate.',
      de: 'Verlangen Sie immer die Nennung des kalendermäßigen Beendigungsdatums zur rechtlichen Absicherung.',
    },
    fields: [
      {
        id: 'contractNumber',
        label: { ro: 'Număr contract sau client', de: 'Vertragsnummer / Kundennummer' },
        placeholder: { ro: 'ex: VT-551029', de: 'z.B. VT-551029' },
        type: 'text',
        required: true,
      },
      {
        id: 'cancellationDate',
        label: { ro: 'Data la care ați trimis rezilierea inițială', de: 'Datum der erklärten Kündigung' },
        type: 'date',
        required: true,
      },
      {
        id: 'phoneNumberOrLine',
        label: { ro: 'Numărul de telefon sau identificatorul liniei (opțional)', de: 'Rufnummer / Leitungs-ID (optional)' },
        placeholder: { ro: 'ex: 0176 99887766 sau Festnetz', de: 'z.B. 0176 ...' },
        type: 'text',
      },
    ],
    buildLetter: (answers, sender, recipient) => {
      const cNo = answers.contractNumber || 'N/A';
      const cDate = answers.cancellationDate || 'vor Kurzem';
      const phone = answers.phoneNumberOrLine ? ` / Kennung: ${answers.phoneNumberOrLine}` : '';

      return {
        sender,
        recipient,
        date: new Date().toLocaleDateString('de-DE'),
        place: sender.city || 'Dortmund',
        subject: `Anforderung einer schriftlichen Kündigungsbestätigung – Vertragsnr.: ${cNo}${phone}`,
        salutation: 'Sehr geehrte Damen und Herren,',
        paragraphs: [
          `mit Schreiben bzw. Erklärung vom ${cDate} habe ich meinen bei Ihnen geführten Vertrag fristgerecht zum nächstmöglichen Zeitpunkt gekündigt.`,
          `Bislang ist mir trotz des wirksamen Zugangs der Kündigung noch keine schriftliche Bestätigung über das genaue Vertragsbeendigungsdatum zugegangen.`,
          `Ich fordere Sie hiermit höflich auf, mir bis spätestens binnen 14 Tagen eine rechtsverbindliche Kündigungsbestätigung mit konkreter Angabe des Kalendertages der Vertragsbeendigung postalisch an meine oben angegebene Anschrift zu übersenden.`,
          `Gleichzeitig erinnere ich an das Erlöschen des SEPA-Lastschriftmandats mit dem Zeitpunkt der Vertragsbeendigung.`,
        ],
        closing: 'Mit freundlichen Grüßen',
        signName: sender.fullName,
      };
    },
  },
];

