import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const sessionId = localStorage.getItem('angular_token');

  if (sessionId) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
