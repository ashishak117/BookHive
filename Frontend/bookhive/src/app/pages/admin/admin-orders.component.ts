import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';

@Component({
  standalone: true,
  selector: 'app-admin-orders',
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
<h3>Admin • Orders</h3>

<div *ngFor="let o of list" class="card p-3 mb-2">
  <div class="d-flex justify-content-between align-items-start">
    <div>
      <div class="fw-bold">#{{ o.id }} • {{ o.createdAt | date:'short' }}</div>
      <div class="text-muted small">{{ o.lines.length }} items • ₹{{ o.total }}</div>
      <div class="text-muted small">Payment: {{ o.method }}</div>
      <div class="text-muted small">Current: {{ o.status }}</div>
    </div>
    <div class="d-flex align-items-center gap-2">
      <label class="form-label mb-0 me-2 small text-muted">Set Status</label>
      <select class="form-select form-select-sm"
              [ngModel]="o.status"
              (ngModelChange)="setStatus(o.id, $event)">
        <option value="CONFIRMED">CONFIRMED</option>
        <option value="PACKED">PACKED</option>
        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
        <option value="DELIVERED">DELIVERED</option>
      </select>

      <button class="btn btn-sm btn-success"
              [disabled]="o.status!=='DELIVERED'"
              (click)="closeCase(o.id)">
        Close Case
      </button>
    </div>
  </div>
</div>
  `
})
export class AdminOrdersComponent {
  list: Order[] = [];
  constructor(private ordersSvc: OrderService){}

  async ngOnInit(){ this.list = await this.ordersSvc.adminAll(); }

  async setStatus(id: number, status: string) {
    await this.ordersSvc.updateStatus(id, status as OrderStatus);
    this.list = await this.ordersSvc.adminAll();
  }

  async closeCase(id: number) {
    await this.ordersSvc.adminClose(id);
    this.list = await this.ordersSvc.adminAll();
  }
}
