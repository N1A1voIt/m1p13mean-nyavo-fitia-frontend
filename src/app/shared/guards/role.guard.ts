import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

/**
 * RoleGuard prevents users from accessing routes for which they don't have the required role.
 */
export const roleGuard: (allowedRoles: string[]) => CanActivateFn = (allowedRoles) => {
    return (route, state) => {
        const router = inject(Router);
        const authService = inject(AuthService);

        return authService.user$.pipe(
            take(1),
            map(user => {
                if (!user) {
                    return router.createUrlTree(['/login']);
                }

                if (allowedRoles.includes(user.role)) {
                    return true;
                }

                // Redirect to a default page or unauthorized page if the user doesn't have permissions
                return router.createUrlTree(['/unauthorized']);
            })
        );
    };
};
