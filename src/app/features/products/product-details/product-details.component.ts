import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { ProductService } from '../../../core/services/product.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Product, ProductStatus } from '../../../core/models/product.model';
import { UserRole } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  public navigationService = inject(NavigationService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);

  product: Product | null = null;
  isLoading = false;
  errorMessage = '';
  productId: number | null = null;
  
  isAdmin = false;
  isSeller = false;
  isCustomer = false;
  canEdit = false;

  ngOnInit(): void {
    // Set role flags
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser?.role === UserRole.Admin;
    this.isSeller = currentUser?.role === UserRole.Seller;
    this.isCustomer = currentUser?.role === UserRole.Customer;

    // Get product ID from route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.product = response.data;
          this.checkEditPermission();
        } else {
          this.errorMessage = response.message || 'Failed to load product';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Loading product', error);
        if (error.status === 404) {
          this.errorMessage = 'Product not found.';
        } else if (error.status === 403) {
          this.errorMessage = 'You do not have permission to view this product.';
        } else {
          this.errorMessage = 'An error occurred while loading the product.';
        }
        this.isLoading = false;
      }
    });
  }

  private checkEditPermission(): void {
    if (!this.product) {
      this.canEdit = false;
      return;
    }

    if (this.isAdmin) {
      this.canEdit = true;
      return;
    }

    if (this.isSeller) {
      const currentUser = this.authService.getCurrentUser();
      this.canEdit = currentUser?.email === this.product.createdByEmail;
      return;
    }

    this.canEdit = false;
  }

  getStatusBadgeClass(): string {
    if (!this.product) return 'status-badge';
    return this.uiHelper.getProductStatusBadgeClass(this.product.status);
  }

  goBack(): void {
    this.navigationService.goToProducts();
  }

  editProduct(): void {
    if (this.productId) {
      this.navigationService.goToProductEdit(this.productId);
    }
  }
}

