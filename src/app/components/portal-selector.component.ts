import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-portal-selector',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portal-selector.component.html',
  styleUrl: './portal-selector.component.css'
})
export class PortalSelectorComponent {
  authService = inject(AuthService);
  router = inject(Router);
  user$ = this.authService.user$;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
