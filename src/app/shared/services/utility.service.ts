import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    private apiUrl = environment.apiUrl + '/utilities';

    constructor(private http: HttpClient) { }

    addReading(readingData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/readings`, readingData);
    }

    getReadingsByBox(boxId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/readings/${boxId}`);
    }

    generateUtilityInvoices(): Observable<any> {
        return this.http.post(`${this.apiUrl}/generate-invoices`, {});
    }
}
