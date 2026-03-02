import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoyaltyService {
    private apiUrl = environment.apiUrl + '/loyalty';

    constructor(private http: HttpClient) { }

    getMyLoyalty(): Observable<any> {
        return this.http.get(`${this.apiUrl}/me`);
    }
}
