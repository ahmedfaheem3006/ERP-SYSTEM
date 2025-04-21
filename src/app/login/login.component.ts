// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ApisService } from '../apis.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInUp', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition('void => *', [
        animate('0.4s ease-out')
      ])
    ]),
    trigger('shake', [
      state('invalid', style({
        transform: 'translateX(0)'
      })),
      transition('* => invalid', [
        animate('0.4s', style({ transform: 'translateX(-10px)' })),
        animate('0.1s', style({ transform: 'translateX(10px)' })),
        animate('0.1s', style({ transform: 'translateX(-10px)' })),
        animate('0.1s', style({ transform: 'translateX(10px)' })),
        animate('0.1s', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  formState = 'valid';
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apisService: ApisService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      console.log('Sending login data:', loginData);

      this.apisService.login(loginData).subscribe(
        (response) => {
          console.log('Login successful', response);
          this.isLoading = false;

          // Store user data and token
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('displayName', response.displayName);
          }

          // Navigate to dashboard or home page
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Login failed', error);
          this.isLoading = false;

          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to the server. Please check your internet connection.';
          } else if (error.status === 400) {
            this.errorMessage = 'Invalid email or password.';
          } else if (error.status === 401) {
            this.errorMessage = 'Unauthorized. Please check your credentials.';
          } else {
            this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          }

          this.formState = 'invalid';
          setTimeout(() => this.formState = 'valid', 1000);
        }
      );
    } else {
      this.formState = 'invalid';
      setTimeout(() => this.formState = 'valid', 1000);
      this.markFormGroupTouched(this.loginForm);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
