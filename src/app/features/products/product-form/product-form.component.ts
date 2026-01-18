import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Category, Product, CreateProductRequest, UpdateProductRequest } from '../../../core/models/product.model';
import { UserRole } from '../../../core/models/user.model';

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
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
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
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filter only active categories
          this.categories = response.data.filter(cat => cat.isActive);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
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
        console.error('Error loading product:', error);
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
              this.router.navigate(['/products']);
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to update product';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating product:', error);
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
              this.router.navigate(['/products']);
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to create product';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating product:', error);
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

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }
}

