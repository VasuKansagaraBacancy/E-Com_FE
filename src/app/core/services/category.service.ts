
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../models/product.model';

/**
 * Service for Category-related API calls
 * Separated from ProductService for better separation of concerns
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/productcategory`;

  /**
   * Get all categories (Public)
   */
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl);
  }

  /**
   * Get active categories only
   */
  getActiveCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl);
  }

  /**
   * Get category by ID (Public)
   */
  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create category (Admin only)
   */
  createCategory(category: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, category);
  }

  /**
   * Update category (Admin only)
   */
  updateCategory(id: number, category: UpdateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, category);
  }

  /**
   * Delete category (Admin only) - Soft delete
   */
  deleteCategory(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}

