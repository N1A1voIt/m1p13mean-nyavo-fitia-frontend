import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FinanceService {
    private apiUrl = environment.apiUrl + '/finance';

    constructor(private http: HttpClient) { }

    getGlobalStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/stats`);
    }
}
