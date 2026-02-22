import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, switchMap, take } from 'rxjs/operators';

/**
 * Guard to prevent authenticated users from accessing "Guest-only" pages 
 * like Login and Register.
 */
export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.initialised$.pipe(
        filter(init => init === true),
        take(1),
        switchMap(() => authService.user$),
        take(1),
        map(user => {
            if (user) {
                // User is already logged in, redirect to their respective dashboard
                switch (user.role) {
                    case 2: router.navigate(['/admin']); break;
                    case 1: router.navigate(['/shop']); break;
                    case 0: router.navigate(['/customer']); break;
                    default: router.navigate(['/customer']); break;
                }
                return false;
            }
            return true;
        })
    );
};
