import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BillingService {
    private apiUrl = environment.apiUrl + '/billing';

    constructor(private http: HttpClient) { }

    // ===== Admin endpoints =====

    getInvoices(filters: any = {}): Observable<any> {
        return this.http.get(this.apiUrl, { params: filters });
    }

    getInvoiceById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    generateRent(): Observable<any> {
        return this.http.post(this.apiUrl, {});
    }

    payInvoice(id: string, paymentData: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/pay`, paymentData);
    }

    markLateInvoices(): Observable<any> {
        return this.http.post(`${this.apiUrl}/mark-late`, {});
    }

    // ===== Boutique (shop owner) endpoints =====

    getMyInvoices(filters: any = {}): Observable<any> {
        return this.http.get(`${this.apiUrl}/my-invoices`, { params: filters });
    }

    getMyBillingSummary(): Observable<any> {
        return this.http.get(`${this.apiUrl}/my-summary`);
    }
}
