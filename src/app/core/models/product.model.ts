export enum ProductStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  /**
   * Number of days after delivery during which user can request a return.
   * 0 = no returns allowed.
   */
  returnPolicyDays: number;
  createdByUserId: number;
  createdByEmail: string;
  status: ProductStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  approvedAt: string | null;
  approvedByUserId: number | null;
  approvedByEmail: string | null;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  /** Number of days after delivery during which returns are allowed (0–365). 0 = no returns. */
  returnPolicyDays: number;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  /** Number of days after delivery during which returns are allowed (0–365). 0 = no returns. */
  returnPolicyDays: number;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export interface ApproveProductRequest {
  productId: number;
  approved: boolean;
}




