import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
  User
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageService = inject(StorageService);
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.storageService.getUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly apiUrl = `${environment.apiUrl}/api/Auth`;

  constructor() {
    // Initialize user from storage if available
    let user = this.storageService.getUser();
    
    // If user is not in storage but token exists, try to decode token
    if (!user) {
      const token = this.storageService.getToken();
      if (token) {
        user = this.decodeTokenToUser(token);
        if (user) {
          // Store the decoded user in localStorage
          this.storageService.setUser(user);
        }
      }
    }
    
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            const token = response.data.token;
            
            // Extract user data directly from response.data (not nested in user property)
            const user: User = {
              email: response.data.email || credentials.email,
              firstName: response.data.firstName || '',
              lastName: response.data.lastName || '',
              role: response.data.role || 'Customer' as any
            };

            // Store token and user
            this.storageService.setToken(token);
            this.storageService.setUser(user);
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  private decodeTokenToUser(token: string): User | null {
    try {
      // JWT tokens have 3 parts separated by dots: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Extract user information from token claims based on ASP.NET Core JWT structure
      const user: User = {
        id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email || '',
        firstName: payload.FirstName || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || '',
        lastName: payload.LastName || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || '',
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || 'Customer'
      };

      return user;
    } catch (error) {
      return null;
    }
  }

  register(userData: RegisterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/register`, userData);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/reset-password`, request);
  }

  logout(): void {
    this.storageService.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.storageService.isAuthenticated();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    // Check from current user subject first, then fallback to localStorage
    const user = this.getCurrentUser();
    if (user?.role === 'Admin') {
      return true;
    }
    // Fallback to localStorage check
    return this.storageService.isAdmin();
  }

  getRoleFromStorage(): string | null {
    return this.storageService.getUserRole();
  }
}

