import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService, Transaction } from '../../../core/services/shop.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
    selector: 'app-orders-inbox',
    standalone: true,
    imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent],
    templateUrl: './orders-inbox.component.html',
    styleUrl: './orders-inbox.component.css'
})
export class OrdersInboxComponent implements OnInit {
    private shopService = inject(ShopService);

    orders: Transaction[] = [];
    loading = true;

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.shopService.getOrders().subscribe({
            next: (res) => {
                this.orders = res.data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    onPickedUp(orderId: string) {
        this.shopService.markOrderAsPickedUp(orderId).subscribe({
            next: () => {
                const order = this.orders.find(o => o._id === orderId);
                if (order) order.status = 'PICKED_UP';
            }
        });
    }
}
