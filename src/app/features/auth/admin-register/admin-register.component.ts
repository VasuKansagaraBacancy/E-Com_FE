import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.scss'
})
export class AdminRegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  // Only Admin and Seller roles available for admin registration
  roles = [UserRole.Admin, UserRole.Seller, UserRole.Customer];

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      role: [UserRole.Seller, [Validators.required]] // Default to Seller
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { confirmPassword, ...registerData } = this.registerForm.value;
    const registerRequest: RegisterRequest = registerData;

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `${registerRequest.role} account created successfully!`;
          // Reset form after successful registration
          setTimeout(() => {
            this.registerForm.reset({
              role: UserRole.Seller
            });
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Registration error:', error);
        
        if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check if the backend is running and CORS is configured.';
        } else if (error.status === 404) {
          this.errorMessage = 'API endpoint not found. Please check the API URL.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An error occurred during registration. Please check the console for details.';
        }
        
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get role() {
    return this.registerForm.get('role');
  }
}

