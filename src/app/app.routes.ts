import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';

import { PortalSelectorComponent } from './components/portal-selector.component';
import { UnauthorizedComponent } from './components/auth/unauthorized.component';
import { LoginComponent } from './components/auth/login.component';
import { ShopLayoutComponent } from './layout/shop-layout.component';
import { InventoryComponent } from './components/shop-erp/inventory.component';
import { POSComponent } from './components/pos/pos.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '', component: PortalSelectorComponent },
    {
        path: 'shop',
        component: ShopLayoutComponent,
        canActivate: [authGuard, roleGuard(['boutique', 'admin'])],
        children: [
            { path: 'inventory', component: InventoryComponent },
            { path: 'pos', component: POSComponent },
            // { path: 'orders', component: OrderManagementComponent },
            // { path: 'accounting', component: ShopAccountingComponent },
            // { path: 'billing', component: ShopBillingComponent },
            // { path: '', redirectTo: 'inventory', pathMatch: 'full' }
        ]
    },
];
