import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  if (!authService.isAuthenticated()) {
    const router = inject(Router);
    router.navigate(['/sing-in']);
    return false;
  }
  return true;
};
