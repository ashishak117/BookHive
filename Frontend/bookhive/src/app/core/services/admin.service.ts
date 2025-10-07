import { Injectable, signal } from '@angular/core';
import { BookService } from './book.service';
import { OrderService } from './order.service';
import { Order } from '../models/order.model';

export interface AdminStats {
  usersCount: number;
  totalBooks: number;
  totalSales: number;   // BUY
  totalBorrow: number;  // BORROW
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private _stats = signal<AdminStats>({
    usersCount: 0,
    totalBooks: 0,
    totalSales: 0,
    totalBorrow: 0
  });
  private _orders: Order[] = [];

  constructor(private books: BookService, private orders: OrderService) {}

  stats(): AdminStats { return this._stats(); }

  async refresh(): Promise<void> {
    const [allBooks, allOrders] = await Promise.all([
      this.books.adminListAll(),
      this.orders.adminAll()
    ]);

    const totalBooks = allBooks.reduce<number>((sum, b) => sum + (b.quantity ?? 0), 0);
    this._orders = allOrders;

    const allLines = this._orders.flatMap(o => o.lines);
    const totalSales = allLines.filter(l => l.type === 'BUY')
      .reduce((a, l) => a + (l.subtotal ?? l.qty * l.unitPrice), 0);
    const totalBorrow = allLines.filter(l => l.type === 'BORROW')
      .reduce((a, l) => a + (l.subtotal ?? l.qty * l.unitPrice), 0);

    this._stats.set({ usersCount: 0, totalBooks, totalSales, totalBorrow });
  }

  /** Chart helpers */
  dailyRevenue(): { labels: string[]; values: number[] } {
    const map = new Map<string, number>();
    for (const o of this._orders) {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
      map.set(key, (map.get(key) ?? 0) + o.total);
    }
    const labels = Array.from(map.keys()).sort();
    const values = labels.map(k => map.get(k) ?? 0);
    return { labels, values };
  }

  orderMix(): { buy: number; borrow: number } {
    let buy = 0, borrow = 0;
    for (const o of this._orders) {
      for (const l of o.lines) {
        if (l.type === 'BUY') buy += l.qty;
        else borrow += l.qty;
      }
    }
    return { buy, borrow };
  }
}
