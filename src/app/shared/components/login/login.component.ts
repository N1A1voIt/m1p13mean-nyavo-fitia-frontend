/* Reference: AI_CONTEXT_FRONTEND.md */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../ui/button/button.component';
import { InputComponent } from '../ui/input/input.component';
import { CardComponent } from '../ui/card/card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent],
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
      next: (res: any) => {
        this.loading = false;
        // Redirect is handled by AuthService
      },
      error: (err: any) => {
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
