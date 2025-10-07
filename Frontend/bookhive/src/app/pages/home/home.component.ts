// import { Component, OnInit, computed } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { BookService } from '../../core/services/book.service';
// import { finalPrice, borrowPrice, Book } from '../../core/models/book.model';
// import { CartService } from '../../core/services/cart.service';

// @Component({
//   standalone: true,
//   selector: 'app-home',
//   imports: [CommonModule, FormsModule],
//   template: `
// <div class="row g-2 align-items-end mb-3">
//   <div class="col-md-6">
//     <label class="form-label mb-1">Search</label>
//     <input class="form-control" placeholder="Search by name or category" [(ngModel)]="q">
//   </div>
//   <div class="col-md-4">
//     <label class="form-label mb-1">Category</label>
//     <select class="form-select" [(ngModel)]="cat">
//       <option value="">All</option>
//       <option *ngFor="let c of categories()" [value]="c">{{ c }}</option>
//     </select>
//   </div>
//   <div class="col-md-2 d-grid">
//     <button class="btn btn-outline-secondary" (click)="clearFilters()">Clear</button>
//   </div>
// </div>

// <div class="row g-3">
//   <div class="col-md-4" *ngFor="let b of filtered()">
//     <div class="card h-100 shadow-sm">
//       <img *ngIf="b.coverUrl" [src]="b.coverUrl" class="card-img-top" alt="cover">
//       <div class="card-body d-flex flex-column">
//         <h5 class="card-title">{{ b.name }}</h5>
//         <div class="text-muted small mb-2">{{ b.category }} • ID: {{ b.bookId }}</div>

//         <div class="mb-2">
//           <span *ngIf="b.discount && b.discount>0" class="text-decoration-line-through me-2">₹{{ b.price }}</span>
//           <span class="fw-bold">₹{{ fp(b) }}</span>
//           <span *ngIf="b.discount && b.discount>0" class="badge text-bg-success ms-2">{{ b.discount }}% OFF</span>
//         </div>
//         <div class="small mb-2">Borrow: <b>₹{{ bp(b) }}</b> (50% of buy)</div>
//         <div class="small mb-2">Stock left: <b>{{ b.quantity }}</b></div>

//         <div class="mt-auto d-flex gap-2">
//           <button class="btn btn-outline-primary w-50" (click)="add(b, 'BUY')" [disabled]="b.quantity<=0">Buy</button>
//           <button class="btn btn-primary w-50" (click)="add(b, 'BORROW')" [disabled]="b.quantity<=0">Borrow</button>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
//   `
// })
// export class HomeComponent implements OnInit {
//   q = ''; cat = '';

//   constructor(private books: BookService, private cart: CartService) {}
//   ngOnInit() { this.books.loadAll(); }

//   fp = finalPrice; bp = borrowPrice;

//   categories = computed(() => {
//     const set = new Set(this.books.books().filter(b=>b.published).map(b => b.category));
//     return Array.from(set).sort();
//   });

//   filtered = computed(() => {
//     const q = this.q.trim().toLowerCase();
//     const c = this.cat.trim();
//     let all = this.books.books().filter(b => b.published);
//     if (c) all = all.filter(b => b.category === c);
//     if (!q) return all;
//     return all.filter(b => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
//   });

//   clearFilters(){ this.q=''; this.cat=''; }

//   add(b: Book, type: 'BUY'|'BORROW') {
//     if (b.quantity <= 0) return;
//     this.cart.add({ book: b, type, qty: 1 });
//     alert(`${type==='BUY'?'Buy':'Borrow'} added to cart`);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../core/services/book.service';
import { CartService } from '../../core/services/cart.service';
import { Book } from '../../core/models/book.model';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  template: `
<h3>Explore Books</h3>
<div class="row g-3">
  <div class="col-md-3" *ngFor="let b of bs.books()">
    <div class="card h-100 shadow-sm">
      <img [src]="b.coverUrl || 'https://picsum.photos/seed/'+b.id+'/400/300'" class="card-img-top" alt="cover">
      <div class="card-body d-flex flex-column">
        <div class="fw-bold">{{ b.name }}</div>
        <div class="text-muted small">{{ b.category }}</div>
        <div class="mt-2">
          <span *ngIf="b.discount && b.discount>0" class="text-muted text-decoration-line-through me-2">₹{{ b.price }}</span>
          <span class="fw-bold">₹{{ finalPrice(b) }}</span>
          <span *ngIf="b.discount && b.discount>0" class="badge text-bg-success ms-2">{{ b.discount }}% off</span>
        </div>
        <div class="small mb-2">Borrow: <b>₹{{ borrowPrice(b) }}</b> (50% of buy)</div>
        <div class="mt-auto d-flex gap-2">
          <button class="btn btn-outline-primary w-50" (click)="add(b, 'BUY')" [disabled]="b.quantity===0">Buy</button>
          <button class="btn btn-primary w-50" (click)="add(b, 'BORROW')" [disabled]="b.quantity===0">Borrow</button>
        </div>
        <div *ngIf="b.quantity===0" class="text-danger small mt-2">Out of stock</div>
      </div>
    </div>
  </div>
</div>
  `
})
export class HomeComponent implements OnInit {
  constructor(public bs: BookService, private cart: CartService) {}
  async ngOnInit(){ await this.bs.loadAll(); }

  finalPrice(b: Book){ return (b.discount ?? 0) > 0 ? Math.round(b.price * (1 - (b.discount ?? 0)/100)) : b.price; }
  borrowPrice(b: Book){ return Math.round(this.finalPrice(b) * 0.5); }
  add(b: Book, type: 'BUY'|'BORROW'){ this.cart.add(b, type); alert('Added to cart'); }
}
