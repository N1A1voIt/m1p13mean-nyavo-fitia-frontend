import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyaltyService } from '../../shared/services/loyalty.service';

@Component({
    selector: 'app-loyalty-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loyalty-dashboard.component.html',
    styleUrl: './loyalty-dashboard.component.css'
})
export class LoyaltyDashboardComponent implements OnInit {
    loyalty: any;
    loading = true;

    constructor(private loyaltyService: LoyaltyService) { }

    ngOnInit(): void {
        this.loyaltyService.getMyLoyalty().subscribe({
            next: (res) => {
                this.loyalty = res.data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching loyalty', err);
                this.loading = false;
            }
        });
    }
}
