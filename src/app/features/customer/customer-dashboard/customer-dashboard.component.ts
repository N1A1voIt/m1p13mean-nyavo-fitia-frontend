import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-customer-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './customer-dashboard.component.html',
    styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent {
    private authService = inject(AuthService);
    user = this.authService.currentUserValue;

    logout() {
        this.authService.logout();
    }
}
