// import { inject } from '@angular/core';
// import { CanActivateFn, Router, UrlTree } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// export const authGuard: CanActivateFn = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   const token = auth.token();
//   if (token) return true;

//   // not logged in -> go to /auth with redirect
//   return router.createUrlTree(['/auth'], { queryParams: { redirect: location.pathname } });
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('bh_token');
  if (token) return true;
  const router = inject(Router);
  return router.createUrlTree(['/auth'], { queryParams: { redirect: location.pathname } });
};
