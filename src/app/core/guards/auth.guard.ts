import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('angular_token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    router.navigate(['/login']);
    return false;
  }

  // If password is expired, only allow the change-password route through
  const passwordExpired = localStorage.getItem('passwordExpired') === 'true';
  if (passwordExpired && !state.url.startsWith('/change-password')) {
    router.navigate(['/change-password']);
    return false;
  }

  return true;
};
