import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) { }

  baseUrl: string = environment.apiUrl;

  registerInit(form: any) {
    return this.http.post(this.baseUrl+'/register-init', form, {responseType: 'text'});
  }

  registerVerify(form: any) {
    return this.http.post(this.baseUrl+'/register-verify', form, {responseType: 'text'});
  }

  loginInit(form: any) {
    return this.http.post(this.baseUrl+'/login-init', form, {responseType: 'text'});
  }

  loginVerify(form: any) {
    return this.http.post(this.baseUrl+'/login-verify', form, {responseType: 'text'});
  }

  myBooking(form: any) {
    return this.http.post(this.baseUrl+'/my-booking', form);
  }

  getAllBookings() {
    return this.http.get(this.baseUrl+'/get-all-bookings');
  }

  booking(form: any) {
    return this.http.post(this.baseUrl+'/booking', form);
  }
}
