/* Reference: AI_CONTEXT_FRONTEND.md */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Welcome Back</h1>
        <p class="subtitle">Log in to your account to continue</p>
        
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required placeholder="name@example.com">
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required placeholder="••••••••">
          </div>
          
          <button type="submit" class="btn-primary" [disabled]="loading">
            <span *ngIf="!loading">Log In</span>
            <span *ngIf="loading" class="loader"></span>
          </button>
        </form>
        
        <div class="divider">
          <span>OR</span>
        </div>
        
        <button (click)="onGoogleLogin()" class="btn-google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
          Sign In with Google
        </button>
        
        <p class="footer-text">
          Don't have an account? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Inter', sans-serif;
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    
    h1 {
      color: #2d3748;
      margin-bottom: 0.5rem;
      font-size: 1.875rem;
    }
    
    .subtitle {
      color: #718096;
      margin-bottom: 2rem;
    }
    
    .form-group {
      text-align: left;
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #4a5568;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      transition: all 0.2s;
      outline: none;
    }
    
    input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .btn-primary:hover {
      background: #5a67d8;
    }
    
    .divider {
      margin: 1.5rem 0;
      position: relative;
      text-align: center;
    }
    
    .divider::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e2e8f0;
    }
    
    .divider span {
      background: #fff;
      padding: 0 10px;
      color: #a0aec0;
      font-size: 0.875rem;
      position: relative;
      background: white;
    }
    
    .btn-google {
      width: 100%;
      padding: 0.75rem;
      background: white;
      color: #4a5568;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: background 0.2s;
    }
    
    .btn-google:hover {
      background: #f7fafc;
    }
    
    .btn-google img {
      width: 20px;
    }
    
    .footer-text {
      margin-top: 2rem;
      color: #718096;
    }
    
    .footer-text a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    .loader {
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 2s linear infinite;
      display: inline-block;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
    private authService = inject(AuthService);

    email = '';
    password = '';
    loading = false;

    async onLogin() {
        this.loading = true;
        this.authService.login(this.email, this.password).subscribe({
            next: (res) => {
                this.loading = false;
                // Redirect is handled by AuthService
            },
            error: (err) => {
                this.loading = false;
                alert(err.error?.message || 'Login failed');
            }
        });
    }

    async onGoogleLogin() {
        this.loading = true;
        await this.authService.loginWithGoogle();
        this.loading = false;
    }
}
