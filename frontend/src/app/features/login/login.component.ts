import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  emailForm: FormGroup;
  otpForm: FormGroup;
  otpStep = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    private router: Router,
    private auth: AuthService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  onLoginInit() {
    if (this.emailForm.invalid) return;

    this.service.loginInit(this.emailForm.value).subscribe({
      next: (res) => {
        this.otpStep = true;
        this.errorMsg = '';
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorMsg = 'User not registered. Please register first.';
        } else {
          this.errorMsg = 'Something went wrong. Please try again.';
        }
      },
    });
  }

  onLoginVerify() {
    if (this.otpForm.invalid) return;

    const data = {
      email: this.emailForm.value.email,
      otp: this.otpForm.value.otp,
    };

    this.service.loginVerify(data).subscribe({
      next: (res) => {
        // Simulate fetching user info (ideally should come from backend)
        const email = this.emailForm.value.email;

        this.service.getUserByEmail(email).subscribe({
          next: (user: any) => {
            this.auth.setLoginSession(user); // ✅ Set session and notify
            alert('Login successful!');
            this.router.navigate(['/home']);
          },
          error: () => {
            alert('Failed to retrieve user info after login.');
          },
        });
      },
      error: () => {
        alert('Invalid or expired OTP.');
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
