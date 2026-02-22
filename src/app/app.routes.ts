import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./shared/components/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./shared/components/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'complete-profile',
    loadComponent: () => import('./shared/components/complete-profile/complete-profile.component').then(m => m.CompleteProfileComponent),
    // Only users without a role yet can access this
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      return authService.initialised$.pipe(
        filter(init => init === true),
        take(1),
        map(() => {
          const user = authService.currentUserValue;
          if (!user) return router.parseUrl('/login');
          // If they already have a role, they don't need to be here
          if (user.role !== undefined && user.role !== null) {
            router.navigate(['/']);
            return false;
          }
          return true;
        })
      );
    }]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop-dashboard/shop-dashboard.component').then(m => m.ShopDashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'SHOP' }
  },
  {
    path: 'customer',
    loadComponent: () => import('./features/customer/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'CUSTOMER' }
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      return authService.initialised$.pipe(
        filter(init => init === true),
        take(1),
        map(() => {
          const user = authService.currentUserValue;
          if (!user) return router.parseUrl('/login');

          switch (user.role) {
            case 2: return router.parseUrl('/admin');
            case 1: return router.parseUrl('/shop');
            case 0: return router.parseUrl('/customer');
            default: return router.parseUrl('/login');
          }
        })
      );
    }]
  },
  { path: '**', redirectTo: '' }
];
