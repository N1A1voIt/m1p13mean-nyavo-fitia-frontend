import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, switchMap, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth to finish initialising (e.g. fetching profile from backend on refresh)
  return authService.initialised$.pipe(
    filter(init => init === true),
    take(1),
    switchMap(() => authService.user$),
    take(1),
    map(user => {
      console.log(user);
      if (!user) {
        // No user found after initialization
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
    })
  );
};
