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
    const user = this.storageService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.storageService.setToken(response.data.token);
            this.storageService.setUser(response.data.user);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<any>> {
    console.log('Registering user:', { url: `${this.apiUrl}/register`, data: userData });
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
}

