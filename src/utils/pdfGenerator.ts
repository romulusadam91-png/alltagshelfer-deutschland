import jsPDF from 'jspdf';
import { GeneratedDocument } from '../types';

export function generateLetterPDF(docData: GeneratedDocument, isPremium: boolean = false): void {
  // DIN A4: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const marginLeft = 25; // DIN 5008 standard left margin (25mm)
  const marginRight = 20;
  const contentWidth = 210 - marginLeft - marginRight;
  let currentY = 20;

  // 1. Sender one-line return address (Absenderzeile für Fensterbriefumschlag)
  const returnAddressLine = [
    docData.sender.fullName,
    docData.sender.street,
    `${docData.sender.postalCode || ''} ${docData.sender.city || ''}`.trim(),
  ]
    .filter(Boolean)
    .join(' · ');

  if (returnAddressLine) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(returnAddressLine, marginLeft, currentY);

    // Line separator under return address
    currentY += 2;
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.setLineWidth(0.2);
    doc.line(marginLeft, currentY, marginLeft + 90, currentY);
  }

  // 2. Recipient field (Empfängeranschrift)
  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // Slate-900

  if (docData.recipient.organization) {
    doc.text(docData.recipient.organization, marginLeft, currentY);
    currentY += 5;
  }
  if (docData.recipient.department) {
    doc.text(docData.recipient.department, marginLeft, currentY);
    currentY += 5;
  }
  if (docData.recipient.contactPerson) {
    doc.text(docData.recipient.contactPerson, marginLeft, currentY);
    currentY += 5;
  }
  if (docData.recipient.street) {
    doc.text(docData.recipient.street, marginLeft, currentY);
    currentY += 5;
  }
  const recipientCityLine = `${docData.recipient.postalCode || ''} ${docData.recipient.city || ''}`.trim();
  if (recipientCityLine) {
    doc.text(recipientCityLine, marginLeft, currentY);
    currentY += 5;
  }

  // 3. Sender contact info block (top right in DIN 5008)
  let rightBlockY = 20;
  const rightX = 135;
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  if (docData.sender.fullName) {
    doc.setFont('helvetica', 'bold');
    doc.text(docData.sender.fullName, rightX, rightBlockY);
    doc.setFont('helvetica', 'normal');
    rightBlockY += 4.5;
  }
  if (docData.sender.street) {
    doc.text(docData.sender.street, rightX, rightBlockY);
    rightBlockY += 4.5;
  }
  const senderCityLine = `${docData.sender.postalCode || ''} ${docData.sender.city || ''}`.trim();
  if (senderCityLine) {
    doc.text(senderCityLine, rightX, rightBlockY);
    rightBlockY += 4.5;
  }
  if (docData.sender.phone) {
    doc.text(`Tel.: ${docData.sender.phone}`, rightX, rightBlockY);
    rightBlockY += 4.5;
  }
  if (docData.sender.email) {
    doc.text(`E-Mail: ${docData.sender.email}`, rightX, rightBlockY);
    rightBlockY += 4.5;
  }

  // 4. Place and Date (Datumzeile)
  currentY = Math.max(currentY + 12, 75);
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const dateLine = `${docData.place ? `${docData.place}, den ` : ''}${docData.date || new Date().toLocaleDateString('de-DE')}`;
  doc.text(dateLine, 210 - marginRight, currentY, { align: 'right' });

  // 5. Subject line (Betreff - Bold and emphasized)
  currentY += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  const splitSubject = doc.splitTextToSize(docData.subject, contentWidth);
  doc.text(splitSubject, marginLeft, currentY);
  currentY += splitSubject.length * 6 + 4;

  // 6. Salutation (Anrede)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text(docData.salutation, marginLeft, currentY);
  currentY += 8;

  // 7. Paragraphs
  for (const para of docData.paragraphs) {
    // Check if we need a page break
    if (currentY > 260) {
      doc.addPage();
      currentY = 25;
    }
    const splitPara = doc.splitTextToSize(para, contentWidth);
    doc.text(splitPara, marginLeft, currentY);
    currentY += splitPara.length * 5.2 + 4.5;
  }

  // 8. Closing & Signature
  if (currentY > 250) {
    doc.addPage();
    currentY = 25;
  }
  currentY += 3;
  doc.text(docData.closing, marginLeft, currentY);
  currentY += 18; // Space for handwritten signature

  doc.setFont('helvetica', 'bold');
  doc.text(docData.signName, marginLeft, currentY);
  currentY += 8;

  // 9. Enclosures (Anlagen) if any
  if (docData.enclosures && docData.enclosures.length > 0) {
    currentY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('Anlagen:', marginLeft, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    for (const enc of docData.enclosures) {
      doc.text(`- ${enc}`, marginLeft + 3, currentY);
      currentY += 4;
    }
  }

  // Footer: Watermark or Clean Premium badge
  if (!isPremium) {
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text(
      'Erstellt mit AlltagsHelfer Deutschland (Kostenlose Version) – Für amtliche Vorlagen',
      105,
      288,
      { align: 'center' }
    );
  }

  // Generate safe filename
  const cleanSubject = docData.subject
    .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')
    .slice(0, 30);
  const filename = `${cleanSubject || 'Brief'}_${new Date().toISOString().slice(0, 10)}.pdf`;

  doc.save(filename);
}
