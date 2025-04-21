// forgot-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ApisService } from '../apis.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
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
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  formState = 'valid';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private apisService: ApisService,
    private router: Router
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const email = this.forgotPasswordForm.value.email;

      console.log('Sending forgot password request for:', email);

      this.apisService.forgotPassword(email).subscribe(
        (response) => {
          console.log('Forgot password request successful', response);
          this.isLoading = false;
          this.successMessage = 'Password reset link has been sent to your email.';

          // Optionally redirect to a confirmation page after a delay
          setTimeout(() => {
            this.router.navigate(['/verification'], {
              queryParams: { email: email }
            });
          }, 1000);
        },
        (error) => {
          console.error('Forgot password request failed', error);
          this.isLoading = false;

          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to the server. Please check your internet connection.';
          } else if (error.status === 404) {
            this.errorMessage = 'Email address not found.';
          } else {
            this.errorMessage = error.error?.message || 'Failed to send reset link. Please try again.';
          }

          this.formState = 'invalid';
          setTimeout(() => this.formState = 'valid', 1000);
        }
      );
    } else {
      this.formState = 'invalid';
      setTimeout(() => this.formState = 'valid', 1000);
      this.markFormGroupTouched(this.forgotPasswordForm);
    }
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
