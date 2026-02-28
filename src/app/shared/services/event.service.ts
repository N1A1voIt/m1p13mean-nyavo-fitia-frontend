import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = environment.apiUrl + '/events';

    constructor(private http: HttpClient) { }

    getEventMeta(): Observable<any> {
        return this.http.get(`${this.apiUrl}/meta`);
    }

    getEvents(start?: string, end?: string): Observable<any> {
        const params: any = {};
        if (start) params.start = start;
        if (end) params.end = end;
        return this.http.get(this.apiUrl, { params });
    }

    createEvent(eventData: any): Observable<any> {
        return this.http.post(this.apiUrl, eventData);
    }

    updateEvent(id: string, eventData: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}`, eventData);
    }

    deleteEvent(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
