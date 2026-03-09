/**
 * Order Status enum
 */
export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

/**
 * Return status for an order item (from backend)
 */
export type ReturnStatus = 'None' | 'Requested' | 'Approved' | 'Rejected';

/**
 * Refund status for an order item (from backend).
 * Backend sets this to "Initiated" when a return is approved.
 * Admin can later change it to "Done" or "Refunded".
 */
export type RefundStatus = 'None' | 'Initiated' | 'Done' | 'Refunded';

/**
 * Order Item model
 */
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subTotal: number;
  /** Return status: None | Requested | Approved | Rejected */
  returnStatus?: ReturnStatus;
  returnRequestedAt?: string | null;
  returnResolvedAt?: string | null;
  returnReason?: string | null;
   /** Refund status: None | Initiated | Done | Refunded */
  refundStatus?: RefundStatus;
}

/**
 * Order model
 */
export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  /**
   * Set when the order is marked as Delivered.
   * Used together with product.returnPolicyDays to compute return window.
   */
  deliveredAt: string | null;
  orderItems: OrderItem[];
}

/**
 * Request to create an order
 */
export interface CreateOrderRequest {
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  notes?: string;
}

/**
 * Request to update order status (Admin only)
 */
export interface UpdateOrderStatusRequest {
  orderId: number;
  status: OrderStatus;
}
