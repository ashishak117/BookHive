import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { Order } from '../../core/models/order.model';

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, DatePipe],
  template: `
<h3>My Orders</h3>
<div *ngFor="let o of orders()" class="card p-3 mb-2">
  <div class="d-flex justify-content-between">
    <div>
      <div class="fw-bold">#{{ o.id }} • {{ o.createdAt | date:'medium' }}</div>
      <div class="text-muted small">{{ o.lines.length }} items • ₹{{ o.total }}</div>
      <div class="text-muted small">Status: {{ o.status }}</div>
    </div>
    <div class="d-flex align-items-start gap-2">
      <button class="btn btn-outline-secondary btn-sm" (click)="invoice(o)">Invoice</button>
      <button *ngIf="o.status==='OUT_FOR_DELIVERY'" class="btn btn-success btn-sm" (click)="markDelivered(o.id)">
        I got the book
      </button>
    </div>
  </div>
</div>
  `
})
export class OrdersComponent {
  constructor(private ordersSvc: OrderService, private invoiceSvc: InvoiceService) {}
  async ngOnInit(){ await this.ordersSvc.loadMine(); }
  orders(){ return this.ordersSvc.orders(); }

  invoice(o: Order){ this.invoiceSvc.downloadInvoice(o); }

  async markDelivered(id: number){
    await this.ordersSvc.userConfirmDelivered(id);
    await this.ordersSvc.loadMine();
  }
}
