import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService, Product } from '../../../core/services/shop.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-inventory',
    standalone: true,
    imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent, InputComponent, FormsModule],
    templateUrl: './inventory.component.html',
    styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
    private shopService = inject(ShopService);

    products: Product[] = [];
    loading = true;
    showAddForm = false;

    newProduct: Product = {
        name: '',
        price: 0,
        quantity: 0,
        category: ''
    };

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading = true;
        this.shopService.getProducts().subscribe({
            next: (res) => {
                this.products = res.data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    onAddProduct() {
        this.shopService.addProduct(this.newProduct).subscribe({
            next: () => {
                this.loadProducts();
                this.showAddForm = false;
                this.newProduct = { name: '', price: 0, quantity: 0, category: '' };
            },
            error: (err) => {
                alert(err.error?.message || 'Failed to add product');
            }
        });
    }

    updateStock(product: Product, change: number) {
        const newQty = (product.quantity || 0) + change;
        if (newQty < 0) return;

        this.shopService.updateProduct(product._id!, { quantity: newQty }).subscribe({
            next: (res) => {
                product.quantity = res.data.quantity;
            },
            error: (err) => {
                alert(err.error?.message || 'Failed to update stock');
            }
        });
    }
}
