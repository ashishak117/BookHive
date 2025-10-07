export type PaymentMethod = 'COD' | 'CARD';
export type OrderType = 'BUY' | 'BORROW';
export type OrderStatus = 'CONFIRMED' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CLOSED';

export interface OrderLine {
  bookId: number;
  name: string;
  type: OrderType;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId?: number;
  createdAt: string;
  status: OrderStatus;
  method: PaymentMethod;
  cardLast4?: string;
  deliveryFee: number;
  total: number;
  lines: OrderLine[];
  tracking?: OrderStatus;
}
