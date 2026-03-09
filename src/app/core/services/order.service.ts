import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Order, CreateOrderRequest, UpdateOrderStatusRequest } from '../models/order.model';

/**
 * Service for Order-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/order`;

  /**
   * Get current user's orders
   */
  getMyOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(this.apiUrl);
  }

  /**
   * Get all orders (Admin only)
   */
  getAllOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/admin`);
  }

  /**
   * Get order by ID
   */
  getOrderById(id: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create order from cart
   */
  createOrder(request: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, request);
  }

  /**
   * Update order status (Admin only)
   */
  updateOrderStatus(request: UpdateOrderStatusRequest): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/status`, request);
  }

  /**
   * Request a return for a specific order item (Customer).
   * POST /api/order/return with body { orderItemId, reason }
   */
  requestReturn(orderItemId: number, reason: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/return`, {
      orderItemId,
      reason
    });
  }

  /**
   * Resolve a return request (Admin or Seller).
   * POST /api/order/return/resolve with body { orderItemId, approved, note }
   */
  resolveReturn(orderItemId: number, approved: boolean, note: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/return/resolve`, {
      orderItemId,
      approved,
      note
    });
  }

  /**
   * Update refund status (Admin only).
   * PUT /api/order/return/refund-status with body { orderItemId, refundStatus }
   * Valid refundStatus: "None" | "Initiated" | "Done" | "Refunded"
   */
  updateRefundStatus(
    orderItemId: number,
    refundStatus: 'None' | 'Initiated' | 'Done' | 'Refunded'
  ): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/return/refund-status`, {
      orderItemId,
      refundStatus
    });
  }
}
