import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUserValue;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole = route.data['role'];
  const roleMap: { [key: string]: number } = {
    'CUSTOMER': 0,
    'SHOP': 1,
    'ADMIN': 2
  };

  if (user.role !== roleMap[expectedRole]) {
    // If not authorized, redirect to their default home
    router.navigate(['/']);
    return false;
  }

  return true;
};
