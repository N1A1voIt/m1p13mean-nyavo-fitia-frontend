import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientMapService } from '../../shared/services/client-map.service';
import { OrderService } from '../../shared/services/order.service';
import { CartService } from '../../shared/services/cart.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css'
})
export class MarketplaceComponent implements OnInit {
  products: any[] = [];
  shops: any[] = [];
  groupedCart: { shopName: string, items: any[] }[] = [];
  search = '';
  category = '';
  shopId = '';

  cart: { product: any, quantity: number }[] = [];
  isCartOpen = false;

  constructor(private mapService: ClientMapService, private orderService: OrderService, private cartService: CartService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['shopId']) {
        this.shopId = params['shopId'];
      }
      this.loadProducts();
    });
    this.loadCart();
    this.loadShops();
  }

  clearShopFilter() {
    this.shopId = '';
    this.router.navigate(['/mall/marketplace']);
  }

  loadShops(): void {
    this.mapService.getMapShops().subscribe(res => {
      this.shops = res.data.filter((s: any) => s.status === 'Occupé');
    });
  }

  loadProducts(): void {
    const filters: any = { search: this.search, category: this.category };
    if (this.shopId) filters.shopId = this.shopId;
    this.mapService.getMarketplace(filters).subscribe(res => {
      this.products = res.data;
    });
  }

  groupCart() {
    const groups = new Map();
    this.cart.forEach(item => {
        const shopName = item.product.shopId?.currentTenant?.name || 'Unknown Store';
        if (!groups.has(shopName)) {
           groups.set(shopName, []);
        }
        groups.get(shopName).push(item);
    });
    this.groupedCart = Array.from(groups.entries()).map(([shopName, items]) => ({ shopName, items }));
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(res => {
      if (res.data && res.data.items) {
        this.cart = res.data.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity
        }));
        this.groupCart();
      }
    });
  }

  saveCart(): void {
    this.cartService.updateCart(this.cart).subscribe();
  }

  addToCart(product: any): void {
    const item = this.cart.find(c => c.product._id === product._id);
    if (item) {
        item.quantity++;
    } else {
        this.cart.push({ product, quantity: 1 });
    }
    this.groupCart();
    this.saveCart();
    this.isCartOpen = true;
  }
  
  removeFromCart(index: number) {
      this.cart.splice(index, 1);
      this.groupCart();
      this.saveCart();
  }
  
  updateQuantity(index: number, change: number) {
      if (this.cart[index].quantity + change > 0) {
          this.cart[index].quantity += change;
      } else {
          this.cart.splice(index, 1);
      }
      this.groupCart();
      this.saveCart();
  }
  
  getCartTotal(): number {
      return this.cart.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);
  }

  checkout(): void {
      if (this.cart.length === 0) return;
      
      const groups = new Map();
      this.cart.forEach(item => {
          const shopId = item.product.shopId?._id || item.product.shopId;
          if (!groups.has(shopId)) {
             groups.set(shopId, []);
          }
          groups.get(shopId).push(item);
      });
      
      const requests = Array.from(groups.entries()).map(([shopId, items]) => {
          const orderData = {
              shopId,
              items: items.map((i: any) => ({
                  productId: i.product._id,
                  name: i.product.name,
                  quantity: i.quantity,
                  price: i.product.price
              })),
              totalAmount: items.reduce((sum: number, i: any) => sum + (i.product.price * i.quantity), 0),
              type: 'ClickAndCollect'
          };
          return this.orderService.createOrder(orderData);
      });
      
      forkJoin(requests).subscribe({
          next: () => {
              alert('Orders placed successfully! Check your reservations tab.');
              this.cart = [];
              this.cartService.clearCart().subscribe();
              this.isCartOpen = false;
          },
          error: (err) => {
              console.error(err);
              alert('Error placing orders.');
          }
      });
  }
}
