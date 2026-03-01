import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClientMapService } from '../../shared/services/client-map.service';
import { AuthService } from '../../shared/services/auth.service';
import { BoxService } from '../../shared/services/box.service';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-mall-map',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mall-map.component.html',
  styleUrl: './mall-map.component.css'
})
export class MallMapComponent implements OnInit {
  currentLevel = 0;
  shops: any[] = [];
  selectedShop: any = null;
  selectedVenue: any = null;
  venueEvents: any[] = [];
  isAdmin = false;
  isEditMode = false;
  draggedShop: any = null;

  // Fixed non-box amenities loaded from the database
  fixedItems: any[] = [];

  constructor(
    private mapService: ClientMapService, 
    private authService: AuthService,
    private boxService: BoxService,
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isAdmin = user?.role === 'admin' && this.router.url.includes('/admin');
    });
    this.loadMap();
    this.loadFixedItems();
  }

  loadMap() {
    this.mapService.getMapShops().subscribe(res => {
      this.shops = res.data;
    });
  }

  loadFixedItems() {
    this.mapService.getFixedItems().subscribe(res => {
      this.fixedItems = res.data;
    });
  }

  get levelShops() {
    return this.shops.filter(s => s.location.floor === this.currentLevel);
  }

  get levelFixedItems() {
    return this.fixedItems.filter(f => f.floor === this.currentLevel);
  }

  viewStorefront(shopId: string) {
    this.router.navigate(['/mall/marketplace'], { queryParams: { shopId } });
  }

  selectShop(shop: any) {
    if (this.isEditMode) return;
    this.selectedVenue = null;
    this.selectedShop = shop;
  }

  selectVenue(item: any) {
    if (this.isEditMode) return;
    this.selectedShop = null;
    this.selectedVenue = item;
    this.venueEvents = [];
    this.eventService.getEvents().subscribe(res => {
      this.venueEvents = res.data.filter((e: any) =>
        e.location?.toLowerCase() === item.label.toLowerCase()
      );
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    this.selectedShop = null;
  }

  onDragStart(event: any, shop: any) {
    if (!this.isEditMode) {
      event.preventDefault();
      return;
    }
    this.draggedShop = shop;
    event.dataTransfer.setData('text/plain', shop._id);
  }

  onDragOver(event: any) {
    if (!this.isEditMode) return;
    event.preventDefault(); // necessary to allow dropping
  }

  onDrop(event: any) {
    if (!this.isEditMode || !this.draggedShop) return;
    event.preventDefault();
    
    const viewport = event.currentTarget.getBoundingClientRect();
    
    // Calculate relative percentage
    const x = ((event.clientX - viewport.left) / viewport.width) * 100;
    const y = ((event.clientY - viewport.top) / viewport.height) * 100;

    this.draggedShop.location.pos = { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    
    this.boxService.updateBox(this.draggedShop._id, { location: this.draggedShop.location }).subscribe();
    this.draggedShop = null;
  }
}
