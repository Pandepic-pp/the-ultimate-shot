import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  goToHome() {
    if (this.isLoggedIn) {
      this.router.navigate(['/my-home']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/login']);
  }
}
