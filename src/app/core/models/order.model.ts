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
 * Order Item model
 */
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subTotal: number;
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
