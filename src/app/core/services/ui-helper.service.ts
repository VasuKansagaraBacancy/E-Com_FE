import { Injectable } from '@angular/core';
import { DEFAULT_IMAGE_URL } from '../constants/validation.constants';

/**
 * UI Helper service for common UI utilities
 * Centralizes image handling, formatting, and other UI helpers
 */
@Injectable({
  providedIn: 'root'
})
export class UiHelperService {
  
  /**
   * Handle image load error by setting a fallback image
   * Use in templates: (error)="uiHelper.handleImageError($event)"
   */
  handleImageError(event: Event, fallbackUrl: string = DEFAULT_IMAGE_URL): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== fallbackUrl) {
      img.src = fallbackUrl;
    }
  }

  /**
   * Hide image on error (alternative to fallback)
   */
  hideImageOnError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }

  /**
   * Format price as currency
   */
  formatPrice(price: number, currency: string = 'USD', locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  /**
   * Format date to localized string
   */
  formatDate(dateString: string | null, options?: Intl.DateTimeFormatOptions): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options || defaultOptions);
  }

  /**
   * Format date without time
   */
  formatDateShort(dateString: string | null): string {
    return this.formatDate(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get image URL with fallback
   */
  getImageUrl(url: string | null | undefined): string {
    return url || DEFAULT_IMAGE_URL;
  }

  /**
   * Truncate text with ellipsis
   */
  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Get status badge CSS class
   */
  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'status-badge active' : 'status-badge inactive';
  }

  /**
   * Get role badge CSS class
   */
  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin':
        return 'role-badge admin';
      case 'Seller':
        return 'role-badge seller';
      case 'Customer':
        return 'role-badge customer';
      default:
        return 'role-badge';
    }
  }

  /**
   * Get product status badge CSS class
   */
  getProductStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'status-badge approved';
      case 'Pending':
        return 'status-badge pending';
      case 'Rejected':
        return 'status-badge rejected';
      default:
        return 'status-badge';
    }
  }
}

