import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/user.model';
import {
  Product,
  Category,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApproveProductRequest
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/product`;
  private readonly categoryApiUrl = `${environment.apiUrl}/api/productcategory`;

  // ==================== CATEGORY APIs ====================

  /**
   * Get all categories (Public)
   */
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.categoryApiUrl);
  }

  /**
   * Get category by ID (Public)
   */
  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.categoryApiUrl}/${id}`);
  }

  /**
   * Create category (Admin only)
   */
  createCategory(category: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.categoryApiUrl, category);
  }

  /**
   * Update category (Admin only)
   */
  updateCategory(id: number, category: UpdateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.categoryApiUrl}/${id}`, category);
  }

  /**
   * Delete category (Admin only) - Soft delete
   */
  deleteCategory(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.categoryApiUrl}/${id}`);
  }

  // ==================== PRODUCT APIs ====================

  /**
   * Get all products (filtered by role)
   * - Customers/Public: See only approved products
   * - Admin/Seller: See all products
   */
  getAllProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl);
  }

  /**
   * Get approved products only (Public)
   */
  getApprovedProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/approved`);
  }

  /**
   * Get pending products (Admin only)
   */
  getPendingProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/pending`);
  }

  /**
   * Get products by seller (Admin or Seller)
   */
  getProductsBySeller(sellerId: number): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/seller/${sellerId}`);
  }

  /**
   * Get product by ID (filtered by role)
   */
  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create product (Admin or Seller)
   */
  createProduct(product: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
  }

  /**
   * Update product (Admin or Seller)
   */
  updateProduct(id: number, product: UpdateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Delete product (Admin or Seller) - Soft delete
   */
  deleteProduct(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Approve/Reject product (Admin only)
   */
  approveProduct(productId: number, approved: boolean): Observable<ApiResponse<any>> {
    const request: ApproveProductRequest = { productId, approved };
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/approve`, request);
  }
}

