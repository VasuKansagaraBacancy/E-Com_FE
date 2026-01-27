import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { ProductService } from '../../../core/services/product.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-approval',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './product-approval.component.html',
  styleUrl: './product-approval.component.scss'
})
export class ProductApprovalComponent implements OnInit {
  private productService = inject(ProductService);
  public navigationService = inject(NavigationService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);

  pendingProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  goBackToDashboard(): void {
    this.navigationService.goToDashboard();
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
        this.logger.httpError('Loading pending products', error);
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
        this.logger.httpError('Updating product status', error);
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = `An error occurred while ${approved ? 'approving' : 'rejecting'} the product.`;
        }
        this.isLoading = false;
      }
    });
  }
}
