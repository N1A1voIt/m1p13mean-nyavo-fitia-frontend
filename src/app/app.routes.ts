import { Routes } from '@angular/router';
import {roleGuard} from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent),
    children: [],
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  }


];
