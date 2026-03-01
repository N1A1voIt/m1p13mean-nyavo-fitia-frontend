import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl + '/auth';
    private userSubject = new BehaviorSubject<any>(null);
    public user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) {
        const token = this.getToken();
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            this.userSubject.next(JSON.parse(savedUser));
            // Verify session on load
            this.getMe().subscribe();
        }
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData).pipe(
            tap((res: any) => this.handleSuccess(res))
        );
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((res: any) => this.handleSuccess(res))
        );
    }

    getMe(): Observable<any> {
        return this.http.get(`${this.apiUrl}/me`).pipe(
            tap({
                next: (res: any) => {
                    if (res.success) {
                        localStorage.setItem('user', JSON.stringify(res.data));
                        this.userSubject.next(res.data);
                    }
                },
                error: (err) => {
                    // Only logout if it's an unauthenticated error
                    if (err.status === 401 || err.status === 403) {
                        this.logout();
                    }
                }
            })
        );
    }

    private handleSuccess(res: any) {
        if (res.success && res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.userSubject.next(res.user);
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSubject.next(null);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getUsers(filters: any = {}): Observable<any> {
        return this.http.get(`${this.apiUrl}/users`, { params: filters });
    }
}
