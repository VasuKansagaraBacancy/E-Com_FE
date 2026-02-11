import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../core/components/header/header.component';
import { CartService } from '../../core/services/cart.service';
import { NavigationService } from '../../core/services/navigation.service';
import { UiHelperService } from '../../core/services/ui-helper.service';
import { LoggerService } from '../../core/services/logger.service';
import { CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  public navigationService = inject(NavigationService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);

  cartItems: CartItem[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cartService.getCart().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.cartItems = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load cart';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Loading cart', error);
        this.errorMessage = 'Failed to load cart. Please try again.';
        this.isLoading = false;
      }
    });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }

    this.isLoading = true;
    this.cartService.updateCartItem(item.id, { quantity: newQuantity }).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Quantity updated';
          this.loadCart();
          setTimeout(() => this.successMessage = '', 2000);
        } else {
          this.errorMessage = response.message || 'Failed to update quantity';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Updating cart', error);
        this.errorMessage = error.error?.message || 'Failed to update quantity';
        this.isLoading = false;
      }
    });
  }

  removeItem(item: CartItem): void {
    if (!confirm(`Remove "${item.productName}" from cart?`)) return;

    this.isLoading = true;
    this.cartService.removeFromCart(item.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Item removed from cart';
          this.loadCart();
          setTimeout(() => this.successMessage = '', 2000);
        } else {
          this.errorMessage = response.message || 'Failed to remove item';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Removing from cart', error);
        this.errorMessage = 'Failed to remove item';
        this.isLoading = false;
      }
    });
  }

  clearCart(): void {
    if (!confirm('Clear all items from your cart?')) return;

    this.isLoading = true;
    this.cartService.clearCart().subscribe({
      next: (response) => {
        if (response.success) {
          this.cartItems = [];
          this.successMessage = 'Cart cleared';
          setTimeout(() => this.successMessage = '', 2000);
        } else {
          this.errorMessage = response.message || 'Failed to clear cart';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Clearing cart', error);
        this.errorMessage = 'Failed to clear cart';
        this.isLoading = false;
      }
    });
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  goBack(): void {
    this.navigationService.goToProducts();
  }
}

