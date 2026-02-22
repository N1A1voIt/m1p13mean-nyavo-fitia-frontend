import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
    selector: 'app-customer-dashboard',
    standalone: true,
    imports: [CommonModule, ButtonComponent, CardComponent, BadgeComponent],
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
