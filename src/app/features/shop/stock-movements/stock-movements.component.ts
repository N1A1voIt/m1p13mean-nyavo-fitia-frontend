import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../../core/services/shop.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
    selector: 'app-stock-movements',
    standalone: true,
    imports: [CommonModule, CardComponent, BadgeComponent],
    templateUrl: './stock-movements.component.html',
    styleUrl: './stock-movements.component.css'
})
export class StockMovementsComponent implements OnInit {
    private shopService = inject(ShopService);
    movements: any[] = [];
    loading = true;

    ngOnInit() {
        this.loadMovements();
    }

    loadMovements() {
        this.shopService.getMovements().subscribe({
            next: (res) => {
                this.movements = res.data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }
}
