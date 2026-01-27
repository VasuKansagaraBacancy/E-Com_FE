import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../models/user.model';
import { AuthService } from './auth.service';
import { ROUTES } from '../constants/validation.constants';

/**
 * Centralized navigation service for role-based routing
 * Eliminates duplicate navigation logic across components
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);
  private authService = inject(AuthService);

  /**
   * Navigate to the appropriate dashboard based on user role
   */
  goToDashboard(): void {
    const dashboardUrl = this.getDashboardUrl();
    this.router.navigate([dashboardUrl]);
  }

  /**
   * Get the dashboard URL for the current user's role
   */
  getDashboardUrl(): string {
    const user = this.authService.getCurrentUser();
    return this.getDashboardUrlByRole(user?.role || null);
  }

  /**
   * Get dashboard URL by specific role
   */
  getDashboardUrlByRole(role: UserRole | string | null): string {
    switch (role) {
      case UserRole.Admin:
      case 'Admin':
        return ROUTES.ADMIN.DASHBOARD;
      case UserRole.Seller:
      case 'Seller':
        return ROUTES.SELLER.DASHBOARD;
      case UserRole.Customer:
      case 'Customer':
      default:
        return ROUTES.CUSTOMER.HOME;
    }
  }

  /**
   * Redirect after successful login based on role
   * @param role User role
   * @param returnUrl Optional return URL to redirect to instead
   */
  redirectAfterLogin(role: UserRole | string | null, returnUrl?: string): void {
    if (returnUrl) {
      this.router.navigate([returnUrl]);
      return;
    }
    
    const dashboardUrl = this.getDashboardUrlByRole(role);
    this.router.navigate([dashboardUrl]);
  }

  /**
   * Navigate to login page
   * @param returnUrl Optional URL to return to after login
   */
  goToLogin(returnUrl?: string): void {
    if (returnUrl) {
      this.router.navigate([ROUTES.AUTH.LOGIN], { queryParams: { returnUrl } });
    } else {
      this.router.navigate([ROUTES.AUTH.LOGIN]);
    }
  }

  /**
   * Navigate to products list
   */
  goToProducts(): void {
    this.router.navigate([ROUTES.PRODUCTS.LIST]);
  }

  /**
   * Navigate to product create form
   */
  goToProductCreate(): void {
    this.router.navigate([ROUTES.PRODUCTS.CREATE]);
  }

  /**
   * Navigate to product edit form
   */
  goToProductEdit(productId: number): void {
    this.router.navigate([ROUTES.PRODUCTS.EDIT(productId)]);
  }

  /**
   * Navigate to product details
   */
  goToProductDetails(productId: number): void {
    this.router.navigate([ROUTES.PRODUCTS.DETAILS(productId)]);
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /**
   * Check if user is seller
   */
  isSeller(): boolean {
    return this.authService.hasRole('Seller');
  }

  /**
   * Check if user is customer
   */
  isCustomer(): boolean {
    return this.authService.hasRole('Customer');
  }

  /**
   * Get current user role
   */
  getCurrentRole(): UserRole | null {
    const user = this.authService.getCurrentUser();
    return user?.role || null;
  }
}

