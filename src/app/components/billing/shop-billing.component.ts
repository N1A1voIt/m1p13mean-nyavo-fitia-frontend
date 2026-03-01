import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingService } from '../../shared/services/billing.service';

@Component({
  selector: 'app-shop-billing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-billing.component.html',
  styleUrl: './shop-billing.component.css'
})
export class ShopBillingComponent implements OnInit {
  invoices: any[] = [];
  summary: any = null;
  activeFilter = 'all';
  loading = true;

  constructor(private billingService: BillingService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.billingService.getMyBillingSummary().subscribe(res => {
      this.summary = res.data;
    });
    this.billingService.getMyInvoices().subscribe(res => {
      this.invoices = res.data;
      this.loading = false;
    });
  }

  get filteredInvoices() {
    if (this.activeFilter === 'all') return this.invoices;
    return this.invoices.filter(i => i.status === this.activeFilter);
  }

  get paidInvoices() { return this.invoices.filter(i => i.status === 'Paid'); }
  get pendingInvoices() { return this.invoices.filter(i => i.status === 'Pending'); }
  get lateInvoices() { return this.invoices.filter(i => i.status === 'Late'); }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Late': return 'bg-red-50 text-red-700 border-red-200';
      case 'Canceled': return 'bg-gray-50 text-gray-500 border-gray-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'Loyer': return 'Rent';
      case 'Charge_Jiro': return 'Electricity';
      case 'Charge_Rano': return 'Water';
      case 'Pub': return 'Advertising';
      default: return type;
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'Loyer': return '🏠';
      case 'Charge_Jiro': return '⚡';
      case 'Charge_Rano': return '💧';
      case 'Pub': return '📢';
      default: return '📄';
    }
  }

  getDaysUntilDue(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  getDueDateLabel(dueDate: string, status: string): string {
    if (status === 'Paid') return 'Paid';
    const days = this.getDaysUntilDue(dueDate);
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return 'Due today';
    return `${days}d remaining`;
  }
}
