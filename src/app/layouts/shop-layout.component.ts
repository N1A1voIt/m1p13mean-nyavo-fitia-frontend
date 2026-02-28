import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { NotificationService } from '../shared/services/notification.service';
import { ShopRequestService } from '../shared/services/shop-request.service';

@Component({
  selector: 'app-shop-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-layout.component.html',
  styleUrl: './shop-layout.component.css'
})
export class ShopLayoutComponent implements OnInit {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  shopRequestService = inject(ShopRequestService);
  router = inject(Router);
  user$ = this.authService.user$;
  unreadCount$ = this.notificationService.unreadCount$;

  notifications: any[] = [];
  showNotificationPanel = false;

  requestSent = false;
  requestError = '';

  ngOnInit(): void {
    this.notificationService.refreshUnreadCount();
    // Refresh notification count every 60 seconds
    setInterval(() => this.notificationService.refreshUnreadCount(), 60000);
  }

  toggleNotifications(): void {
    this.showNotificationPanel = !this.showNotificationPanel;
    if (this.showNotificationPanel) {
      this.notificationService.getNotifications().subscribe(res => {
        this.notifications = res.data;
      });
    }
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe(() => {
      const n = this.notifications.find(n => n._id === id);
      if (n) n.read = true;
    });
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
    });
  }

  sendShopRequest() {
    this.shopRequestService.createRequest().subscribe({
      next: () => {
        this.requestSent = true;
        this.requestError = '';
      },
      error: (err) => {
        this.requestError = err.error?.message || 'Error sending request';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
