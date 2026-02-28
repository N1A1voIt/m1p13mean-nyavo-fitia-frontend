import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShopERPService {
    private apiUrl = environment.apiUrl + '/shop-erp';

    constructor(private http: HttpClient) { }

    getProducts(shopId: string, filters: any = {}): Observable<any> {
        return this.http.get(this.apiUrl, { params: { shopId, ...filters } });
    }

    addProduct(productData: any): Observable<any> {
        return this.http.post(this.apiUrl, productData);
    }

    updateProduct(id: string, productData: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}`, productData);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getAccountingStats(shopId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/accounting/${shopId}`);
    }

    getStockMovements(shopId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/stock-movements`, { params: { shopId } });
    }

    recordStockMovement(movementData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/stock-movements`, movementData);
    }
}
