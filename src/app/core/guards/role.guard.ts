import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const user = authService.getCurrentUser();
  if (user && requiredRoles.includes(user.role)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};



