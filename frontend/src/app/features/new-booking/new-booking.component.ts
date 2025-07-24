import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

type OversOption = 0 | 10 | 20 | 30 | 40;

export interface Booking {
  place: string;
  overs: number;
  date: string;
  slot: string;
  cost: number;
  phone: string;
  email: string;
  fullName: string;
}


@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.css'],
})
export class NewBookingComponent implements OnInit {
  bookingForm!: FormGroup;
  selectedSlot: string | null = null;
  selectedDate: string | null = null;
  totalPrice: number = 0;
  isFirstTime: boolean = false;

  email: string | null = localStorage.getItem('email');
  phone: string | null = localStorage.getItem('phone');

  bookings: Booking[] = [];
  loading = false;
  error: string | null = null;

  oversToCost: Record<OversOption, number> = {
    0: 0,
    10: 500,
    20: 800,
    30: 1300,
    40: 1500,
  };

  intervalMap: Record<OversOption, number> = {
    0: 0,
    10: 50,
    20: 90,
    30: 130,
    40: 170,
  };

  slots: string[] = [];
  dateTabs: string[] = [];

  constructor(private fb: FormBuilder, private api: CommonService) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      place: ['sector 28 gurgaon'],
      overs: [10],
    });

    this.generateDateTabs();
    this.updateSlots();
    this.updateTotalPrice();

    this.bookingForm.get('overs')?.valueChanges.subscribe(() => {
      this.updateSlots();
      this.updateTotalPrice();
    });

    this.bookingForm.get('place')?.valueChanges.subscribe(() => {
      this.updateSlots();
    });
  }

  generateDateTabs(): void {
    const today = new Date();
    this.dateTabs = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      this.dateTabs.push(date.toISOString().split('T')[0]); // YYYY-MM-DD
    }

    this.selectedDate = this.dateTabs[0];
  }

  updateTotalPrice(): void {
    const oversValue = this.bookingForm.get('overs')?.value as OversOption;
    const discount = this.oversToCost[(oversValue - 10) as OversOption] || 0;
    if (this.email && this.phone) {
      this.loading = true;
      this.api
        .getMyBookings({ email: this.email, phone: this.phone })
        .subscribe({
          next: (data) => {
            this.bookings = Array.isArray(data) ? data : [data];
            this.isFirstTime = this.bookings.length > 0 ? false : true;
            this.totalPrice = this.isFirstTime ? 199 + discount : this.oversToCost[oversValue] || 0;
            this.loading = false;
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to fetch bookings.';
            this.loading = false;
          },
        });
    }
  }

  updateSlots(): void {
    const interval =
      this.intervalMap[this.bookingForm.get('overs')?.value as OversOption];
    const start = new Date();
    const end = new Date();

    start.setHours(9, 0, 0, 0);
    end.setHours(23, 30, 0, 0);

    const slotsArr: string[] = [];

    while (start < end) {
      const slotStart = new Date(start);
      const slotEnd = new Date(start.getTime() + interval * 60 * 1000);
      if (slotEnd > end) break;

      slotsArr.push(
        `${this.formatTime(slotStart)} - ${this.formatTime(slotEnd)}`
      );
      start.setTime(slotEnd.getTime());
    }

    this.slots = slotsArr;
    this.selectedSlot = null; // reset slot
  }

  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${suffix}`;
  }

  onDateSelect(date: string): void {
    this.selectedDate = date;
    this.updateSlots();
  }

  onSlotSelect(slot: string): void {
    this.selectedSlot = this.selectedSlot === slot ? null : slot;
  }

  onSubmit(): void {
    if (!this.selectedSlot || !this.selectedDate) {
      alert('Please select a slot and date before booking!');
      return;
    }

    const { place, overs } = this.bookingForm.value;

    const bookingData = {
      place,
      overs,
      date: this.selectedDate,
      slot: this.selectedSlot,
      cost: this.totalPrice,
      phone: this.phone,
      email: this.email,
      fullName: localStorage.getItem('fullName'),
    };

    this.api.booking(bookingData).subscribe({
      next: (res) => {
        alert('Booking successful!');
        this.updateSlots();
        console.log('Booking response:', res);
      },
      error: (err) => {
        alert('Booking failed. Please try again.');
        console.error('Booking error:', err);
      },
    });
  }
}
