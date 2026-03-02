import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../shared/services/reservation.service';
import { BoxService } from '../../shared/services/box.service';

@Component({
    selector: 'app-reservation-booking',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reservation-booking.component.html',
    styleUrl: './reservation-booking.component.css'
})
export class ReservationBookingComponent implements OnInit {
    reservations: any[] = [];
    shops: any[] = [];
    loading = true;

    newReservation = {
        serviceType: 'FoodCourtTable',
        shopId: '',
        date: '',
        timeSlot: '',
        numberOfPeople: 1,
        notes: ''
    };

    timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
    ];

    constructor(
        private reservationService: ReservationService,
        private boxService: BoxService
    ) { }

    ngOnInit(): void {
        this.refreshData();
        this.loadShops();
    }

    refreshData(): void {
        this.reservationService.getMyReservations().subscribe(res => {
            this.reservations = res.data;
            this.loading = false;
        });
    }

    loadShops(): void {
        // Load FoodCourt boxes and some sample Boutiques for Salon
        this.boxService.getBoxes({ type: 'FoodCourt' }).subscribe(res => {
            this.shops = res.data;
            if (this.shops.length > 0) this.newReservation.shopId = this.shops[0]._id;
        });
    }

    onServiceTypeChange(): void {
        if (this.newReservation.serviceType === 'FoodCourtTable') {
            this.boxService.getBoxes({ type: 'FoodCourt' }).subscribe(res => {
                this.shops = res.data;
                if (this.shops.length > 0) this.newReservation.shopId = this.shops[0]._id;
            });
        } else {
            // For Salon de coiffure, we filter by HairSalon type
            this.boxService.getBoxes({ type: 'HairSalon' }).subscribe(res => {
                this.shops = res.data;
                if (this.shops.length > 0) this.newReservation.shopId = this.shops[0]._id;
            });
        }
    }

    book(): void {
        this.reservationService.createReservation(this.newReservation).subscribe(() => {
            alert('Reservation successful!');
            this.refreshData();
            // Reset some fields
            this.newReservation.notes = '';
        });
    }

    cancelReservation(id: string): void {
        if (confirm('Are you sure you want to cancel this reservation?')) {
            this.reservationService.updateReservation(id, { status: 'Canceled' }).subscribe(() => {
                this.refreshData();
            });
        }
    }
}
