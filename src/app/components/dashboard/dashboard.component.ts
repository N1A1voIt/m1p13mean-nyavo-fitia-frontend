import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../shared/services/finance.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: any;

  constructor(private financeService: FinanceService) { }

  ngOnInit(): void {
    this.financeService.getGlobalStats().subscribe(res => {
      console.log(res);
      this.stats = res.data;
    });
  }
}
