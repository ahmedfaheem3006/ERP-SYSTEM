// verification.component.ts
import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ApisService } from '../apis.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
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
export class VerificationComponent implements OnInit {
  verificationForm!: FormGroup;
  formState = 'valid';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  email: string = '';

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private apisService: ApisService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.verificationForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit5: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit6: ['', [Validators.required, Validators.pattern('[0-9]')]]
    });

    // Get email from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onDigitInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Auto-focus to next input if current input has a value
    if (value.length === 1 && index < 5) {
      const nextInput = this.codeInputs.toArray()[index + 1].nativeElement;
      nextInput.focus();
    }

    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      input.value = '';
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    // Handle backspace to move to previous input
    if (event.key === 'Backspace' && index > 0 && (event.target as HTMLInputElement).value === '') {
      const prevInput = this.codeInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const pastedText = clipboardData.getData('text');
    const digits = pastedText.replace(/\D/g, '').substring(0, 6).split('');

    if (digits.length > 0) {
      const inputs = this.codeInputs.toArray();
      digits.forEach((digit, i) => {
        if (i < 6) {
          inputs[i].nativeElement.value = digit;
          this.verificationForm.get(`digit${i + 1}`)?.setValue(digit);
        }
      });

      // Focus on the next empty input or the last one if all are filled
      const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
      inputs[nextEmptyIndex].nativeElement.focus();
    }
  }

  onSubmit() {
    if (this.verificationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Combine all digits to get the complete verification code
      const otp = Object.values(this.verificationForm.value).join('');

      console.log('Verifying OTP:', otp, 'for email:', this.email);

      if (!this.email) {
        this.errorMessage = 'Email address is missing. Please go back to the forgot password page.';
        this.isLoading = false;
        return;
      }

      this.apisService.verifyOtp(this.email, otp).subscribe(
        (response) => {
          console.log('OTP verification successful', response);
          this.isLoading = false;
          this.successMessage = 'Verification successful!';

          // Store any necessary data from the response
          if (response.token) {
            localStorage.setItem('resetToken', response.token);
          } else if (response.resetToken) {
            localStorage.setItem('resetToken', response.resetToken);
          } else {
            console.warn('No token found in response:', response);
            // If no token is found, we might need to handle this case
            // For now, let's create a dummy token for testing
            localStorage.setItem('resetToken', 'dummy-token-for-testing');
          }

          // Navigate to reset password page
          setTimeout(() => {
            this.router.navigate(['/new-password'], {
              queryParams: { email: this.email }
            });
          }, 1500);
        },
        (error) => {
          console.error('OTP verification failed', error);
          this.isLoading = false;

          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to the server. Please check your internet connection.';
          } else if (error.status === 400) {
            // Log the detailed error for debugging
            console.log('Error details:', error.error);

            // Try to extract more specific error message
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else if (error.error && typeof error.error === 'string') {
              this.errorMessage = error.error;
            } else if (error.error && error.error.errors) {
              // If there's a list of errors, display them
              this.errorMessage = Object.values(error.error.errors).join(', ');
            } else {
              this.errorMessage = 'Invalid verification code. Please check and try again.';
            }
          } else {
            this.errorMessage = error.error?.message || 'Verification failed. Please try again.';
          }

          this.formState = 'invalid';
          setTimeout(() => this.formState = 'valid', 1000);
        }
      );
    } else {
      this.formState = 'invalid';
      setTimeout(() => this.formState = 'valid', 1000);
      this.markFormGroupTouched(this.verificationForm);
    }
  }

  resendCode() {
    if (!this.email) {
      this.errorMessage = 'Email address is missing. Please go back to the forgot password page.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apisService.forgotPassword(this.email).subscribe(
      (response) => {
        console.log('Code resent successfully', response);
        this.isLoading = false;
        this.successMessage = 'A new verification code has been sent to your email.';

        // Clear the form
        this.verificationForm.reset();
        setTimeout(() => {
          this.codeInputs.first.nativeElement.focus();
        }, 100);
      },
      (error) => {
        console.error('Failed to resend code', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to resend code. Please try again.';
      }
    );
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
