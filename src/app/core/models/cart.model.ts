/**
 * Cart Item model
 */
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImageUrl: string;
  quantity: number;
  subTotal: number;
  createdAt: string;
}

/**
 * Request to add item to cart
 */
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

/**
 * Request to update cart item quantity
 */
export interface UpdateCartItemRequest {
  quantity: number;
}

