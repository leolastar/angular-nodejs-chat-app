import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (_route, _state) => {
  const tokens = localStorage.getItem('tokens');
  if (!tokens) {
    const router = new Router();
    router.navigate(['/sign-in']);
    return false;
  }
  return true;
};
