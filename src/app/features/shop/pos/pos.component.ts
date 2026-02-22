import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService, Product } from '../../../core/services/shop.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
    selector: 'app-pos',
    standalone: true,
    imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent],
    templateUrl: './pos.component.html',
    styleUrl: './pos.component.css'
})
export class PosComponent implements OnInit {
    private shopService = inject(ShopService);

    products: Product[] = [];
    loading = true;
    processingSale = false;

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.shopService.getProducts().subscribe({
            next: (res) => {
                this.products = res.data;
                this.loading = false;
            }
        });
    }

    quickSale(product: Product) {
        if (this.processingSale || (product.quantity || 0) <= 0) return;

        this.processingSale = true;
        const saleItem = {
            productId: product._id!,
            quantity: 1,
            priceAtSale: product.price
        };

        this.shopService.processSale([saleItem]).subscribe({
            next: () => {
                // Optimistic update
                product.quantity = (product.quantity || 0) - 1;
                this.processingSale = false;
            },
            error: (err) => {
                alert(err.error?.message || 'Sale failed');
                this.processingSale = false;
            }
        });
    }
}
