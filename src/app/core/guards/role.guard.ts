import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const router = inject(Router);

  // Check authentication first
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Check role from AuthService (current user subject)
  const user = authService.getCurrentUser();
  if (user && requiredRoles.includes(user.role)) {
    return true;
  }

  // Fallback: Check role directly from localStorage
  const roleFromStorage = storageService.getUserRole();
  if (roleFromStorage && requiredRoles.includes(roleFromStorage)) {
    return true;
  }

  // User doesn't have required role - redirect to unauthorized or login
  router.navigate(['/auth/login'], { 
    queryParams: { 
      error: 'unauthorized',
      message: 'You do not have permission to access this page.'
    } 
  });
  return false;
};



