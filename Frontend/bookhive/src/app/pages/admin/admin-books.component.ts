import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';

@Component({
  standalone: true,
  selector: 'app-admin-books',
  imports: [CommonModule, FormsModule],
  template: `
<h3>Admin • Books</h3>

<div class="card p-3 mb-3">
  <h5 class="mb-3">{{ form.id ? 'Edit Book' : 'Create Book' }}</h5>
  <form (ngSubmit)="save()">
    <div class="row g-2">
      <div class="col-md-4">
        <label class="form-label">Name</label>
        <input class="form-control" [(ngModel)]="form.name" name="name" required>
      </div>
      <div class="col-md-3">
        <label class="form-label">Category</label>
        <input class="form-control" [(ngModel)]="form.category" name="category" required>
      </div>
      <div class="col-md-2">
        <label class="form-label">Price (₹)</label>
        <input type="number" min="0" class="form-control" [(ngModel)]="form.price" name="price" required>
      </div>
      <div class="col-md-2">
        <label class="form-label">Quantity</label>
        <input type="number" min="0" class="form-control" [(ngModel)]="form.quantity" name="quantity" required>
      </div>
      <div class="col-md-1">
        <label class="form-label">Discount</label>
        <select class="form-select" [(ngModel)]="form.discount" name="discount">
          <option [ngValue]="0">0%</option>
          <option [ngValue]="25">25%</option>
          <option [ngValue]="45">45%</option>
        </select>
      </div>
      <div class="col-12">
        <label class="form-label">Cover URL (optional)</label>
        <input class="form-control" [(ngModel)]="form.coverUrl" name="coverUrl" placeholder="https://...">
      </div>
      <div class="col-12">
        <div class="form-check mt-2">
          <input class="form-check-input" type="checkbox" id="pub" [(ngModel)]="form.published" name="published">
          <label for="pub" class="form-check-label">Publish</label>
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex gap-2">
      <button class="btn btn-primary" type="submit">{{ form.id ? 'Update' : 'Create' }}</button>
      <button class="btn btn-outline-secondary" type="button" (click)="reset()">Clear</button>
    </div>
  </form>
</div>

<div *ngIf="error" class="alert alert-danger">{{ error }}</div>

<table class="table align-middle">
  <thead>
    <tr><th>BookId</th><th>Name</th><th>Category</th><th>Price</th><th>Discount</th><th>Qty</th><th>Published</th><th></th></tr>
  </thead>
  <tbody>
    <tr *ngFor="let b of list">
      <td>{{ b.bookId }}</td>
      <td>{{ b.name }}</td>
      <td>{{ b.category }}</td>
      <td>₹{{ b.price }}</td>
      <td>{{ b.discount ?? 0 }}%</td>
      <td>{{ b.quantity }}</td>
      <td>
        <span class="badge" [class.text-bg-success]="b.published" [class.text-bg-secondary]="!b.published">
          {{ b.published ? 'Yes' : 'No' }}
        </span>
      </td>
      <td class="text-nowrap">
        <button class="btn btn-sm btn-outline-primary me-1" (click)="edit(b)">Edit</button>
        <button class="btn btn-sm btn-outline-danger me-1" (click)="remove(b)">Delete</button>
        <button class="btn btn-sm btn-outline-dark" (click)="togglePub(b)">{{ b.published ? 'Unpublish' : 'Publish' }}</button>
      </td>
    </tr>
  </tbody>
</table>
  `
})
export class AdminBooksComponent implements OnInit {
  list: Book[] = [];
  error = '';
  form: Book = { name:'', category:'', price:0, quantity:0, discount:0, published:false };

  constructor(public bs: BookService) {}
  async ngOnInit(){ await this.load(); }

  async load() {
    this.error = '';
    try {
      this.list = await this.bs.adminListAll();
    } catch (e: any) {
      this.error = e?.error?.message || 'Failed to load books.';
    }
  }

  reset(){ this.form = { name:'', category:'', price:0, quantity:0, discount:0, published:false }; }
  edit(b: Book){ this.form = { ...b }; }

  private sanitizeForm(): Book {
    return {
      ...this.form,
      price: Number(this.form.price || 0),
      quantity: Number(this.form.quantity || 0),
      discount: (this.form.discount ?? 0) as 0|25|45,
      published: !!this.form.published,
    };
  }

  async save(){
    this.error = '';
    const payload = this.sanitizeForm();
    try {
      if (payload.id) await this.bs.update(payload);
      else await this.bs.create(payload);
      this.reset(); await this.load();
    } catch (e: any) {
      this.error = e?.error?.message || 'Failed to save book.';
    }
  }

  async remove(b: Book){
    this.error = '';
    if (!confirm('Delete this book?')) return;
    try {
      await this.bs.remove(b.id!);
      await this.load();
    } catch (e: any) {
      this.error = e?.error?.message || 'Failed to delete book.';
    }
  }

  async togglePub(b: Book){
    this.error = '';
    try {
      await this.bs.update({ ...b, published: !b.published });
      await this.load();
    } catch (e: any) {
      this.error = e?.error?.message || 'Failed to update publish status.';
    }
  }
}
