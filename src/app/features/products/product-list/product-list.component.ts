import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
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
  private authService = inject(AuthService);
  private router = inject(Router);

  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  currentUserRole: UserRole | null = null;
  isAdmin = false;
  isSeller = false;
  isCustomer = false;

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserRole = currentUser?.role || null;
    this.isAdmin = this.currentUserRole === UserRole.Admin;
    this.isSeller = this.currentUserRole === UserRole.Seller;
    this.isCustomer = this.currentUserRole === UserRole.Customer;

    this.loadProducts();
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
        console.error('Error loading products:', error);
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
          console.error('Error deleting product:', error);
          this.errorMessage = error.error?.message || 'An error occurred while deleting the product.';
          this.isLoading = false;
        }
      });
    }
  }

  getStatusBadgeClass(status: ProductStatus): string {
    switch (status) {
      case ProductStatus.Approved:
        return 'status-badge approved';
      case ProductStatus.Pending:
        return 'status-badge pending';
      case ProductStatus.Rejected:
        return 'status-badge rejected';
      default:
        return 'status-badge';
    }
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}

