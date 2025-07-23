import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
})
export class MyBookingsComponent {
  bookings: any;
  loading = true;
  error = '';

  constructor(private api: CommonService) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    const phone = localStorage.getItem('phone');

    if (email && phone) {
      this.api.getMyBookings({ email, phone }).subscribe({
        next: (data) => {
          this.bookings = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to fetch bookings.';
          this.loading = false;
        },
      });
    } else {
      this.error = 'Login required to view bookings.';
      this.loading = false;
    }
  }
}
