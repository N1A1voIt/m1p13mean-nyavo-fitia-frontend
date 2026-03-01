import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BoxService {
    private apiUrl = environment.apiUrl + '/boxes';

    constructor(private http: HttpClient) { }

    getBoxes(filters: any = {}): Observable<any> {
        return this.http.get(this.apiUrl, { params: filters });
    }

    getBox(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    createBox(boxData: any): Observable<any> {
        return this.http.post(this.apiUrl, boxData);
    }

    updateBox(id: string, boxData: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}`, boxData);
    }

    deleteBox(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    assignTenant(id: string, assignmentData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/assign`, assignmentData);
    }

    releaseTenant(id: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/release`, {});
    }

    getBoxContract(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}/contract`);
    }
}
