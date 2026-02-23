import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoxService } from '../../shared/services/box.service';
import { ShopRequestService } from '../../shared/services/shop-request.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.css'
})
export class BoxListComponent implements OnInit {
  boxes: any[] = [];
  occupiedCount = 0;
  availableCount = 0;

  isModalOpen = false;
  newBox = {
    boxNumber: '',
    location: { floor: 0, zone: '' },
    type: 'Boutique',
    pricePerMonth: 0
  };

  assignModalOpen = false;
  selectedBoxForAssign: any = null;
  shopRequests: any[] = [];
  selectedRequestId = '';
  selectedShopId = '';
  availableShops: any[] = [];

  constructor(
      private boxService: BoxService, 
      private shopRequestService: ShopRequestService,
      private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBoxes();
    this.loadShopRequests();
    this.loadAvailableShops();
  }

  loadBoxes(): void {
    this.boxService.getBoxes().subscribe(res => {
      this.boxes = res.data;
      this.occupiedCount = this.boxes.filter((b: any) => b.status === 'Occupé').length;
      this.availableCount = this.boxes.filter((b: any) => b.status === 'Libre').length;
    });
  }

  loadShopRequests(): void {
    this.shopRequestService.getRequests('pending').subscribe(res => {
      this.shopRequests = res.data;
    });
  }

  loadAvailableShops(): void {
    this.authService.getUsers({ role: 'boutique' }).subscribe(res => {
      this.availableShops = res.data.filter((u: any) => !u.shopId);
    });
  }

  openNewBoxModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.assignModalOpen = false;
    this.selectedBoxForAssign = null;
    this.selectedRequestId = '';
    this.selectedShopId = '';
    this.resetForm();
  }

  saveBox() {
    if (!this.newBox.boxNumber || !this.newBox.location.zone) return;

    this.boxService.createBox(this.newBox).subscribe(() => {
      this.loadBoxes();
      this.closeModal();
    });
  }

  viewBoxDetails(box: any) {
    if (box.status === 'Libre') {
       this.selectedBoxForAssign = box;
       this.assignModalOpen = true;
    } else {
       alert(`Box ${box.boxNumber} is already occupied.`);
    }
  }

  onRequestChange() {
      const request = this.shopRequests.find(r => r._id === this.selectedRequestId);
      if (request && request.userId) {
          this.selectedShopId = request.userId._id;
      }
  }

  assignShop() {
    if (!this.selectedShopId || !this.selectedBoxForAssign) return;
    
    this.boxService.assignTenant(this.selectedBoxForAssign._id, { tenantId: this.selectedShopId }).subscribe(() => {
        // If a request was selected, mark it as approved
        if (this.selectedRequestId) {
            this.shopRequestService.updateStatus(this.selectedRequestId, 'approved').subscribe(() => {
                 this.loadShopRequests();
            });
        }
        this.loadBoxes();
        this.loadAvailableShops();
        this.closeModal();
    });
  }

  private resetForm() {
    this.newBox = {
      boxNumber: '',
      location: { floor: 0, zone: '' },
      type: 'Boutique',
      pricePerMonth: 0
    };
  }
}
