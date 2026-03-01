import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = environment.apiUrl + '/notifications';
    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient) { }

    getNotifications(unreadOnly = false): Observable<any> {
        const params: any = {};
        if (unreadOnly) params.unread = 'true';
        return this.http.get(this.apiUrl, { params });
    }

    refreshUnreadCount(): void {
        this.http.get<any>(`${this.apiUrl}/unread-count`).subscribe({
            next: (res) => this.unreadCountSubject.next(res.data.count),
            error: () => this.unreadCountSubject.next(0)
        });
    }

    markAsRead(id: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/read`, {}).pipe(
            tap(() => this.refreshUnreadCount())
        );
    }

    markAllAsRead(): Observable<any> {
        return this.http.patch(`${this.apiUrl}/read-all`, {}).pipe(
            tap(() => this.unreadCountSubject.next(0))
        );
    }
}
