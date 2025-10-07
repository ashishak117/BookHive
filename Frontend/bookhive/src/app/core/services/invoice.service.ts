import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

declare global {
  interface Window { jspdf: any; }
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {

  private asLines(o: Order): string[] {
    const lines = o.lines.map(l =>
      `- ${l.name ?? 'Item'} (${l.type}) x${l.qty} @ ₹${l.unitPrice} = ₹${(l.subtotal ?? l.qty * l.unitPrice).toFixed(2)}`
    );
    return [
      `BookHive Invoice`,
      `Order #${o.id}`,
      `Date: ${new Date(o.createdAt).toLocaleString()}`,
      ``,
      ...lines,
      ``,
      `Delivery Fee: ₹${o.deliveryFee.toFixed(2)}`,
      `Total: ₹${o.total.toFixed(2)}`,
      `Payment: ${o.method}${o.cardLast4 ? ' •••• ' + o.cardLast4 : ''}`
    ];
  }

  downloadInvoice(o: Order) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const left = 48;
    const top = 64;
    let y = top;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('BookHive Invoice', left, y);
    y += 28;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    const lines = this.asLines(o);
    for (const line of lines) {
      // wrap long text
      const wrapped = doc.splitTextToSize(line, 520);
      doc.text(wrapped, left, y);
      y += 18 * wrapped.length;

      // new page if needed
      if (y > 760) {
        doc.addPage();
        y = top;
      }
    }

    doc.save(`Invoice_Order_${o.id}.pdf`);
  }
}
