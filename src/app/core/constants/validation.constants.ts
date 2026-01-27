/**
 * Shared validation constants used across the application
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 254,
  PRODUCT_NAME_MAX_LENGTH: 200,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 2000,
  PRICE_MIN: 0.01,
  STOCK_MIN: 0
} as const;

/**
 * Default placeholder image URL
 */
export const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/300x200?text=No+Image';

/**
 * Route paths constants
 */
export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ADMIN_REGISTER: '/auth/admin-register'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    CATEGORIES: '/admin/categories',
    PRODUCT_APPROVAL: '/admin/products/approval'
  },
  SELLER: {
    DASHBOARD: '/seller/dashboard'
  },
  CUSTOMER: {
    HOME: '/home'
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products/create',
    EDIT: (id: number) => `/products/edit/${id}`,
    DETAILS: (id: number) => `/products/${id}`
  }
} as const;

