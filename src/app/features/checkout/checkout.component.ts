import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../core/components/header/header.component';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { UiHelperService } from '../../core/services/ui-helper.service';
import { LoggerService } from '../../core/services/logger.service';
import { CartItem } from '../../core/models/cart.model';
import { CreateOrderRequest } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);

  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  isLoading = false;
  isPlacingOrder = false;
  errorMessage = '';

  constructor() {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', [Validators.required]],
      shippingCity: ['', [Validators.required]],
      shippingState: ['', [Validators.required]],
      shippingZipCode: ['', [Validators.required]],
      shippingCountry: ['', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.cartItems = response.data;
          if (this.cartItems.length === 0) {
            this.router.navigate(['/cart']);
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Loading cart', error);
        this.errorMessage = 'Failed to load cart';
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

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }

    this.isPlacingOrder = true;
    this.errorMessage = '';

    const orderRequest: CreateOrderRequest = this.checkoutForm.value;

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        if (response.success) {
          // Clear cart and navigate to orders
          this.cartService.resetCart();
          this.router.navigate(['/orders'], { 
            queryParams: { success: 'true', orderId: response.data?.id } 
          });
        } else {
          this.errorMessage = response.message || 'Failed to place order';
        }
        this.isPlacingOrder = false;
      },
      error: (error) => {
        this.logger.httpError('Placing order', error);
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.errors) {
          this.errorMessage = error.error.errors.join(', ');
        } else {
          this.errorMessage = 'Failed to place order. Please try again.';
        }
        this.isPlacingOrder = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get shippingAddress() { return this.checkoutForm.get('shippingAddress'); }
  get shippingCity() { return this.checkoutForm.get('shippingCity'); }
  get shippingState() { return this.checkoutForm.get('shippingState'); }
  get shippingZipCode() { return this.checkoutForm.get('shippingZipCode'); }
  get shippingCountry() { return this.checkoutForm.get('shippingCountry'); }
}

