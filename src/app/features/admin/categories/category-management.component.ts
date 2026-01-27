import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { CategoryService } from '../../../core/services/category.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../core/models/product.model';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  public navigationService = inject(NavigationService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);

  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isEditing = false;
  editingCategoryId: number | null = null;
  
  categoryForm: FormGroup;

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  goBackToDashboard(): void {
    this.navigationService.goToDashboard();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load categories';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Loading categories', error);
        this.errorMessage = 'An error occurred while loading categories.';
        this.isLoading = false;
      }
    });
  }

  startCreate(): void {
    this.isEditing = false;
    this.editingCategoryId = null;
    this.categoryForm.reset({ isActive: true });
  }

  startEdit(category: Category): void {
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingCategoryId = null;
    this.categoryForm.reset({ isActive: true });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched(this.categoryForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.categoryForm.value;

    if (this.isEditing && this.editingCategoryId) {
      const updateRequest: UpdateCategoryRequest = formValue;
      this.categoryService.updateCategory(this.editingCategoryId, updateRequest).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = response.message || 'Category updated successfully!';
            this.loadCategories();
            this.cancelEdit();
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          } else {
            this.errorMessage = response.message || 'Failed to update category';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.logger.httpError('Updating category', error);
          this.errorMessage = error.error?.message || 'An error occurred while updating the category.';
          this.isLoading = false;
        }
      });
    } else {
      const createRequest: CreateCategoryRequest = {
        name: formValue.name,
        description: formValue.description
      };
      this.categoryService.createCategory(createRequest).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = response.message || 'Category created successfully!';
            this.loadCategories();
            this.cancelEdit();
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          } else {
            this.errorMessage = response.message || 'Failed to create category';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.logger.httpError('Creating category', error);
          this.errorMessage = error.error?.message || 'An error occurred while creating the category.';
          this.isLoading = false;
        }
      });
    }
  }

  deleteCategory(categoryId: number, categoryName: string): void {
    if (confirm(`Are you sure you want to delete "${categoryName}"? This will deactivate the category.`)) {
      this.isLoading = true;
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = response.message || 'Category deleted successfully!';
            this.loadCategories();
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          } else {
            this.errorMessage = response.message || 'Failed to delete category';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.logger.httpError('Deleting category', error);
          this.errorMessage = error.error?.message || 'An error occurred while deleting the category.';
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() { return this.categoryForm.get('name'); }
  get description() { return this.categoryForm.get('description'); }
}
