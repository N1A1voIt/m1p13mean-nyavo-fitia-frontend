import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService, Shop } from '../../../core/services/shop.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-mall-plan',
    standalone: true,
    imports: [CommonModule, CardComponent, BadgeComponent, ButtonComponent, RouterModule],
    templateUrl: './mall-plan.component.html',
    styleUrls: ['./mall-plan.component.css']
})
export class MallPlanComponent implements OnInit {
    private shopService = inject(ShopService);
    shops: Shop[] = [];
    selectedShop: Shop | null = null;
    selectedBoxId: string | null = null;
    shopMap: { [boxId: string]: Shop } = {};

    // Define the grid of boxes with a more premium layout
    boxes = [
        { id: 'A01', x: 50, y: 50, w: 120, h: 100, label: 'Store A01' },
        { id: 'A02', x: 180, y: 50, w: 120, h: 100, label: 'Store A02' },
        { id: 'A03', x: 310, y: 50, w: 120, h: 100, label: 'Store A03' },
        { id: 'A04', x: 440, y: 50, w: 120, h: 100, label: 'Store A04' },
        { id: 'A05', x: 570, y: 50, w: 120, h: 100, label: 'Store A05' },

        { id: 'B01', x: 50, y: 280, w: 120, h: 100, label: 'Store B01' },
        { id: 'B02', x: 180, y: 280, w: 120, h: 100, label: 'Store B02' },
        { id: 'B03', x: 310, y: 280, w: 120, h: 100, label: 'Store B03' },
        { id: 'B04', x: 440, y: 280, w: 120, h: 100, label: 'Store B04' },
        { id: 'B05', x: 570, y: 280, w: 120, h: 100, label: 'Store B05' },
    ];

    ngOnInit() {
        this.shopService.getAllShops().subscribe({
            next: (response) => {
                this.shops = response.data || response;
                this.shops.forEach(shop => {
                    if (shop.boxId) {
                        this.shopMap[shop.boxId] = shop;
                    }
                });
            },
            error: (err) => console.error('Error fetching shops:', err)
        });
    }

    offsetX = 0;
    offsetY = 0;
    private isDragging = false;
    private startX = 0;
    private startY = 0;


    onBoxClick(boxId: string) {
        if (this.isDragging) return;
        this.selectedBoxId = boxId;
        this.selectedShop = this.shopMap[boxId] || null;
    }

    startDrag(event: MouseEvent) {
        this.isDragging = true;
        this.startX = event.clientX - this.offsetX;
        this.startY = event.clientY - this.offsetY;
    }

    onDrag(event: MouseEvent) {
        if (!this.isDragging) return;
        this.offsetX = event.clientX - this.startX;
        this.offsetY = event.clientY - this.startY;
    }

    stopDrag() {
        this.isDragging = false;
    }

    isOccupied(boxId: string): boolean {
        return !!this.shopMap[boxId];
    }

    getShopName(boxId: string): string {
        return this.shopMap[boxId]?.name || 'Available Slot';
    }
}
