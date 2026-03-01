import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilityService } from '../../shared/services/utility.service';
import { BoxService } from '../../shared/services/box.service';

@Component({
  selector: 'app-utility-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utility-management.component.html',
  styleUrl: './utility-management.component.css'
})
export class UtilityManagementComponent implements OnInit {
  boxes: any[] = [];
  recentReadings: any[] = [];
  selectedBoxId = '';
  readingType = 'Electric';
  prevIndex = 0;
  currIndex = 0;

  constructor(private utilityService: UtilityService, private boxService: BoxService) { }

  ngOnInit(): void {
    this.boxService.getBoxes().subscribe(res => this.boxes = res.data);
    this.loadRecentReadings();
  }

  loadRecentReadings(): void {
    if (this.selectedBoxId) {
      this.utilityService.getReadingsByBox(this.selectedBoxId).subscribe(res => {
        this.recentReadings = res.data;
      });
    }
  }

  submitReading(): void {
    const data = {
      boxId: this.selectedBoxId,
      type: this.readingType,
      meterId: 'METER-' + this.selectedBoxId.substring(0, 4),
      previousIndex: this.prevIndex,
      currentIndex: this.currIndex
    };

    this.utilityService.addReading(data).subscribe(() => {
      alert('Reading saved!');
      this.prevIndex = this.currIndex;
      this.currIndex = 0;
    });
  }

  generateInvoices(): void {
    this.utilityService.generateUtilityInvoices().subscribe(res => {
      alert(`${res.count} Utility Invoices generated!`);
    });
  }
}
