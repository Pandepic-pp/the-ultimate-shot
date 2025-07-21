import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentSlide: number = 0;
  slides: number[] = [0, 1, 2, 3, 4];
  private intervalId: any;

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
}
