import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const getCurrencySymbol = (currency) => {
  const symbols = { EUR: '€', USD: '$', CHF: 'CHF' };
  return symbols[currency] || currency;
}

const initializeDoc = () => {
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'normal');
    return doc;
};

export const generateInvoicePDF = (invoice, coachee, company) => {
  const doc = initializeDoc();
  const currencySymbol = getCurrencySymbol(invoice.currency);

  const drawHeader = (docInstance) => {
    if (company.logoUrl) {
      try {
        // Simple check for image format based on URL extension
        const format = company.logoUrl.split('.').pop().toUpperCase();
        if (['PNG', 'JPG', 'JPEG'].includes(format)) {
            docInstance.addImage(company.logoUrl, format, 15, 15, 40, 15);
        } else {
             docInstance.setFontSize(20).setFont('Helvetica', 'bold').text(company.name, 15, 25);
        }
      } catch (e) {
        console.error("Error adding logo:", e);
        docInstance.setFontSize(20).setFont('Helvetica', 'bold').text(company.name, 15, 25);
      }
    } else {
      docInstance.setFontSize(20).setFont('Helvetica', 'bold').text(company.name, 15, 25);
    }

    docInstance.setFontSize(8).setFont('Helvetica', 'normal');
    const companyAddress = `${company.street}, ${company.zip} ${company.city}`;
    docInstance.text(companyAddress, 195, 20, { align: 'right' });
  };

  drawHeader(doc);
  
  doc.setFontSize(10);
  doc.text('An:', 15, 50);
  doc.setFont('Helvetica', 'bold');
  doc.text(`${coachee.firstName} ${coachee.lastName}`, 15, 55);
  doc.setFont('Helvetica', 'normal');
  const coacheeAddress = coachee.address ? coachee.address.split(', ') : ['Keine Adresse', ''];
  doc.text(coacheeAddress[0], 15, 60);
  if(coacheeAddress[1]) doc.text(coacheeAddress[1], 15, 65);

  doc.setFontSize(10);
  doc.text(`Rechnungs-Nr.:`, 140, 50);
  doc.text(`Datum:`, 140, 57);
  doc.text(`Fällig am:`, 140, 64);

  doc.setFont('Helvetica', 'bold');
  doc.text(invoice.invoiceNumber, 195, 50, { align: 'right' });
  doc.setFont('Helvetica', 'normal');
  doc.text(format(new Date(invoice.date), 'dd.MM.yyyy'), 195, 57, { align: 'right' });
  doc.text(format(new Date(invoice.dueDate), 'dd.MM.yyyy'), 195, 64, { align: 'right' });

  doc.setFontSize(14).setFont('Helvetica', 'bold');
  doc.text(`Rechnung für ${invoice.title || 'Coaching & Beratung'}`, 15, 85);

  const tableColumn = ["#", "Beschreibung", "Menge", "Einzelpreis", "Gesamt"];
  const tableRows = [];
  invoice.items.forEach((item, index) => {
    tableRows.push([
      index + 1,
      item.description,
      item.quantity,
      `${item.price.toFixed(2)} ${currencySymbol}`,
      `${(item.quantity * item.price).toFixed(2)} ${currencySymbol}`
    ]);
  });

  doc.autoTable({
    startY: 95,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [38, 43, 54], font: 'Helvetica', fontStyle: 'bold' },
    bodyStyles: { font: 'Helvetica' },
    didDrawPage: (data) => {
        if (data.pageNumber > 1) {
            drawHeader(doc);
        }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text(`Zwischensumme:`, 140, finalY);
  doc.text(`${invoice.subtotal.toFixed(2)} ${currencySymbol}`, 195, finalY, { align: 'right' });
  doc.text(`Umsatzsteuer (${invoice.taxRate}%):`, 140, finalY + 7);
  doc.text(`${invoice.taxAmount.toFixed(2)} ${currencySymbol}`, 195, finalY + 7, { align: 'right' });
  
  doc.setLineWidth(0.2).line(140, finalY + 12, 195, finalY + 12);
  
  doc.setFontSize(12).setFont('Helvetica', 'bold');
  doc.text(`Gesamtbetrag:`, 140, finalY + 18);
  doc.text(`${invoice.total.toFixed(2)} ${currencySymbol}`, 195, finalY + 18, { align: 'right' });

  const paymentDeadlineDays = company.paymentDeadlineDays || 14;
  doc.setFontSize(10).setFont('Helvetica', 'normal');
  doc.text(`Bitte überweisen Sie den Betrag innerhalb von ${paymentDeadlineDays} Tagen.`, 15, doc.internal.pageSize.height - 50);

  const footerY = doc.internal.pageSize.height - 30;
  doc.setLineWidth(0.1).line(15, footerY, 195, footerY);
  doc.setFontSize(8);
  let footerText = `${company.name} | Inhaber: ${company.owner}`;
  if(company.showBankDetailsOnInvoice) {
    footerText += ` | ${company.bankName} | IBAN: ${company.iban}`;
  }
  doc.text(footerText, doc.internal.pageSize.getWidth() / 2, footerY + 5, { align: 'center' });
  let footerText2 = `Tel: ${company.phone} | E-Mail: ${company.email} | Web: ${company.website}`;
  doc.text(footerText2, doc.internal.pageSize.getWidth() / 2, footerY + 10, { align: 'center' });


  doc.save(`Rechnung-${invoice.invoiceNumber}.pdf`);
};

export const generateSessionNotePDF = (note, coachee, session) => {
  const doc = initializeDoc();

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Sitzungsnotiz', 14, 22);

  doc.setFontSize(11);
  doc.setFont('Helvetica', 'normal');
  const metaData = [
    ['Titel:', note.title],
    ['Coachee:', coachee ? `${coachee.firstName} ${coachee.lastName}` : 'N/A'],
    ['Session:', session ? `${session.topic} am ${format(new Date(session.date), 'dd.MM.yyyy', { locale: de })}` : 'Keine spezifische Session'],
    ['Erstellt am:', format(new Date(note.createdAt), 'dd. MMMM yyyy, HH:mm', { locale: de }) + ' Uhr'],
  ];
  doc.autoTable({
    body: metaData,
    startY: 30,
    theme: 'plain',
    styles: { cellPadding: 1.5, fontSize: 11, font: 'Helvetica' },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 } },
  });

  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  const finalY = doc.lastAutoTable.finalY;
  doc.text('Inhalt der Notiz', 14, finalY + 15);
  
  const splitText = doc.splitTextToSize(note.content, 180);
  
  let cursorY = finalY + 22;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);

  splitText.forEach(line => {
    if (cursorY > 280) {
      doc.addPage();
      cursorY = 20;
    }
    
    if (line.startsWith('## ')) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(line.substring(3), 14, cursorY);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
    } else if (line.startsWith('- ')) {
      doc.text('•', 14, cursorY);
      doc.text(line.substring(2), 18, cursorY);
    } else {
      doc.text(line, 14, cursorY);
    }
    cursorY += 7;
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Seite ${i} von ${pageCount}`, doc.internal.pageSize.width - 25, 290);
  }

  doc.save(`Sitzungsnotiz_${note.id}_${coachee ? coachee.lastName : ''}.pdf`);
};