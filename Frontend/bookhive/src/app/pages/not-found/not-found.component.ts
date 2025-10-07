import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-not-found',
  template: `
<div class="text-center py-5">
  <h1 class="display-5">404</h1>
  <p class="lead">We couldn’t find that page.</p>
  <a class="btn btn-primary" routerLink="/">Go Home</a>
</div>
  `
})
export class NotFoundComponent {}
