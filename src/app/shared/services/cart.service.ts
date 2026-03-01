import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = environment.apiUrl + '/cart';

    constructor(private http: HttpClient) { }

    getCart(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    updateCart(items: any[]): Observable<any> {
        return this.http.put(this.apiUrl, { items: items.map(item => ({ product: item.product._id, quantity: item.quantity })) });
    }

    clearCart(): Observable<any> {
        return this.http.delete(this.apiUrl);
    }
}
