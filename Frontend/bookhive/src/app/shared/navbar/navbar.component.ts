import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  template: `
<nav class="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
  <div class="container">
    <a class="navbar-brand" routerLink="/">BookHive</a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div id="nav" class="collapse navbar-collapse">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" routerLink="/">Home</a></li>

        <ng-container *ngIf="auth.isLoggedIn(); else guest">
          <!-- Show My Orders ONLY for USER role -->
          <li class="nav-item" *ngIf="auth.role()==='USER'">
            <a class="nav-link" routerLink="/orders">My Orders</a>
          </li>
          <!-- Show Admin menu ONLY for ADMIN role -->
          <li class="nav-item" *ngIf="auth.role()==='ADMIN'">
            <a class="nav-link" routerLink="/admin">Admin</a>
          </li>
        </ng-container>

        <ng-template #guest>
          <li class="nav-item"><a class="nav-link" routerLink="/auth">Login / Register</a></li>
        </ng-template>
      </ul>

      <div class="d-flex align-items-center gap-3">
        <a routerLink="/cart" class="btn btn-outline-primary position-relative">
          Cart
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {{ cart.count() }}
          </span>
        </a>
        <button *ngIf="auth.isLoggedIn()" class="btn btn-outline-secondary" (click)="logout()">Logout</button>
      </div>
    </div>
  </div>
</nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService, public cart: CartService) {}
  logout(){ this.auth.logout(); }
}
