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
        this.loadBoxes();
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
    private isDraggingMap = false;
    private startMapX = 0;
    private startMapY = 0;

    // Box dragging state
    draggingBoxId: string | null = null;
    draggingBoxIndex: number = -1;
    private startBoxX = 0;
    private startBoxY = 0;
    private originalBoxX = 0;
    private originalBoxY = 0;

    onBoxClick(box: any, event: MouseEvent) {
        // Prevent click if we were dragging the box or if clicking on empty box
        if (this.draggingBoxId || !this.isOccupied(box.id)) return;
        event.stopPropagation(); // prevent map drag start
        this.selectedBoxId = box.id;
        this.selectedShop = this.shopMap[box.id] || null;
    }

    startMapDrag(event: MouseEvent) {
        // only start map drag if we aren't dragging a box
        if (this.draggingBoxId) return;
        this.isDraggingMap = true;
        this.startMapX = event.clientX - this.offsetX;
        this.startMapY = event.clientY - this.offsetY;
    }

    startBoxDrag(event: MouseEvent, box: any, index: number) {
        if (!this.isOccupied(box.id)) return;
        event.stopPropagation(); // Prevent map drag
        this.draggingBoxId = box.id;
        this.draggingBoxIndex = index;
        this.startBoxX = event.clientX;
        this.startBoxY = event.clientY;
        this.originalBoxX = box.x;
        this.originalBoxY = box.y;
    }

    onDrag(event: MouseEvent) {
        if (this.isDraggingMap) {
            this.offsetX = event.clientX - this.startMapX;
            this.offsetY = event.clientY - this.startMapY;
        } else if (this.draggingBoxId && this.draggingBoxIndex !== -1) {
            const dx = event.clientX - this.startBoxX;
            const dy = event.clientY - this.startBoxY;
            // Update box position temporarily
            // Simple approach: we scale the dx/dy because SVG might be scaled by browser, 
            // but for a simple interactive pan/zoom we can assume 1:1 roughly or add a multiplier.
            // A more exact way requires CTM math, but this gives a quick drag effect.
            this.boxes[this.draggingBoxIndex].x = this.originalBoxX + dx;
            this.boxes[this.draggingBoxIndex].y = this.originalBoxY + dy;
        }
    }

    stopDrag() {
        this.isDraggingMap = false;
        if (this.draggingBoxId) {
            // Save layout to local storage so persistence is kept for user
            this.saveBoxes();

            this.draggingBoxId = null;
            this.draggingBoxIndex = -1;
        }
    }

    saveBoxes() {
        localStorage.setItem('mall_boxes_layout', JSON.stringify(this.boxes));
    }

    loadBoxes() {
        const saved = localStorage.getItem('mall_boxes_layout');
        if (saved) {
            try {
                this.boxes = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved layout', e);
            }
        }
    }

    isOccupied(boxId: string): boolean {
        return !!this.shopMap[boxId];
    }
}
