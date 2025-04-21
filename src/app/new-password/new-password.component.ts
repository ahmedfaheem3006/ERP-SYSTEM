import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ApisService } from '../apis.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
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
export class NewPasswordComponent implements OnInit {
  newPasswordForm!: FormGroup;
  formState = 'valid';
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  email: string = '';
  passwordHints: string[] = [
    'At least 6 characters',
    'At least 1 uppercase letter (A-Z)',
    'At least 1 lowercase letter (a-z)',
    'At least 1 number (0-9)',
    'At least 1 special character (!@#$%^&*...)'
  ];

  // Password validation status
  passwordValidation = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  };

  constructor(
    private fb: FormBuilder,
    private apisService: ApisService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.newPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        this.passwordValidator
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    // Get email from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      if (!this.email) {
        this.errorMessage = 'Email address is missing. Please go back to the forgot password page.';
      }
    });

    // Check if reset token exists
    const resetToken = localStorage.getItem('resetToken');
    console.log('Reset token found in localStorage:', !!resetToken);

    // Listen for password changes to update validation status
    this.newPasswordForm.get('password')?.valueChanges.subscribe(value => {
      this.updatePasswordValidation(value);
    });
  }

  // Custom password validator
  passwordValidator(control: any) {
    const value = control.value;

    if (!value) return null;

    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=$$$${};':"\\|,.<>\/?]/.test(value);
    const minLength = value.length >= 6;

    const valid = hasUppercase && hasLowercase && hasNumber && hasSpecial && minLength;

    return valid ? null : { invalidPassword: true };
  }

  // Update password validation status for UI feedback
  updatePasswordValidation(password: string) {
    this.passwordValidation = {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=$$$${};':"\\|,.<>\/?]/.test(password)
    };
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onSubmit() {
    if (this.newPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const newPassword = this.newPasswordForm.value.password;
      const resetToken = localStorage.getItem('resetToken');

      console.log('Resetting password for:', this.email);
      console.log('Using token from localStorage:', resetToken ? 'Token exists' : 'No token found');

      // Double-check password requirements
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasLowercase = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      const hasSpecial = /[!@#$%^&*()_+\-=$$$${};':"\\|,.<>\/?]/.test(newPassword);
      const minLength = newPassword.length >= 6;

      if (!(hasUppercase && hasLowercase && hasNumber && hasSpecial && minLength)) {
        this.errorMessage = 'Password must have 1 Uppercase, 1 Lowercase, 1 number, 1 non alphanumeric and at least 6 characters';
        this.isLoading = false;
        this.formState = 'invalid';
        setTimeout(() => this.formState = 'valid', 1000);
        return;
      }

      if (!this.email) {
        this.errorMessage = 'Email address is missing. Please go back to the forgot password page.';
        this.isLoading = false;
        return;
      }

      if (!resetToken) {
        this.errorMessage = 'Reset token is missing. Please restart the password reset process.';
        this.isLoading = false;

        // Redirect to forgot password page after delay
        setTimeout(() => {
          this.router.navigate(['/forgot-password']);
        }, 3000);

        return;
      }

      // Try with different field names for the API
      const payload = {
        email: this.email,
        token: resetToken,
        newPassword: newPassword
      };

      // Log the exact payload being sent
      console.log('Sending exact payload:', JSON.stringify(payload));

      this.apisService.resetPassword(this.email, newPassword, resetToken).subscribe(
        (response) => {
          console.log('Password reset successful', response);
          this.isLoading = false;
          this.successMessage = 'Your password has been successfully reset!';

          // Clear the token from localStorage
          localStorage.removeItem('resetToken');

          // Redirect to login page after delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        (error) => {
          console.error('Password reset failed', error);
          console.log('Full error response:', error);
          this.isLoading = false;

          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to the server. Please check your internet connection.';
          } else if (error.status === 400) {
            // Display error message from server if available
            if (error.error && error.error.errors && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
              this.errorMessage = error.error.errors[0];
            } else if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Invalid request. Please make sure your password meets the requirements.';
            }

            console.log('Error details:', error.error);
          } else if (error.status === 401) {
            this.errorMessage = 'Unauthorized. Your session may have expired. Please try the password reset process again.';
            // Redirect to forgot password page after delay
            setTimeout(() => {
              this.router.navigate(['/forgot-password']);
            }, 3000);
          } else {
            this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
          }

          this.formState = 'invalid';
          setTimeout(() => this.formState = 'valid', 1000);
        }
      );
    } else {
      this.formState = 'invalid';
      setTimeout(() => this.formState = 'valid', 1000);
      this.markFormGroupTouched(this.newPasswordForm);
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

  // Check if all password requirements are met
  get isPasswordValid(): boolean {
    return this.passwordValidation.minLength &&
           this.passwordValidation.hasUppercase &&
           this.passwordValidation.hasLowercase &&
           this.passwordValidation.hasNumber &&
           this.passwordValidation.hasSpecial;
  }
}
