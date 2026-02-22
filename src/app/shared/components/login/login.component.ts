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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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
