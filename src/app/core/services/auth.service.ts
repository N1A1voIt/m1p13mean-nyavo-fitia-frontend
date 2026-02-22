/* Reference: AI_CONTEXT_FRONTEND.md */
import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

export interface UserProfile {
    id: string;
    uid: string;
    email: string;
    name: string;
    role: number; // 0: User, 1: Shop, 2: Admin
    username?: string;
}

export interface AuthResponse {
    success: boolean;
    status: number;
    data: {
        user: UserProfile;
        firebaseToken: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private apiService = inject(ApiService);
    private router = inject(Router);

    private userSubject = new BehaviorSubject<UserProfile | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    public user$ = this.userSubject.asObservable();

    private idTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('idToken'));
    public idToken$ = this.idTokenSubject.asObservable();

    constructor() {
        // Listen to Firebase Auth state
        user(this.auth).subscribe(async (fbUser) => {
            if (fbUser) {
                const token = await fbUser.getIdToken();
                this.idTokenSubject.next(token);
                localStorage.setItem('idToken', token);
            } else {
                this.logoutLocally();
            }
        });
    }

    get currentUserValue(): UserProfile | null {
        return this.userSubject.value;
    }

    get currentToken(): string | null {
        return this.idTokenSubject.value;
    }

    /**
     * Google Login Flow
     */
    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
            const token = await result.user.getIdToken();

            this.loginWithBackend({ idToken: token }).subscribe({
                next: (response) => {
                    this.handleAuthSuccess(response);
                },
                error: (err) => {
                    if (err.status === 404) {
                        // User authenticated in Firebase but not in DB
                        this.router.navigate(['/complete-profile']);
                    } else {
                        console.error('Backend Login Error', err);
                    }
                }
            });
        } catch (error) {
            console.error('Google Auth Error', error);
        }
    }

    /**
     * Email/Password Login
     */
    login(email: string, password: string): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>(`/auth/login`, { email, password })
            .pipe(
                tap(res => this.handleAuthSuccess(res))
            );
    }

    /**
     * Registration
     */
    register(userData: any): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>(`/auth/register`, userData)
            .pipe(
                tap(res => this.handleAuthSuccess(res))
            );
    }

    /**
     * Sync social login or verify token
     */
    private loginWithBackend(payload: { idToken: string }): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>(`/auth/login`, payload);
    }

    private handleAuthSuccess(response: AuthResponse) {
        if (response.success && response.data) {
            this.userSubject.next(response.data.user);
            this.idTokenSubject.next(response.data.firebaseToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('idToken', response.data.firebaseToken);

            // Redirect based on role
            this.redirectByRole(response.data.user.role);
        }
    }

    private redirectByRole(role: number) {
        switch (role) {
            case 2: this.router.navigate(['/admin']); break;
            case 1: this.router.navigate(['/shop']); break;
            case 0: this.router.navigate(['/customer']); break;
            default: this.router.navigate(['/customer']); break;
        }
    }

    private logoutLocally() {
        this.userSubject.next(null);
        this.idTokenSubject.next(null);
        localStorage.removeItem('user');
        localStorage.removeItem('idToken');
    }

    async logout() {
        await signOut(this.auth);
        this.logoutLocally();
        this.router.navigate(['/login']);
    }
}
