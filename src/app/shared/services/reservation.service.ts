import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private apiUrl = environment.apiUrl + '/reservations';

    constructor(private http: HttpClient) { }

    createReservation(reservationData: any): Observable<any> {
        return this.http.post(this.apiUrl, reservationData);
    }

    getMyReservations(): Observable<any> {
        return this.http.get(`${this.apiUrl}/me`);
    }

    getShopReservations(shopId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/shop/${shopId}`);
    }

    updateReservation(id: string, data: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}`, data);
    }
}
