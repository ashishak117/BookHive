import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  template: `
<h3>Cart</h3>

<div *ngIf="cart.cart().items.length===0" class="alert alert-info">
  Your cart is empty. <a routerLink="/">Browse books</a>
</div>

<div *ngIf="cart.cart().items.length>0" class="row g-3">
  <div class="col-md-8">
    <div class="card p-3 shadow-sm">
      <div class="list-group">
        <div class="list-group-item d-flex align-items-center justify-content-between" *ngFor="let l of cart.cart().items; let i=index">
          <div>
            <div class="fw-bold">{{ l.book.name }} <span class="badge text-bg-secondary ms-2">{{ l.type }}</span></div>
            <div class="text-muted small">₹{{ l.unitPrice }} x {{ l.qty }}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary" (click)="cart.dec(i)">-</button>
            <span>{{ l.qty }}</span>
            <button class="btn btn-sm btn-outline-secondary" (click)="cart.inc(i)">+</button>
            <div class="ms-3 fw-bold">₹{{ l.subtotal }}</div>
            <button class="btn btn-sm btn-outline-danger ms-2" (click)="cart.remove(i)">Remove</button>
          </div>
        </div>
      </div>
      <button class="btn btn-outline-danger mt-3" (click)="cart.clear()">Clear Cart</button>
    </div>
  </div>

  <div class="col-md-4">
    <div class="card p-3 shadow-sm">
      <div class="d-flex justify-content-between"><span>Subtotal</span><span>₹{{ cart.subtotal() }}</span></div>
      <div class="d-flex justify-content-between"><span>Delivery</span><span>₹{{ cart.deliveryFee() }}</span></div>
      <hr>
      <div class="d-flex justify-content-between fw-bold"><span>Total</span><span>₹{{ cart.total() }}</span></div>
      <a class="btn btn-primary w-100 mt-3" routerLink="/checkout">Proceed to Pay</a>
    </div>
  </div>
</div>
  `
})
export class CartComponent {
  constructor(public cart: CartService) {}
}
