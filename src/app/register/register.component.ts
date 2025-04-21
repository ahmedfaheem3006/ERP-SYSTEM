import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ApisService } from '../apis.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
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
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
    this.registerForm = this.fb.group({
      storeName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')
      ]],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const merchantData = {
        storeName: this.registerForm.value.storeName,
        email: this.registerForm.value.email,
        phoneNumber: this.registerForm.value.phoneNumber,
        password: this.registerForm.value.password
      };

      console.log('Sending data:', merchantData);

      this.apisService.registerMerchant(merchantData).subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.isLoading = false;

          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }

          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration failed', error);
          this.isLoading = false;

          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to the server. Please check your internet connection.';
          } else if (error.status === 400) {
            // Handle validation errors
            if (error.error && error.error.errors) {
              // Join all error messages
              this.errorMessage = error.error.errors.join(', ');
            } else if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Invalid data provided. Please check your inputs.';
            }
          } else if (error.status === 500) {
            this.errorMessage = 'Server error. Please try again later or contact support.';
          } else {
            this.errorMessage = error.error?.message || error.message || 'Registration failed. Please try again.';
          }

          this.formState = 'invalid';
          setTimeout(() => this.formState = 'valid', 1000);
        }
      );
    } else {
      this.formState = 'invalid';
      setTimeout(() => this.formState = 'valid', 1000);
      this.markFormGroupTouched(this.registerForm);
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
