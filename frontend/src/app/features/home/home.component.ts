import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  currentSlide: number = 0;
  slides: number[] = [0, 1, 2, 3, 4];
  private intervalId: any;

  constructor(private router: Router) {}

  testimonials = [
    {
      name: 'Rohan Mehta',
      stars: '⭐⭐⭐⭐⭐',
      comment: 'The coaching sessions are structured and super helpful!',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Anjali Sharma',
      stars: '⭐⭐⭐⭐⭐',
      comment: 'Our company tournaments were elevated to the next level!',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Pratik Joshi',
      stars: '⭐⭐⭐⭐⭐',
      comment: 'My son improved drastically within weeks of training!',
      image: 'https://randomuser.me/api/portraits/men/58.jpg',
    },
    {
      name: 'Sneha Rao',
      stars: '⭐⭐⭐⭐⭐',
      comment: 'The digitization support and scheduling tools are top notch.',
      image: 'https://randomuser.me/api/portraits/women/60.jpg',
    },
  ];

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetInterval();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  startCarousel() {
    this.intervalId = setInterval(() => this.nextSlide(), 3000);
  }

  stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  resetInterval() {
    this.stopCarousel();
    this.startCarousel();
  }

  onMouseEnter() {
    this.stopCarousel();
  }

  onMouseLeave() {
    this.startCarousel();
  }

  showAllTestimonials() {
    window.open(
      'https://www.google.com/maps/contrib/104445435069717864741/reviews/@21.0932499,77.2984043,5z/data=!3m1!4b1!4m3!8m2!3m1!1e1?entry=ttu&g_ep=EgoyMDI1MDcxNi4wIKXMDSoASAFQAw%3D%3D',
      '_blank'
    );
  }

  openMap(url: string): void {
    window.open(url, '_blank');
  }

  startSession(): void {
    if(localStorage.getItem('fullName') !== null) {
      this.router.navigate(['/my-home']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }
}
