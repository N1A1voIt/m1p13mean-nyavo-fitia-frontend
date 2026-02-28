import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    isLogin = true;
    loading = false;
    error = '';

    // Form Fields
    name = '';
    email = '';
    password = '';
    role = 'client';

    constructor(private authService: AuthService, private router: Router) {
        // If user is already logged in, redirect them to the home (portal selector)
        if (this.authService.getToken()) {
            this.router.navigate(['/']);
        }
    }

    login() {
        this.loading = true;
        this.error = '';
        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: (res) => {
                this.loading = false;
                this.redirectByRole(res.user.role);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error.message || 'Authentication failed. Please check your credentials.';
            }
        });
    }

    register() {
        this.loading = true;
        this.error = '';
        const userData = {
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role
        };

        this.authService.register(userData).subscribe({
            next: (res) => {
                this.loading = false;
                this.redirectByRole(res.user.role);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error.message || 'Registration failed.';
            }
        });
    }

    private redirectByRole(role: string) {
        switch (role) {
            case 'admin':
                this.router.navigate(['/admin']);
                break;
            case 'boutique':
                this.router.navigate(['/shop']);
                break;
            case 'client':
                this.router.navigate(['/mall']);
                break;
            default:
                this.router.navigate(['/']);
        }
    }
}
