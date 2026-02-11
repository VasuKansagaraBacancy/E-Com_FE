import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Product, ProductStatus } from '../../../core/models/product.model';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  public navigationService = inject(NavigationService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);

  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentUserRole: UserRole | null = null;
  isAdmin = false;
  isSeller = false;
  isCustomer = false;
  addingToCart: Set<number> = new Set();

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserRole = currentUser?.role || null;
    this.isAdmin = this.currentUserRole === UserRole.Admin;
    this.isSeller = this.currentUserRole === UserRole.Seller;
    this.isCustomer = this.currentUserRole === UserRole.Customer;

    this.loadProducts();
  }

  goBack(): void {
    this.navigationService.goToDashboard();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    let productObservable;
    
    if (this.isAdmin) {
      // Admin sees all products
      productObservable = this.productService.getAllProducts();
    } else if (this.isSeller) {
      // Seller sees all products (to see their own)
      productObservable = this.productService.getAllProducts();
    } else {
      // Customer/Public sees only approved products
      productObservable = this.productService.getApprovedProducts();
    }

    productObservable.subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load products';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Loading products', error);
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized. Please log in again.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred while loading products. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  deleteProduct(productId: number, productName: string): void {
    if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      this.isLoading = true;
      this.productService.deleteProduct(productId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts(); // Refresh list
          } else {
            this.errorMessage = response.message || 'Failed to delete product';
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.logger.httpError('Deleting product', error);
          this.errorMessage = error.error?.message || 'An error occurred while deleting the product.';
          this.isLoading = false;
        }
      });
    }
  }

  getStatusBadgeClass(status: ProductStatus): string {
    return this.uiHelper.getProductStatusBadgeClass(status);
  }

  canEditProduct(product: Product): boolean {
    if (this.isAdmin) return true;
    if (this.isSeller) {
      const currentUser = this.authService.getCurrentUser();
      // Seller can only edit their own products
      return currentUser?.email === product.createdByEmail;
    }
    return false;
  }

  canDeleteProduct(product: Product): boolean {
    return this.canEditProduct(product);
  }

  viewProductDetails(productId: number): void {
    this.navigationService.goToProductDetails(productId);
  }

  addToCart(product: Product): void {
    if (this.addingToCart.has(product.id)) return;
    
    this.addingToCart.add(product.id);
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `"${product.name}" added to cart!`;
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message || 'Failed to add to cart';
        }
        this.addingToCart.delete(product.id);
      },
      error: (error) => {
        this.logger.httpError('Adding to cart', error);
        this.errorMessage = error.error?.message || 'Failed to add to cart. Please try again.';
        this.addingToCart.delete(product.id);
      }
    });
  }

  isAddingToCart(productId: number): boolean {
    return this.addingToCart.has(productId);
  }

  canAddToCart(product: Product): boolean {
    return this.isCustomer && 
           product.status === ProductStatus.Approved && 
           product.stockQuantity > 0;
  }
}
