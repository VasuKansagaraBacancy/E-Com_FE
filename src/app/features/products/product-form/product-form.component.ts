import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Category, CreateProductRequest, UpdateProductRequest } from '../../../core/models/product.model';
import { UserRole } from '../../../core/models/user.model';
import { VALIDATION } from '../../../core/constants/validation.constants';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  public navigationService = inject(NavigationService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);
  private route = inject(ActivatedRoute);

  productForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  isEditMode = false;
  productId: number | null = null;
  errorMessage = '';
  successMessage = '';
  isAdmin = false;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(VALIDATION.PRODUCT_NAME_MAX_LENGTH)]],
      description: ['', [Validators.maxLength(VALIDATION.PRODUCT_DESCRIPTION_MAX_LENGTH)]],
      price: ['', [Validators.required, Validators.min(VALIDATION.PRICE_MIN)]],
      stockQuantity: ['', [Validators.required, Validators.min(VALIDATION.STOCK_MIN)]],
      imageUrl: ['', [Validators.required]],
      categoryId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser?.role === UserRole.Admin;

    // Check if editing
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct();
      }
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filter only active categories
          this.categories = response.data.filter(cat => cat.isActive);
        }
      },
      error: (error) => {
        this.logger.httpError('Loading categories', error);
        this.errorMessage = 'Failed to load categories. Please try again.';
      }
    });
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const product = response.data;
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            imageUrl: product.imageUrl,
            categoryId: product.categoryId
          });
        } else {
          this.errorMessage = response.message || 'Failed to load product';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Loading product', error);
        if (error.status === 404) {
          this.errorMessage = 'Product not found.';
        } else {
          this.errorMessage = 'An error occurred while loading the product.';
        }
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.productForm.value;
    
    if (this.isEditMode && this.productId) {
      const updateRequest: UpdateProductRequest = formValue;
      this.productService.updateProduct(this.productId, updateRequest).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = response.message || 'Product updated successfully!';
            setTimeout(() => {
              this.navigationService.goToProducts();
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to update product';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.logger.httpError('Updating product', error);
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.error?.errors) {
            this.errorMessage = error.error.errors.join(', ');
          } else {
            this.errorMessage = 'An error occurred while updating the product.';
          }
          this.isLoading = false;
        }
      });
    } else {
      const createRequest: CreateProductRequest = formValue;
      this.productService.createProduct(createRequest).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = response.message || 'Product created successfully!';
            setTimeout(() => {
              this.navigationService.goToProducts();
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to create product';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.logger.httpError('Creating product', error);
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.error?.errors) {
            this.errorMessage = error.error.errors.join(', ');
          } else {
            this.errorMessage = 'An error occurred while creating the product.';
          }
          this.isLoading = false;
        }
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stockQuantity() { return this.productForm.get('stockQuantity'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }
  get categoryId() { return this.productForm.get('categoryId'); }

  goBack(): void {
    this.navigationService.goToDashboard();
  }
}
