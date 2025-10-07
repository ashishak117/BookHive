import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Book, Discount } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private api = environment.apiUrl;
  books = signal<Book[]>([]);

  constructor(private http: HttpClient) {}

  private normalize(b: any): Book {
    const d = (b?.discount ?? 0) as Discount;
    return { ...b, discount: d };
  }

  async loadAll() {
    const res = await this.http.get<any[]>(`${this.api}/books`).toPromise();
    this.books.set((res ?? []).map(x => this.normalize(x)));
  }

  // Admin
  async adminListAll(): Promise<Book[]> {
    const res = await this.http.get<any[]>(`${this.api}/admin/books`).toPromise();
    return (res ?? []).map(x => this.normalize(x));
  }

  async create(book: Book): Promise<Book> {
    const res = await this.http.post<any>(`${this.api}/admin/books`, book).toPromise();
    return this.normalize(res);
  }

  async update(book: Book): Promise<Book> {
    const res = await this.http.put<any>(`${this.api}/admin/books/${book.id}`, book).toPromise();
    return this.normalize(res);
  }

  async remove(id: number): Promise<void> {
    await this.http.delete<void>(`${this.api}/admin/books/${id}`).toPromise();
  }
}
