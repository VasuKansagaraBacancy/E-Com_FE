import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductStatus } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-approval',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './product-approval.component.html',
  styleUrl: './product-approval.component.scss'
})
export class ProductApprovalComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);

  pendingProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  goBackToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  loadPendingProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getPendingProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pendingProducts = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load pending products';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pending products:', error);
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'You do not have permission to view pending products.';
        } else {
          this.errorMessage = 'An error occurred while loading pending products.';
        }
        this.isLoading = false;
      }
    });
  }

  approveProduct(productId: number, productName: string): void {
    if (confirm(`Are you sure you want to approve "${productName}"?`)) {
      this.updateProductStatus(productId, true);
    }
  }

  rejectProduct(productId: number, productName: string): void {
    if (confirm(`Are you sure you want to reject "${productName}"?`)) {
      this.updateProductStatus(productId, false);
    }
  }

  private updateProductStatus(productId: number, approved: boolean): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.approveProduct(productId, approved).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message || `Product ${approved ? 'approved' : 'rejected'} successfully!`;
          this.loadPendingProducts(); // Refresh list
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = response.message || `Failed to ${approved ? 'approve' : 'reject'} product`;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating product status:', error);
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = `An error occurred while ${approved ? 'approving' : 'rejecting'} the product.`;
        }
        this.isLoading = false;
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://via.placeholder.com/300x200?text=No+Image';
    }
  }
}

