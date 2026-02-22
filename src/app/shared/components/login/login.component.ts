import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, Router } from '@angular/router';
import { ButtonComponent } from '../ui/button/button.component';
import { InputComponent } from '../ui/input/input.component';
import { CardComponent } from '../ui/card/card.component';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;

  ngOnInit() {
    this.authService.initialised$.pipe(
      filter(init => init === true),
      take(1),
      switchMap(() => this.authService.user$),
      take(1)
    ).subscribe(user => {
      if (user) {
        // If user is already logged in, redirect them home
        this.router.navigate(['/']);
      }
    });
  }

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
