
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { OrderService } from '../../core/services/order.service';
// import { CartService } from '../../core/services/cart.service';
// import { Router } from '@angular/router';
// import { HttpErrorResponse } from '@angular/common/http';

// @Component({
//   standalone: true,
//   selector: 'app-checkout',
//   imports: [CommonModule, FormsModule],
//   template: `
// <h3>Payment</h3>
// <div class="row g-3">
//   <div class="col-md-6">
//     <div class="card p-3 shadow-sm">
//       <div class="mb-2"><b>Total Payable:</b> ₹{{ cart.total() }}</div>
//       <div class="mb-2"><b>Delivery Fee:</b> ₹{{ cart.deliveryFee() }}</div>

//       <div *ngIf="msg" class="mb-2" [class.text-danger]="isErr" [class.text-success]="!isErr">{{ msg }}</div>

//       <div class="mb-3 text-muted">Choose a payment method:</div>
//       <div class="d-flex gap-2 mb-3">
//         <button class="btn btn-outline-primary" (click)="pay('COD')">Cash on Delivery</button>
//         <button class="btn btn-primary" (click)="useCard=true">Card (demo)</button>
//       </div>

//       <form *ngIf="useCard" (ngSubmit)="pay('CARD')" class="border-top pt-3">
//         <div class="mb-2">
//           <label class="form-label">Card Number</label>
//           <input class="form-control" [(ngModel)]="card.number" name="number" required minlength="12" maxlength="19" placeholder="4111 1111 1111 1111">
//         </div>
//         <div class="row g-2">
//           <div class="col-6">
//             <label class="form-label">Expiry (MM/YY)</label>
//             <input class="form-control" [(ngModel)]="card.exp" name="exp" required placeholder="12/30">
//           </div>
//           <div class="col-6">
//             <label class="form-label">CVV</label>
//             <input class="form-control" [(ngModel)]="card.cvv" name="cvv" required maxlength="4" placeholder="123">
//           </div>
//         </div>
//         <button class="btn btn-success mt-3" type="submit">Pay ₹{{ cart.total() }}</button>
//         <div class="form-text">Demo only – no real payment.</div>
//       </form>
//     </div>
//   </div>
// </div>
//   `
// })
// export class CheckoutComponent {
//   constructor(private orders: OrderService, public cart: CartService, private router: Router) {}
//   useCard = false; card = { number: '', exp: '', cvv: '' };
//   msg = ''; isErr = false;

//   async pay(method: 'COD'|'CARD') {
//     this.msg = ''; this.isErr = false;
//     try {
//       await this.orders.place(method);
//       this.msg = 'Payment successful. Order placed!';
//       this.isErr = false;
//       this.router.navigate(['/orders']);
//     } catch (e) {
//       const err = e as HttpErrorResponse;
//       this.isErr = true;
//       if (err.status === 401 || err.status === 403) {
//         this.msg = 'Please login to place an order.';
//         this.router.navigate(['/auth'], { queryParams: { redirect: '/checkout' } });
//       } else {
//         this.msg = err.error?.message || 'Failed to place order.';
//       }
//     }
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  template: `
<h3>Payment</h3>
<div class="row g-3">
  <div class="col-md-6">
    <div class="card p-3 shadow-sm">
      <div class="mb-2"><b>Total Payable:</b> ₹{{ cart.total() }}</div>
      <div class="mb-2"><b>Delivery Fee:</b> ₹{{ cart.deliveryFee() }}</div>

      <div *ngIf="msg" class="mb-2" [class.text-danger]="isErr" [class.text-success]="!isErr">{{ msg }}</div>

      <div class="mb-3 text-muted">Choose a payment method:</div>
      <div class="d-flex gap-2 mb-3">
        <button class="btn btn-outline-primary" (click)="pay('COD')">Cash on Delivery</button>
        <button class="btn btn-primary" (click)="useCard=true">Card (demo)</button>
      </div>

      <form *ngIf="useCard" (ngSubmit)="pay('CARD')" class="border-top pt-3">
        <div class="mb-2">
          <label class="form-label">Card Number</label>
          <input class="form-control" [(ngModel)]="card.number" name="number" required minlength="12" maxlength="19" placeholder="4111 1111 1111 1111">
        </div>
        <div class="row g-2">
          <div class="col-6">
            <label class="form-label">Expiry (MM/YY)</label>
            <input class="form-control" [(ngModel)]="card.exp" name="exp" required placeholder="12/30">
          </div>
          <div class="col-6">
            <label class="form-label">CVV</label>
            <input class="form-control" [(ngModel)]="card.cvv" name="cvv" required maxlength="4" placeholder="123">
          </div>
        </div>
        <button class="btn btn-success mt-3" type="submit">Pay ₹{{ cart.total() }}</button>
        <div class="form-text">Demo only – no real payment.</div>
      </form>
    </div>
  </div>
</div>
  `
})
export class CheckoutComponent {
  constructor(private orders: OrderService, public cart: CartService, private router: Router) {}
  useCard = false; card = { number: '', exp: '', cvv: '' };
  msg = ''; isErr = false;

  async pay(method: 'COD'|'CARD') {
    this.msg = ''; this.isErr = false;
    try {
      const last4 = method === 'CARD' ? (this.card.number || '').replace(/\s+/g,'').slice(-4) : undefined;
      await this.orders.place(method, last4);
      this.msg = 'Payment successful. Order placed!';
      this.isErr = false;
      this.router.navigate(['/orders']);
    } catch (e) {
      const err = e as HttpErrorResponse;
      this.isErr = true;
      if (err.status === 401 || err.status === 403) {
        this.msg = 'Please login to place an order.';
        this.router.navigate(['/auth'], { queryParams: { redirect: '/checkout' } });
      } else {
        this.msg = err.error?.message || 'Failed to place order.';
      }
    }
  }
}
