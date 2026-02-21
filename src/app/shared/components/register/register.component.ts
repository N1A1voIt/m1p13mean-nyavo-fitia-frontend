/* Reference: AI_CONTEXT_FRONTEND.md */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="register-container">
      <div class="register-card">
        <h1>Create Account</h1>
        <p class="subtitle">Join our marketplace today</p>
        
        <div class="role-selector">
          <button [class.active]="role === 'user'" (click)="role = 'user'">Customer</button>
          <button [class.active]="role === 'shop'" (click)="role = 'shop'">Shop Owner</button>
        </div>

        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" [(ngModel)]="userData.name" name="name" required placeholder="John Doe">
            </div>
            
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" [(ngModel)]="userData.username" name="username" required placeholder="johndoe123">
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="userData.email" name="email" required placeholder="name@example.com">
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="userData.password" name="password" required placeholder="••••••••">
          </div>

          <div class="form-group animate-fade" *ngIf="role === 'shop'">
            <label for="shopName">Shop Name</label>
            <input type="text" id="shopName" [(ngModel)]="userData.shopName" name="shopName" required placeholder="My Awesome Store">
          </div>
          
          <button type="submit" class="btn-primary" [disabled]="loading">
            <span *ngIf="!loading">Register</span>
            <span *ngIf="loading" class="loader"></span>
          </button>
        </form>
        
        <p class="footer-text">
          Already have an account? <a routerLink="/login">Log in</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      font-family: 'Inter', sans-serif;
      padding: 2rem;
    }
    
    .register-card {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 500px;
      text-align: center;
    }
    
    h1 {
      color: #2d3748;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #718096;
      margin-bottom: 2rem;
    }

    .role-selector {
      display: flex;
      background: #f7fafc;
      padding: 4px;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .role-selector button {
      flex: 1;
      padding: 10px;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      color: #718096;
      transition: all 0.2s;
    }

    .role-selector button.active {
      background: white;
      color: #667eea;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      text-align: left;
      margin-bottom: 1.25rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.4rem;
      color: #4a5568;
      font-weight: 500;
      font-size: 0.9rem;
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
      margin-top: 1rem;
    }
    
    .footer-text {
      margin-top: 1.5rem;
      color: #718096;
    }
    
    .footer-text a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .animate-fade {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .loader {
      border: 2px solid rgba(255,255,255,0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      animation: spin 1s linear infinite;
      display: inline-block;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class RegisterComponent {
    private authService = inject(AuthService);

    role: 'user' | 'shop' = 'user';
    userData = {
        email: '',
        password: '',
        name: '',
        username: '',
        shopName: ''
    };
    loading = false;

    async onRegister() {
        this.loading = true;
        const payload = { ...this.userData, role: this.role };
        this.authService.register(payload).subscribe({
            next: (res) => {
                this.loading = false;
                // Redirect is handled by AuthService
            },
            error: (err) => {
                this.loading = false;
                alert(err.error?.message || 'Registration failed');
            }
        });
    }
}
