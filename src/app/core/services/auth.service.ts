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

    private userSubject = new BehaviorSubject<UserProfile | null>(null);
    public user$ = this.userSubject.asObservable();

    private idTokenSubject = new BehaviorSubject<string | null>(this.getValidToken());
    public idToken$ = this.idTokenSubject.asObservable();

    private initialisedSubject = new BehaviorSubject<boolean>(false);
    public initialised$ = this.initialisedSubject.asObservable();

    constructor() {
        // We no longer call initialiseAuth() here to avoid Circular DI with HttpClient/Interceptors
        // It will be called by APP_INITIALIZER or manually
    }

    /**
     * Sanitizes token retrieval from localStorage.
     */
    private getValidToken(): string | null {
        let token = localStorage.getItem('idToken');
        if (!token || token === 'undefined' || token === 'null') return null;
        return token.replace(/^"(.*)"$/, '$1');
    }

    /**
     * Main initialisation logic. Returns a promise for APP_INITIALIZER.
     */
    public async initialiseAuth(): Promise<void> {
        const token = this.getValidToken();

        if (token) {
            this.idTokenSubject.next(token);
            try {
                const res = await firstValueFrom(this.getMe());
                if (res.success && res.data.user) {
                    this.userSubject.next(res.data.user);
                } else {
                    this.logoutLocally();
                }
            } catch (err) {
                console.warn('Auth initialisation failed. Token might be invalid.', err);
                // Don't auto-logout on network error, only on 401/403 which errorInterceptor handles
            }
        }

        // Keep Firebase state in sync
        user(this.auth).subscribe(async (fbUser) => {
            if (fbUser) {
                const newToken = await fbUser.getIdToken();
                if (newToken && newToken !== this.currentToken) {
                    this.saveToken(newToken);
                    this.getMe().subscribe(res => {
                        if (res.success) this.userSubject.next(res.data.user);
                    });
                }
            }
        });

        this.initialisedSubject.next(true);
    }

    private saveToken(token: string) {
        localStorage.setItem('idToken', token);
        this.idTokenSubject.next(token);
    }

    get currentUserValue(): UserProfile | null {
        return this.userSubject.value;
    }

    get currentToken(): string | null {
        return this.idTokenSubject.value;
    }

    async loginWithGoogle(): Promise<void> {
        try {
            const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
            const token = await result.user.getIdToken();

            await firstValueFrom(this.loginWithBackend({ idToken: token }).pipe(
                tap((response) => this.handleAuthSuccess(response))
            ));
        } catch (error: any) {
            if (error?.status === 404) this.router.navigate(['/complete-profile']);
            else console.error('Google Auth Error', error);
        }
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>(`/auth/login`, { email, password })
            .pipe(tap(res => this.handleAuthSuccess(res)));
    }

    register(userData: any): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>(`/auth/register`, userData)
            .pipe(tap(res => this.handleAuthSuccess(res)));
    }

    getMe(): Observable<any> {
        return this.apiService.get<any>(`/auth/me`);
    }

    private loginWithBackend(payload: { idToken: string }): Observable<AuthResponse> {
        return this.apiService.post<AuthResponse>(`/auth/login`, payload);
    }

    private handleAuthSuccess(response: AuthResponse) {
        if (response.success && response.data) {
            this.userSubject.next(response.data.user);
            const token = response.data.firebaseToken;
            if (token) this.saveToken(token);
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

    public logoutLocally() {
        this.userSubject.next(null);
        this.idTokenSubject.next(null);
        localStorage.removeItem('idToken');
    }

    async logout() {
        try { await signOut(this.auth); } catch (e) { }
        this.logoutLocally();
        this.router.navigate(['/login']);
    }
}
