import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ShopERPService } from '../../shared/services/shop-erp.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  products: any[] = [];
  categories: string[] = [];
  lowStockCount = 0;
  shopId: string = '';
  
  // Modals state
  isProductModalOpen = false;
  isMovementModalOpen = false;
  isAddingCategory = false;
  newCategoryName = '';
  activeTab = 'inventory'; // 'inventory' | 'movements'
  
  // Form models
  selectedProduct: any = this.getEmptyProduct();
  movementModel: any = this.getEmptyMovement();
  stockMovements: any[] = [];

  constructor(private shopERPService: ShopERPService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user?.shopId) {
        this.shopId = user.shopId;
        this.loadProducts();
        this.loadCategories();
      }
    });
  }

  loadProducts() {
    this.shopERPService.getProducts(this.shopId).subscribe(res => {
      this.products = res.data;
      this.lowStockCount = this.products.filter(p => p.stock <= p.minStockLevel).length;
    });
  }

  loadCategories() {
    this.shopERPService.getCategories(this.shopId).subscribe(res => {
      this.categories = res.data;
    });
  }

  toggleAddCategory() {
    this.isAddingCategory = !this.isAddingCategory;
    if (!this.isAddingCategory) this.newCategoryName = '';
  }

  confirmAddCategory() {
    if (this.newCategoryName.trim()) {
      if (!this.categories.includes(this.newCategoryName.trim())) {
        this.categories.push(this.newCategoryName.trim());
      }
      this.selectedProduct.category = this.newCategoryName.trim();
      this.toggleAddCategory();
    }
  }

  loadMovements() {
    this.shopERPService.getStockMovements(this.shopId).subscribe(res => {
      this.stockMovements = res.data;
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'movements') {
      this.loadMovements();
    }
  }

  getEmptyProduct() {
    return { name: '', sku: '', category: '', price: 0, buyPrice: 0, stock: 0, minStockLevel: 5, active: true };
  }

  getEmptyMovement() {
    return { productId: '', type: 'IN', quantity: 0, reason: 'Refill', notes: '' };
  }

  openProductModal(product?: any) {
    this.selectedProduct = product ? { ...product } : this.getEmptyProduct();
    this.isProductModalOpen = true;
  }

  closeProductModal() {
    this.isProductModalOpen = false;
  }

  saveProduct() {
    if (this.selectedProduct._id) {
      this.shopERPService.updateProduct(this.selectedProduct._id, this.selectedProduct).subscribe(res => {
        this.loadProducts();
        this.loadCategories();
        this.closeProductModal();
      });
    } else {
      this.shopERPService.addProduct(this.selectedProduct).subscribe(res => {
        this.loadProducts();
        this.loadCategories();
        this.closeProductModal();
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.shopERPService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  openMovementModal(product?: any) {
    this.movementModel = this.getEmptyMovement();
    if (product) {
      this.movementModel.productId = product._id;
    }
    this.isMovementModalOpen = true;
  }

  closeMovementModal() {
    this.isMovementModalOpen = false;
  }

  saveMovement() {
    this.movementModel.shopId = this.shopId;
    this.shopERPService.recordStockMovement(this.movementModel).subscribe(() => {
      this.loadProducts();
      if (this.activeTab === 'movements') this.loadMovements();
      this.closeMovementModal();
    });
  }
}
