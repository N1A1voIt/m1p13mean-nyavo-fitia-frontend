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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent],
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
      next: (res: any) => {
        this.loading = false;
        // Redirect is handled by AuthService
      },
      error: (err: any) => {
        this.loading = false;
        alert(err.error?.message || 'Registration failed');
      }
    });
  }
}
