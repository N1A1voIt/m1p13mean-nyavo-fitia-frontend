import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ShopService } from '../../../core/services/shop.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { PosComponent } from '../pos/pos.component';
import { OrdersInboxComponent } from '../orders-inbox/orders-inbox.component';
import { ShopListComponent } from '../shop-list/shop-list.component';
import { StockMovementsComponent } from '../stock-movements/stock-movements.component';
import { BoxRequestComponent } from '../box-request/box-request.component';

@Component({
    selector: 'app-shop-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        CardComponent,
        BadgeComponent,
        InventoryComponent,
        PosComponent,
        OrdersInboxComponent,
        ShopListComponent,
        StockMovementsComponent,
        BoxRequestComponent
    ],
    templateUrl: './shop-dashboard.component.html',
    styleUrl: './shop-dashboard.component.css'
})
export class ShopDashboardComponent {
    private authService = inject(AuthService);
    public shopService = inject(ShopService);

    user = this.authService.currentUserValue;
    selectedShop$ = this.shopService.selectedShop$;

    currentTab: 'inventory' | 'pos' | 'orders' | 'movements' | 'box-request' = 'inventory';

    setTab(tab: 'inventory' | 'pos' | 'orders' | 'movements' | 'box-request') {
        this.currentTab = tab;
    }

    switchShop() {
        this.shopService.clearSelectedShop();
    }

    logout() {
        this.authService.logout();
    }
}
