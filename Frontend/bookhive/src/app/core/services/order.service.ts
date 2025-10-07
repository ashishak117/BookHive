import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartService } from './cart.service';
import { Order as MOrder, OrderLine as MOrderLine, PaymentMethod, OrderStatus, OrderType } from '../models/order.model';

type RawOrderLine = {
  bookId: number;
  name?: string;
  type: OrderType;
  qty: number;
  pricePerUnit: number;
  subtotal?: number;
};
type RawOrder = {
  id: number;
  userId?: number;
  createdAt: string;
  status: OrderStatus;
  method: PaymentMethod;
  deliveryFee: number;
  total: number;
  lines: RawOrderLine[];
};

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = environment.apiUrl;
  private _orders = signal<MOrder[]>([]);
  orders = this._orders;

  constructor(private http: HttpClient, private cart: CartService) {}

  private normalize(o: RawOrder): MOrder {
    const lines: MOrderLine[] = (o.lines ?? []).map(l => ({
      bookId: l.bookId,
      name: l.name ?? 'Item',
      type: l.type,
      qty: l.qty,
      unitPrice: l.pricePerUnit,
      subtotal: l.subtotal ?? l.qty * l.pricePerUnit
    }));
    return {
      id: o.id,
      userId: o.userId,
      createdAt: o.createdAt,
      status: o.status,
      method: o.method,
      deliveryFee: o.deliveryFee,
      total: o.total,
      lines
    };
  }

  async place(method: PaymentMethod, cardLast4?: string): Promise<void> {
    const c = this.cart.cart();
    if (!c.items.length) throw new Error('Your cart is empty.');
    const req = {
      method,
      deliveryFee: c.deliveryFee,
      lines: c.items.map(l => ({ bookId: l.book.id!, type: l.type, qty: l.qty }))
    };
    await this.http.post(`${this.base}/orders`, req).toPromise();
    this.cart.clear();
    await this.loadMine();
  }

  async loadMine(): Promise<void> {
    const res = await this.http.get<RawOrder[]>(`${this.base}/orders/mine`).toPromise();
    this._orders.set((res ?? []).map(r => this.normalize(r)));
  }

  // Admin
  async adminAll(): Promise<MOrder[]> {
    const res = await this.http.get<RawOrder[]>(`${this.base}/admin/orders`).toPromise();
    return (res ?? []).map(r => this.normalize(r));
  }
  async updateStatus(id: number, status: OrderStatus): Promise<void> {
    await this.http.patch(`${this.base}/admin/orders/${id}/status/${status}`, {}).toPromise();
  }
  async adminClose(id: number): Promise<void> {
    await this.http.patch(`${this.base}/admin/orders/${id}/status/CLOSED`, {}).toPromise();
  }

  // User confirms delivery
  async userConfirmDelivered(id: number): Promise<void> {
    await this.http.patch(`${this.base}/orders/${id}/delivered`, {}).toPromise();
  }
}
