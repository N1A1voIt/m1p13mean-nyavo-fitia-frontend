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

        this.shopService.createShop(this.newShop).subscribe({
            next: (res) => {
                this.shops.push(res.data);
                this.showCreateForm = false;
                this.newShop = { name: '', boxId: '' };
                // Automatically select the newly created shop
                this.onSelectShop(res.data);
            }
        });
    }
}
