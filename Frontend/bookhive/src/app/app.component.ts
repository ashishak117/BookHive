
// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { NavbarComponent } from './shared/navbar/navbar.component';
// import { AuthService } from './core/services/auth.service';

// @Component({
//   standalone: true,
//   selector: 'app-root',
//   imports: [RouterOutlet, NavbarComponent],
//   template: `
// <app-navbar></app-navbar>
// <div class="container py-4">
//   <router-outlet></router-outlet>
// </div>
//   `
// })
// export class AppComponent {
//   constructor(private auth: AuthService) {
//     // Validate token on app load; if invalid, logout so guards behave correctly
//     this.auth.me().catch(() => this.auth.logout());
//   }
// }
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
<app-navbar></app-navbar>
<div class="container py-4">
  <router-outlet></router-outlet>
</div>
  `
})
export class AppComponent {
  constructor(private auth: AuthService) {
    // Only call /auth/me if we already have a token,
    // and DO NOT logout on failure (the backend might be down briefly, etc.)
    const token = this.auth.token();
    if (token) {
      this.auth.me().catch(() => {/* ignore; keep token */});
    }
  }
}



