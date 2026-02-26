
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../../core/services/shop.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-box-request',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent],
  templateUrl: './box-request.component.html',
  styleUrls: ['./box-request.component.css']
})
export class BoxRequestComponent implements OnInit {
  private shopService = inject(ShopService);

  loading = false;
  successMsg = '';
  errorMsg = '';
  existingRequest: any = null;

  selectedShop$ = this.shopService.selectedShop$;

  ngOnInit() {
    this.checkRequestStatus();
  }

  checkRequestStatus() {
    const shopId = this.shopService.activeShopId;
    if (shopId) {
      this.shopService.getBoxRequest(shopId).subscribe({
        next: (res) => {
          this.existingRequest = res.data.boxRequest;
        }
      });
    }
  }

  submitRequest() {
    const shopId = this.shopService.activeShopId;
    if (!shopId) {
      this.errorMsg = 'No shop selected.';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.shopService.requestBox(shopId).subscribe({
      next: (res) => {
        this.successMsg = 'Box request sent successfully!';
        this.loading = false;
        this.existingRequest = res.data.boxRequest;
      },
      error: (err) => {
        this.errorMsg = err?.error?.error || 'Failed to send request. Please try again.';
        this.loading = false;
      }
    });
  }
}
