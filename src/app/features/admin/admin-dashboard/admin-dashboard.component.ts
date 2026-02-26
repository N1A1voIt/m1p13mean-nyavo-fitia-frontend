import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../../core/services/shop.service';
import { AuthService } from '../../../core/services/auth.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent, InputComponent, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private shopService = inject(ShopService);
  private authService = inject(AuthService);

  requests: any[] = [];
  loading = true;
  boxAssignment: { [key: string]: string } = {};

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.shopService.getBoxRequests().subscribe({
      next: (res) => {
        this.requests = res.data.requests;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onAssignBox(requestId: string) {
    const boxId = this.boxAssignment[requestId];
    if (!boxId) return;

    this.shopService.assignBoxToRequest(requestId, boxId).subscribe({
      next: () => {
        this.loadRequests();
        delete this.boxAssignment[requestId];
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
