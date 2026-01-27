/**
 * Standardized API Response interface used across all services
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

/**
 * Paginated API Response for list endpoints
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data?: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  message?: string;
  errors?: string[];
}

