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
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      return authService.initialised$.pipe(
        filter(init => init === true),
        take(1),
        map(() => {
          const user = authService.currentUserValue;
          if (!user) return router.parseUrl('/login');
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
    path: 'mall-plan',
    loadComponent: () => import('./features/customer/mall-plan/mall-plan.component').then(m => m.MallPlanComponent),
    canActivate: [],
    data: { role: 'CUSTOMER' }
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  { path: '**', redirectTo: '' }
];
