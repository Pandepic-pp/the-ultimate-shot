import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  otpForm: FormGroup;
  otpStep = false; // whether to show the OTP input
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  onRegisterInit() {
    if (this.registerForm.invalid) return;

    this.service.registerInit(this.registerForm.value).subscribe({
      next: (res) => {
        console.log(res); // 'OTP sent to email'
        this.otpStep = true; // show OTP input
        this.errorMsg = ''; // clear error
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMsg = 'User already exists. Please log in.';
        } else {
          this.errorMsg = 'Something went wrong. Please try again.';
        }
      },
    });
  }

  onRegisterVerify() {
    if (this.otpForm.invalid) return;

    const data = {
      ...this.registerForm.value,
      otp: this.otpForm.value.otp,
    };

    this.service.registerVerify(data).subscribe({
      next: (res) => {
        alert('Registration successful! Redirecting to login...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000); // 1 second delay before navigation
      },
      error: (err) => {
        alert('Invalid OTP. Try again.');
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
