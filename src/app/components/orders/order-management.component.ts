import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(res => {
      this.orders = res.data;
    });
  }

  get queue() { return this.orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed'); }
  get awaiting() { return this.orders.filter(o => o.status === 'ReadyForCollect'); }

  get pendingCount() { return this.queue.length; }
  get readyCount() { return this.awaiting.length; }

  setStatus(id: string, status: string): void {
    this.orderService.updateOrderStatus(id, status).subscribe(() => this.ngOnInit());
  }

  markCollected(id: string): void {
    this.orderService.markAsCollected(id).subscribe(() => this.ngOnInit());
  }
}
