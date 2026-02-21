/* Reference: AI_CONTEXT_FRONTEND.md */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="complete-container">
      <div class="complete-card">
        <h1>Almost There!</h1>
        <p class="subtitle">Just a few more details to complete your profile</p>
        
        <div class="role-selector">
          <button [class.active]="role === 'user'" (click)="role = 'user'">Customer</button>
          <button [class.active]="role === 'shop'" (click)="role = 'shop'">Shop Owner</button>
        </div>

        <form (ngSubmit)="onComplete()" #completeForm="ngForm">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" [(ngModel)]="name" name="name" required placeholder="John Doe">
          </div>

          <div class="form-group">
            <label for="username">Pick a Username</label>
            <input type="text" id="username" [(ngModel)]="username" name="username" required placeholder="unique_username">
          </div>

          <div class="form-group animate-fade" *ngIf="role === 'shop'">
            <label for="shopName">Shop Name</label>
            <input type="text" id="shopName" [(ngModel)]="shopName" name="shopName" required placeholder="My Awesome Store">
          </div>
          
          <button type="submit" class="btn-primary" [disabled]="loading || !completeForm.valid">
            <span *ngIf="!loading">Finish Registration</span>
            <span *ngIf="loading" class="loader"></span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .complete-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f7fafc;
      font-family: 'Inter', sans-serif;
    }
    
    .complete-card {
      background: white;
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      width: 100%;
      max-width: 450px;
      text-align: center;
    }
    
    h1 { color: #2d3748; margin-bottom: 0.5rem; }
    .subtitle { color: #718096; margin-bottom: 2rem; }

    .role-selector {
      display: flex;
      background: #f1f5f9;
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
      color: #64748b;
    }

    .role-selector button.active {
      background: white;
      color: #3b82f6;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .form-group { text-align: left; margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; color: #4a5568; font-weight: 500; }
    input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      outline: none;
    }
    
    .btn-primary {
      width: 100%;
      padding: 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }

    .animate-fade { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .loader {
      border: 2px solid white;
      border-top: 2px solid transparent;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
      display: inline-block;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class CompleteProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private auth = inject(Auth);

  role: 'user' | 'shop' = 'user';
  name = '';
  username = '';
  shopName = '';
  email = '';
  loading = false;

  async ngOnInit() {
    // Pre-populate from Firebase user
    const fbUser = await firstValueFrom(user(this.auth));
    if (fbUser) {
      this.name = fbUser.displayName || '';
      this.email = fbUser.email || '';
    }
  }

  async onComplete() {
    if (!this.name || !this.username) return;

    this.loading = true;
    const token = this.authService.currentToken;

    if (!token) {
      alert('Session expired. Please login again.');
      this.authService.logout();
      return;
    }

    const payload = {
      idToken: token,
      name: this.name,
      email: this.email,
      username: this.username,
      role: this.role,
      ...(this.role === 'shop' ? { shopName: this.shopName } : {})
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        // Redirect handled by AuthService
      },
      error: (err) => {
        this.loading = false;
        console.error('Registration error', err);
        alert(err.error?.message || 'Profile completion failed');
      }
    });
  }
}
