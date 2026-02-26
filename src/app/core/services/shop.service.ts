import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Shop {
    _id: string;
    name: string;
    shopRef: string;
    boxId?: string;
}

export interface BoxRequest {
    _id: string;
    shop: string | Shop;
    status: 'PENDING' | 'ASSIGNED' | 'REJECTED';
    assignedBox?: string;
    createdAt?: string;
}

export interface Product {
    _id?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
    createdAt?: Date;
}

export interface TransactionItem {
    productId: string;
    quantity: number;
    priceAtSale: number;
    name?: string;
}

export interface Transaction {
    _id?: string;
    type: 'SALE' | 'ORDER';
    items: TransactionItem[];
    totalAmount: number;
    status: 'COMPLETED' | 'PENDING' | 'PICKED_UP' | 'CANCELLED';
    createdAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    private apiService = inject(ApiService);

    private selectedShopSubject = new BehaviorSubject<Shop | null>(this.getSavedShop());
    public selectedShop$ = this.selectedShopSubject.asObservable();

    /**
     * Shop Management
     */
    getShops(): Observable<any> {
        return this.apiService.get<any>('/shop/list');
    }

    getAllShops(): Observable<any> {
        return this.apiService.get<any>('/shop/all');
    }

    createShop(shopData: { name: string, boxId?: string }): Observable<any> {
        return this.apiService.post<any>('/shop', shopData);
    }

    assignBox(shopId: string, boxId: string): Observable<any> {
        return this.apiService.patch<any>(`/shop/${shopId}/box`, { boxId });
    }

    /**
     * Box Request Management
     */
    requestBox(shopId: string): Observable<any> {
        return this.apiService.post('/box-requests', { shop: shopId });
    }

    getBoxRequest(shopId: string): Observable<any> {
        return this.apiService.get(`/box-requests/shop/${shopId}`);
    }

    getMyBoxRequests(): Observable<{ data: { requests: BoxRequest[] } }> {
        return this.apiService.get('/box-requests/mine');
    }

    getAllBoxRequests(): Observable<{ data: { requests: any[] } }> {
        return this.apiService.get('/box-requests');
    }

    assignBoxToRequest(requestId: string, boxId: string): Observable<any> {
        return this.apiService.patch(`/box-requests/${requestId}/assign`, { assignedBox: boxId });
    }

    selectShop(shop: Shop) {
        localStorage.setItem('activeShop', JSON.stringify(shop));
        this.selectedShopSubject.next(shop);
    }

    clearSelectedShop() {
        localStorage.removeItem('activeShop');
        this.selectedShopSubject.next(null);
    }

    private getSavedShop(): Shop | null {
        const saved = localStorage.getItem('activeShop');
        if (!saved) return null;
        try {
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }

    get activeShopId(): string | null {
        return this.selectedShopSubject.value?._id || null;
    }

    /**
     * Inventory
     */
    getProducts(): Observable<any> {
        return this.apiService.get<any>('/shop/products');
    }

    addProduct(product: Product): Observable<any> {
        return this.apiService.post<any>('/shop/products', product);
    }

    updateProduct(id: string, product: Partial<Product>): Observable<any> {
        return this.apiService.put<any>(`/shop/products/${id}`, product);
    }

    /**
     * POS
     */
    processSale(items: TransactionItem[]): Observable<any> {
        return this.apiService.post<any>('/shop/sales', { items });
    }

    /**
     * Orders
     */
    getOrders(): Observable<any> {
        return this.apiService.get<any>('/shop/orders');
    }

    markOrderAsPickedUp(orderId: string): Observable<any> {
        return this.apiService.patch<any>(`/shop/orders/${orderId}/pickup`, {});
    }

    /**
     * Stock Movements
     */
    getMovements(): Observable<any> {
        return this.apiService.get<any>('/shop/movements');
    }
}
