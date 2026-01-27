import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { LoggerService } from '../../../core/services/logger.service';
import { LoginRequest, UserRole } from '../../../core/models/user.model';
import { VALIDATION } from '../../../core/constants/validation.constants';
import { environment } from '../../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  private logger = inject(LoggerService);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isGoogleLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(VALIDATION.PASSWORD_MIN_LENGTH)]]
    });
  }

  ngOnInit(): void {
    // Initialize Google Sign-In when component loads
    if (typeof google !== 'undefined') {
      this.initializeGoogleSignIn();
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (typeof google !== 'undefined') {
          clearInterval(checkGoogle);
          this.initializeGoogleSignIn();
        }
      }, 100);
    }
  }

  ngAfterViewInit(): void {
    // Render Google button after view initializes
    if (typeof google !== 'undefined') {
      this.renderGoogleButton();
    } else {
      const checkGoogle = setInterval(() => {
        if (typeof google !== 'undefined') {
          clearInterval(checkGoogle);
          this.renderGoogleButton();
        }
      }, 100);
    }
  }

  private initializeGoogleSignIn(): void {
    if (typeof google === 'undefined' || !environment.googleClientId) {
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleGoogleResponse(response)
      });
    } catch (error) {
      this.logger.error('Error initializing Google Sign-In:', error);
    }
  }

  private renderGoogleButton(): void {
    if (typeof google === 'undefined' || !environment.googleClientId) {
      return;
    }

    try {
      const buttonDiv = document.getElementById('googleSignInDiv');
      if (buttonDiv) {
        google.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          locale: 'en'
        });
      }
    } catch (error) {
      this.logger.error('Error rendering Google button:', error);
    }
  }

  private handleGoogleResponse(response: any): void {
    if (!response || !response.credential) {
      this.errorMessage = 'Google authentication failed. Please try again.';
      return;
    }

    const idToken = response.credential;
    this.isGoogleLoading = true;
    this.errorMessage = '';

    this.authService.googleLogin(idToken).subscribe({
      next: (apiResponse) => {
        if (apiResponse.success && apiResponse.data) {
          const userRole = apiResponse.data.role || UserRole.Customer;
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          this.navigationService.redirectAfterLogin(userRole, returnUrl);
        } else {
          this.errorMessage = apiResponse.message || 'Google login failed';
        }
        this.isGoogleLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Google login', error);
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An error occurred during Google login. Please try again.';
        }
        this.isGoogleLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData: LoginRequest = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        if (response.success) {
          const user = this.authService.getCurrentUser();
          const userRole = user?.role || response.data?.role || null;
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          this.navigationService.redirectAfterLogin(userRole, returnUrl);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Login', error);
        this.errorMessage = error.error?.message || 'An error occurred during login';
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
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
