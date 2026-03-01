import { Routes } from '@angular/router';
// import { AdminLayoutComponent } from './layouts/admin-layout.component';
// import { ShopLayoutComponent } from './layouts/shop-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout.component';
// import { PortalSelectorComponent } from './components/portal-selector.component';
// import { LoginComponent } from './components/auth/login.component';
// import { UnauthorizedComponent } from './components/auth/unauthorized.component';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';

import { PortalSelectorComponent } from './components/portal-selector.component';
import { UnauthorizedComponent } from './components/auth/unauthorized.component';
import { LoginComponent } from './components/auth/login.component';
import { ShopLayoutComponent } from './layouts/shop-layout.component';
import { InventoryComponent } from './components/shop-erp/inventory.component';
import { POSComponent } from './components/pos/pos.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { OrderManagementComponent } from './components/orders/order-management.component';
import { ShopBillingComponent } from './components/billing/shop-billing.component';
import { ShopAccountingComponent } from './components/accounting/shop-accounting.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BoxListComponent } from './components/boxes/box-list.component';
import { MallMapComponent } from './components/map/mall-map.component';
import { BillingListComponent } from './components/billing/billing-list.component';
import { UtilityManagementComponent } from './components/utility/utility-management.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';

// Admin Imports
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { BoxListComponent } from './components/boxes/box-list.component';
// import { BillingListComponent } from './components/billing/billing-list.component';
// import { UtilityManagementComponent } from './components/utility/utility-management.component';
// import { MaintenanceComponent } from './components/maintenance/maintenance.component';
// import { EventCalendarComponent } from './components/comms/event-calendar.component';
// import { GlobalFinanceDashboardComponent } from './components/finance/finance-dashboard.component';

// Shop Imports
//import { InventoryComponent } from './components/shop-erp/inventory.component';
//import { POSComponent } from './components/pos/pos.component';
//import { OrderManagementComponent } from './components/orders/order-management.component';
//import { ShopAccountingComponent } from './components/accounting/shop-accounting.component';
//import { ShopBillingComponent } from './components/billing/shop-billing.component';

// Client Imports
//import { MallMapComponent } from './components/map/mall-map.component';
//import { MarketplaceComponent } from './components/marketplace/marketplace.component';
//import { LoyaltyDashboardComponent } from './components/loyalty/loyalty-dashboard.component';
//import { ReservationBookingComponent } from './components/reservations/reservation-booking.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '', component: PortalSelectorComponent },

    // Admin Portal
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard, roleGuard(['admin'])],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'boxes', component: BoxListComponent },
            { path: 'map', component: MallMapComponent },
            { path: 'billing', component: BillingListComponent },
            { path: 'utility', component: UtilityManagementComponent },
            { path: 'maintenance', component: MaintenanceComponent },
            // { path: 'comms', component: EventCalendarComponent },
            // { path: 'finance', component: GlobalFinanceDashboardComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Shop Portal
    {
        path: 'shop',
        component: ShopLayoutComponent,
        canActivate: [authGuard, roleGuard(['boutique', 'admin'])],
        children: [
            { path: 'inventory', component: InventoryComponent },
            { path: 'pos', component: POSComponent },
            { path: 'orders', component: OrderManagementComponent },
            { path: 'accounting', component: ShopAccountingComponent },
            { path: 'billing', component: ShopBillingComponent },
            { path: '', redirectTo: 'inventory', pathMatch: 'full' }
        ]
    },
];
