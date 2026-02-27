import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RHService } from '../../shared/services/rh.service';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent implements OnInit {
  activeTab = 'Security';
  planning: any[] = [];
  attendanceLogs: any[] = [
    { userName: 'Jean Security', clockIn: new Date(new Date().setHours(7, 55)), isLate: false },
    { userName: 'Marie Clean', clockIn: new Date(new Date().setHours(8, 15)), isLate: true }
  ];

  constructor(private rhService: RHService) { }

  ngOnInit(): void {
    this.loadPlanning();
  }

  get filteredPlanning() {
    return this.planning.filter(p => p.team === this.activeTab);
  }

  loadPlanning(): void {
    this.rhService.getPlanning().subscribe(res => {
      this.planning = res.data;
    });
  }
}
