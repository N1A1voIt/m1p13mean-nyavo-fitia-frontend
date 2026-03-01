import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-event-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-calendar.component.html',
  styleUrl: './event-calendar.component.css'
})
export class EventCalendarComponent implements OnInit {
  events: any[] = [];
  calendarDays: (number | null)[] = [];
  currentDate = new Date();
  showModal = false;
  saving = false;
  errorMsg = '';

  // Populated from backend /events/meta
  locationOptions: string[] = [];
  categoryOptions: string[] = [];

  newEvent: any = {
    title: '',
    description: '',
    type: 'Event',
    category: 'Digital Screen',
    location: 'Main Hall',
    start: '',
    end: '',
    status: 'Confirmed'
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.buildCalendar();
    this.loadEvents();
    this.eventService.getEventMeta().subscribe(res => {
      this.categoryOptions = res.data.categories;
      this.locationOptions  = res.data.locations;
      // Set defaults once options are loaded
      if (!this.newEvent.category) this.newEvent.category = this.categoryOptions[0];
      if (!this.newEvent.location)  this.newEvent.location  = this.locationOptions[0];
    });
  }

  get monthLabel(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Shift so Monday=0
    const offset = (firstDay + 6) % 7;
    this.calendarDays = [
      ...Array(offset).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
    ];
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(res => {
      this.events = res.data;
    });
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    const now = new Date();
    return now.getDate() === day &&
      now.getMonth() === this.currentDate.getMonth() &&
      now.getFullYear() === this.currentDate.getFullYear();
  }

  getDayEvents(day: number | null): any[] {
    if (!day) return [];
    return this.events.filter(e => {
      const d = new Date(e.start);
      return d.getDate() === day &&
        d.getMonth() === this.currentDate.getMonth() &&
        d.getFullYear() === this.currentDate.getFullYear();
    });
  }

  get upcomingEvents(): any[] {
    const now = new Date();
    return this.events
      .filter(e => new Date(e.start) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5);
  }

  get adSlots(): any[] {
    return this.events.filter(e => e.type === 'Ad');
  }

  openModal(): void {
    this.newEvent = {
      title: '', description: '', type: 'Event',
      category: this.categoryOptions[0],
      location: this.locationOptions[0],
      start: '', end: '', status: 'Confirmed'
    };
    this.errorMsg = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveEvent(): void {
    if (!this.newEvent.title || !this.newEvent.start || !this.newEvent.end || !this.newEvent.category) {
      this.errorMsg = 'Title, category, start and end date are required.';
      return;
    }
    this.saving = true;
    this.eventService.createEvent(this.newEvent).subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.loadEvents();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err.error?.message || 'Error saving event.';
      }
    });
  }

  deleteEvent(id: string): void {
    if (!confirm('Delete this event?')) return;
    this.eventService.deleteEvent(id).subscribe(() => this.loadEvents());
  }

  statusColor(status: string): string {
    const map: any = {
      Live: 'bg-green-100 text-green-700',
      Confirmed: 'bg-blue-100 text-blue-700',
      Draft: 'bg-gray-100 text-gray-500',
      Ended: 'bg-red-100 text-red-400'
    };
    return map[status] || 'bg-gray-100 text-gray-500';
  }

  typeColor(type: string): string {
    const map: any = { Ad: 'bg-pink-400', Event: 'bg-indigo-400', Promo: 'bg-amber-400' };
    return map[type] || 'bg-gray-300';
  }
}

