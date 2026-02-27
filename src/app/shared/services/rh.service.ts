import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RHService {
    private apiUrl = environment.apiUrl + '/rh';

    constructor(private http: HttpClient) { }

    getPlanning(filters: any = {}): Observable<any> {
        return this.http.get(`${this.apiUrl}/planning`, { params: filters });
    }

    updateShifts(userId: string, shifts: any[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/planning/shift`, { userId, shifts });
    }

    recordAttendance(attendanceData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/attendance`, attendanceData);
    }
}
