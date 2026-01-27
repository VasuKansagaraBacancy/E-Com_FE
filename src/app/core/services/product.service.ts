import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ApproveProductRequest
} from '../models/product.model';

/**
 * Service for Product-related API calls
 * Category operations are handled by CategoryService
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/product`;

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
