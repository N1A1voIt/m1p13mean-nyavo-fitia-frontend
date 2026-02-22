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
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css'
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
