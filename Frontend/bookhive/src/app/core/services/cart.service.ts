import { Injectable, signal, WritableSignal } from '@angular/core';
import { Book } from '../models/book.model';

export type LineType = 'BUY' | 'BORROW';

export interface CartLine {
  book: Book;
  type: LineType;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartState {
  items: CartLine[];
  deliveryFee: number;
  subtotal: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _cart: WritableSignal<CartState> = signal<CartState>(this.load());
  cart = this._cart;

  constructor() { this.recalcAndPersist(); }

  private load(): CartState {
    const raw = localStorage.getItem('bh_cart');
    return raw ? JSON.parse(raw) as CartState : { items: [], deliveryFee: 30, subtotal: 0, total: 0 };
  }

  private save(state: CartState) {
    localStorage.setItem('bh_cart', JSON.stringify(state));
  }

  private priceFor(b: Book): number {
    const discount = b.discount ?? 0;
    const discounted = discount > 0 ? Math.round(b.price * (1 - discount / 100)) : b.price;
    return discounted;
  }

  private recalc(state: CartState): CartState {
    const items = state.items.map(l => {
      const unit = l.type === 'BUY' ? this.priceFor(l.book) : Math.round(this.priceFor(l.book) * 0.5);
      const qty = l.qty;
      return { ...l, unitPrice: unit, subtotal: unit * qty };
    });
    const subtotal = items.reduce((a, b) => a + b.subtotal, 0);
    const total = subtotal + state.deliveryFee;
    return { ...state, items, subtotal, total };
  }

  private recalcAndPersist() {
    const next = this.recalc(this._cart());
    this._cart.set(next);
    this.save(next);
  }

  add(book: Book, type: LineType) {
    const cur = this._cart();
    const idx = cur.items.findIndex(l => l.book.id === book.id && l.type === type);
    let items: CartLine[];

    if (idx >= 0) {
      items = cur.items.map((l, i) => i === idx ? { ...l, qty: l.qty + 1 } : l);
    } else {
      const unit = type === 'BUY' ? this.priceFor(book) : Math.round(this.priceFor(book) * 0.5);
      items = [...cur.items, { book, type, qty: 1, unitPrice: unit, subtotal: unit }];
    }

    this._cart.set(this.recalc({ ...cur, items }));
    this.save(this._cart());
  }

  inc(i: number) {
    const cur = this._cart();
    const items = cur.items.map((l, idx) => idx === i ? { ...l, qty: l.qty + 1 } : l);
    const next = this.recalc({ ...cur, items });
    this._cart.set(next);
    this.save(next);
  }

  dec(i: number) {
    const cur = this._cart();
    const items = cur.items.map((l, idx) => idx === i ? { ...l, qty: Math.max(1, l.qty - 1) } : l);
    const next = this.recalc({ ...cur, items });
    this._cart.set(next);
    this.save(next);
  }

  remove(i: number) {
    const cur = this._cart();
    const items = cur.items.filter((_, idx) => idx !== i);
    const next = this.recalc({ ...cur, items });
    this._cart.set(next);
    this.save(next);
  }

  clear() {
    const next: CartState = { items: [], deliveryFee: 30, subtotal: 0, total: 0 };
    this._cart.set(next);
    this.save(next);
  }

  deliveryFee() { return this._cart().deliveryFee; }
  subtotal() { return this._cart().subtotal; }
  total() { return this._cart().total; }
  count() { return this._cart().items.reduce((a, b) => a + b.qty, 0); }
}
