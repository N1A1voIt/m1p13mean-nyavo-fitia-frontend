import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingService } from '../../shared/services/billing.service';

@Component({
  selector: 'app-billing-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing-list.component.html',
  styleUrl: './billing-list.component.css'
})
export class BillingListComponent implements OnInit {
  invoices: any[] = [];
  totalExpected = 0;
  totalReceived = 0;
  totalPending = 0;

  constructor(private billingService: BillingService) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.billingService.getInvoices().subscribe(res => {
      this.invoices = res.data;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.totalExpected = this.invoices.reduce((acc, inv) => acc + inv.amount, 0);
    this.totalReceived = this.invoices.filter(i => i.status === 'Paid').reduce((acc, inv) => acc + inv.amount, 0);
    this.totalPending = this.totalExpected - this.totalReceived;
  }

  generateMonthlyRent(): void {
    this.billingService.generateRent().subscribe(() => {
      this.loadInvoices();
    });
  }

  processPayment(id: string): void {
    this.billingService.payInvoice(id, { method: 'Cash', transactionId: 'MOCK-' + Date.now() }).subscribe(() => {
      this.loadInvoices();
    });
  }
}
