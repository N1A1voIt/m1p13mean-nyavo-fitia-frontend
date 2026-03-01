import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopERPService } from '../../shared/services/shop-erp.service';
import { SaleService } from '../../shared/services/sale.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css'
})
export class POSComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery = '';
  cart: any[] = [];
  subtotal = 0;
  shopId = '';
  loyaltyCode = '';

  constructor(private shopERPService: ShopERPService, private saleService: SaleService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user?.shopId) {
        this.shopId = user.shopId;
        this.shopERPService.getProducts(this.shopId, { active: true }).subscribe(res => {
          this.products = res.data;
          this.filteredProducts = res.data;
        });
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addToCart(product: any): void {
    const existing = this.cart.find(item => item.productId === product._id);
    if (existing) {
      existing.quantity++;
      existing.total = existing.quantity * existing.price;
    } else {
      this.cart.push({
        productId: product._id,
        name: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      });
    }
    this.calculateTotal();
  }

  removeFromCart(item: any): void {
    this.cart = this.cart.filter(i => i !== item);
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.subtotal = this.cart.reduce((acc, item) => acc + item.total, 0);
  }

  checkout(): void {
    const saleData = {
      shopId: this.shopId,
      items: this.cart,
      totalAmount: this.subtotal,
      paymentMethod: 'Cash',
      loyaltyCode: this.loyaltyCode
    };

    this.saleService.processSale(saleData).subscribe(() => {
      alert('Sale Completed!');
      this.loyaltyCode = '';
      this.cart = [];
      this.calculateTotal();
      this.ngOnInit();
    });
  }
}
