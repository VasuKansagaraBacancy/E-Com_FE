import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CartItem, AddToCartRequest, UpdateCartItemRequest } from '../models/cart.model';

/**
 * Service for Cart-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/cart`;

  // Cart count for header badge
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  // Cart items for reactive updates
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  /**
   * Get current user's cart
   */
  getCart(): Observable<ApiResponse<CartItem[]>> {
    return this.http.get<ApiResponse<CartItem[]>>(this.apiUrl).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.cartItemsSubject.next(response.data);
          this.cartCountSubject.next(response.data.reduce((sum, item) => sum + item.quantity, 0));
        }
      })
    );
  }

  /**
   * Add item to cart
   */
  addToCart(request: AddToCartRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, request).pipe(
      tap(response => {
        if (response.success) {
          // Refresh cart after adding
          this.getCart().subscribe();
        }
      })
    );
  }

  /**
   * Update cart item quantity
   */
  updateCartItem(id: number, request: UpdateCartItemRequest): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, request).pipe(
      tap(response => {
        if (response.success) {
          this.getCart().subscribe();
        }
      })
    );
  }

  /**
   * Remove item from cart
   */
  removeFromCart(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        if (response.success) {
          this.getCart().subscribe();
        }
      })
    );
  }

  /**
   * Clear entire cart
   */
  clearCart(): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/clear`).pipe(
      tap(response => {
        if (response.success) {
          this.cartItemsSubject.next([]);
          this.cartCountSubject.next(0);
        }
      })
    );
  }

  /**
   * Get current cart count
   */
  getCartCount(): number {
    return this.cartCountSubject.value;
  }

  /**
   * Get cart total
   */
  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((sum, item) => sum + item.subTotal, 0);
  }

  /**
   * Reset cart state (on logout)
   */
  resetCart(): void {
    this.cartItemsSubject.next([]);
    this.cartCountSubject.next(0);
  }
}
