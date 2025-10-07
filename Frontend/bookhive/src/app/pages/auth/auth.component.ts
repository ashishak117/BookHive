// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   standalone: true,
//   selector: 'app-auth',
//   imports: [CommonModule, FormsModule],
//   template: `
// <div class="row justify-content-center">
//   <div class="col-md-6">
//     <div class="card shadow-sm">
//       <div class="card-body">
//         <h4 class="mb-3">{{ mode === 'login' ? 'Login' : 'Register' }}</h4>

//         <form (ngSubmit)="submit()">
//           <div *ngIf="mode==='register'" class="row g-2">
//             <div class="col-md-6">
//               <label class="form-label">Name</label>
//               <input [(ngModel)]="registerForm.name" name="name" class="form-control" required>
//             </div>
//             <div class="col-md-6">
//               <label class="form-label">Phone</label>
//               <input [(ngModel)]="registerForm.phone" name="phone" class="form-control" required>
//             </div>
//             <div class="col-12">
//               <label class="form-label">Address</label>
//               <input [(ngModel)]="registerForm.address" name="address" class="form-control" required>
//             </div>
//           </div>

//           <div class="mt-2">
//             <label class="form-label">Email</label>
//             <input [(ngModel)]="email" name="email" type="email" class="form-control" required>
//           </div>

//           <div class="mt-2">
//             <label class="form-label">Password</label>
//             <input [(ngModel)]="password" name="password" type="password" class="form-control" required>
//           </div>

//           <button class="btn btn-primary mt-3" type="submit">
//             {{ mode === 'login' ? 'Login' : 'Create account' }}
//           </button>
//           <button class="btn btn-link mt-3" type="button" (click)="toggle()">
//             {{ mode==='login' ? 'New here? Register' : 'Already have an account? Login' }}
//           </button>

//           <div class="alert alert-info mt-3">
//             Tip: use <b>admin@bookhive.com</b> to simulate an admin login for now.
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
// </div>
//   `
// })
// export class AuthComponent {
//   mode: 'login' | 'register' = 'login';
//   email = '';
//   password = '';
//   registerForm = { name: '', phone: '', address: '' };

//   constructor(private auth: AuthService, private router: Router) {}
//   toggle(){ this.mode = this.mode === 'login' ? 'register' : 'login'; }

//   submit() {
//     if (this.mode === 'login') {
//       this.auth.login({ email: this.email, password: this.password });
//     } else {
//       this.auth.register({
//         name: this.registerForm.name,
//         email: this.email,
//         phone: this.registerForm.phone,
//         address: { line: this.registerForm.address },
//         password: this.password
//       });
//     }
//     this.router.navigateByUrl('/');
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  template: `
<h3>Login / Register</h3>

<div class="card p-3">
  <div class="btn-group mb-3">
    <button class="btn" [class.btn-primary]="mode==='login'" [class.btn-outline-primary]="mode!=='login'" (click)="switch('login')">Login</button>
    <button class="btn" [class.btn-primary]="mode==='register'" [class.btn-outline-primary]="mode!=='register'" (click)="switch('register')">Register</button>
  </div>

  <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
  <div *ngIf="info" class="alert alert-info">{{ info }}</div>

  <form *ngIf="mode==='login'" (ngSubmit)="login()">
    <div class="mb-2">
      <label class="form-label">Email</label>
      <input class="form-control" [(ngModel)]="loginForm.email" name="lemail" required>
    </div>
    <div class="mb-2">
      <label class="form-label">Password</label>
      <input type="password" class="form-control" [(ngModel)]="loginForm.password" name="lpass" required>
    </div>
    <button class="btn btn-primary">Login</button>
  </form>

  <form *ngIf="mode==='register'" (ngSubmit)="register()">
    <div class="row g-2">
      <div class="col-md-6">
        <label class="form-label">Name</label>
        <input class="form-control" [(ngModel)]="regForm.name" name="rname" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Phone</label>
        <input class="form-control" [(ngModel)]="regForm.phone" name="rphone" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Email</label>
        <input class="form-control" [(ngModel)]="regForm.email" name="remail" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" [(ngModel)]="regForm.password" name="rpass" required>
      </div>
      <div class="col-12">
        <label class="form-label">Address</label>
        <input class="form-control" [(ngModel)]="regForm.address.line" name="raddr" required>
      </div>
    </div>
    <button class="btn btn-primary mt-3">Register</button>
  </form>
</div>
  `
})
export class AuthComponent {
  mode: 'login'|'register' = 'login';
  error = ''; info = '';

  loginForm = { email: '', password: '' };
  regForm = { name: '', email: '', phone: '', password: '', address: { line: '' } };

  constructor(private auth: AuthService, private router: Router) {}

  switch(m: 'login'|'register'){ this.mode = m; this.error = ''; this.info = ''; }

  async login(){
    this.error=''; this.info='';
    try {
      await this.auth.login(this.loginForm);
      this.router.navigateByUrl('/');
    } catch (e) {
      const err = e as HttpErrorResponse;
      this.error = (err.error?.message) || 'Login failed. Check your email/password.';
    }
  }

  async register(){
    this.error=''; this.info='';
    try {
      await this.auth.register(this.regForm as any);
      this.info = 'Registered successfully. You are now logged in.';
      this.router.navigateByUrl('/');
    } catch (e) {
      const err = e as HttpErrorResponse;
      this.error = (err.error?.message) || 'Registration failed.';
    }
  }
}
