import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService, Shop } from '../../../core/services/shop.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-shop-list',
    standalone: true,
    imports: [CommonModule, CardComponent, ButtonComponent, InputComponent, BadgeComponent, FormsModule],
    templateUrl: './shop-list.component.html',
    styleUrl: './shop-list.component.css'
})
export class ShopListComponent implements OnInit {
    private shopService = inject(ShopService);

    shops: Shop[] = [];
    loading = true;
    showCreateForm = false;

    newShop = {
        name: '',
        boxId: ''
    };

    ngOnInit() {
        this.loadShops();
    }

    loadShops() {
        this.loading = true;
        this.shopService.getShops().subscribe({
            next: (res) => {
                this.shops = res.data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    onSelectShop(shop: Shop) {
        this.shopService.selectShop(shop);
    }

    onCreateShop() {
        if (!this.newShop.name) return;

        this.shopService.createShop({ name: this.newShop.name }).subscribe({
            next: (res) => {
                this.shops.push(res.data);
                this.showCreateForm = false;
                this.newShop = { name: '', boxId: '' };
            }
        });
    }

    requestStatuses: { [shopId: string]: string } = {};

    requestBox(shop: Shop, event: Event) {
        event.stopPropagation();
        this.requestStatuses[shop._id] = 'PENDING';
        
        this.shopService.requestBox(shop._id).subscribe({
            next: () => {
                this.requestStatuses[shop._id] = 'SENT';
            },
            error: (err) => {
                this.requestStatuses[shop._id] = '';
                alert(err?.error?.error || 'Failed to send request');
            }
        });
    }
}
