import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';

@Component({
  standalone: true,
  selector: 'app-borrowed',
  imports: [CommonModule],
  template: `
<h3>Borrowed Limit</h3>
<p class="text-muted">Borrowed items are due in 14 days.</p>

<div *ngFor="let o of borrowedOrders()" class="card mb-3">
  <div class="card-body">
    <div class="fw-bold mb-2">Order #{{ o.id }} • {{ o.createdAt | date:'mediumDate' }}</div>
    <div *ngFor="let l of o.lines" class="d-flex justify-content-between align-items-center mb-1" >
      <ng-container *ngIf="l.type==='BORROW'">
        <div>{{ l.name }} • Qty {{ l.qty }}</div>
        <div>
          <span class="badge" [ngClass]="daysLeft(o) <= 3 ? 'text-bg-danger' : 'text-bg-warning'">
            {{ daysLeft(o) }} days left
          </span>
        </div>
      </ng-container>
    </div>
  </div>
</div>
  `
})
export class BorrowedComponent {
  constructor(private orders: OrderService) {}
  borrowedOrders() {
    return this.orders.orders().filter(o => o.lines.some(l => l.type==='BORROW'));
  }
  daysLeft(o: any) {
    const start = new Date(o.createdAt || Date.now());
    const due = new Date(start.getTime() + 14*24*3600*1000);
    const diff = Math.ceil((due.getTime() - Date.now()) / (24*3600*1000));
    return Math.max(0, diff);
  }
}
