import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasSession());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor() {}

  private hasSession(): boolean {
    return !!localStorage.getItem('email'); // or any session key
  }

  setLoginSession(user: any) {
    localStorage.setItem('fullName', user.fullName);
    localStorage.setItem('email', user.email);
    localStorage.setItem('phone', user.phone);
    this.loggedIn.next(true);
  }

  clearSession() {
    localStorage.clear();
    this.loggedIn.next(false);
  }
}
