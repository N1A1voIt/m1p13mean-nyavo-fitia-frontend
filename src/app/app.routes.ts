import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./shared/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./shared/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'complete-profile',
    loadComponent: () => import('./shared/components/complete-profile/complete-profile.component').then(m => m.CompleteProfileComponent)
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
    loadComponent: () => import('./shared/components/login/login.component').then(m => m.LoginComponent), // Placeholder
    canActivate: [roleGuard],
    data: { role: 'SHOP' }
  },
  {
    path: 'customer',
    loadComponent: () => import('./shared/components/login/login.component').then(m => m.LoginComponent), // Placeholder
    canActivate: [roleGuard],
    data: { role: 'CUSTOMER' }
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
