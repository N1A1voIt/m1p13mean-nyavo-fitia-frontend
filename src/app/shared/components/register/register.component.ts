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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
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
