import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    // User is logged in, allow access
    return true;
  }
  
  // User is not logged in, redirect to login page with return URL
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
}; 