export enum UserRole {
  Admin = 'Admin',
  Seller = 'Seller',
  Customer = 'Customer'
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  expiresAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  otp: string;
  email: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}



