import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-shop-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './shop-dashboard.component.html',
    styleUrl: './shop-dashboard.component.css'
})
export class ShopDashboardComponent {
    private authService = inject(AuthService);
    user = this.authService.currentUserValue;

    logout() {
        this.authService.logout();
    }
}
