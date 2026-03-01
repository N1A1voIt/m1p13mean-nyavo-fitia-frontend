import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = environment.apiUrl + '/orders';

    constructor(private http: HttpClient) { }

    getOrders(status?: string): Observable<any> {
        const params: any = {};
        if (status) params.status = status;
        return this.http.get(this.apiUrl, { params });
    }

    createOrder(orderData: any): Observable<any> {
        return this.http.post(this.apiUrl, orderData);
    }

    updateOrderStatus(orderId: string, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status });
    }

    markAsCollected(orderId: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${orderId}/collect`, {});
    }
}
