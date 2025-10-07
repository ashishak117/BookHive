export type Discount = 0 | 25 | 45;

export interface Book {
  id?: number;
  bookId?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  discount?: Discount;
  published?: boolean;
  coverUrl?: string;
}
