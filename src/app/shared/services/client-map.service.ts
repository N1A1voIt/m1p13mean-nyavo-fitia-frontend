import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClientMapService {
    private apiUrl = environment.apiUrl + '/map';

    constructor(private http: HttpClient) { }

    getMapShops(): Observable<any> {
        return this.http.get(`${this.apiUrl}/shops`);
    }

    getShopDetail(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/detail/${id}`);
    }

    getMarketplace(filters: any = {}): Observable<any> {
        return this.http.get(`${this.apiUrl}/marketplace`, { params: filters });
    }

    getFixedItems(floor?: number): Observable<any> {
        const params: any = floor !== undefined ? { floor } : {};
        return this.http.get(`${this.apiUrl}/fixed-items`, { params });
    }

    createFixedItem(item: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/fixed-items`, item);
    }

    updateFixedItem(id: string, item: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/fixed-items/${id}`, item);
    }

    deleteFixedItem(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/fixed-items/${id}`);
    }
}
