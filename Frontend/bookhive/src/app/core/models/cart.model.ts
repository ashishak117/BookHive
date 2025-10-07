export type CartType = 'BUY' | 'BORROW';

export interface CartItem {
  book: import('./book.model').Book;
  type: CartType;
  qty: number;
}

export interface Cart {
  items: CartItem[];
  deliveryFee: number; // 30
}
