import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, UserManagement, UpdateUserStatusRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/user`;

  /**
   * Get all users
   * Returns list of all users ordered by creation date (newest first)
   */
  getUsers(): Observable<ApiResponse<UserManagement[]>> {
    return this.http.get<ApiResponse<UserManagement[]>>(this.apiUrl);
  }

  /**
   * Get user by ID
   * @param id User ID
   */
  getUserById(id: number): Observable<ApiResponse<UserManagement>> {
    return this.http.get<ApiResponse<UserManagement>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update user status (activate/deactivate)
   * @param userId User ID to update
   * @param isActive New status (true = activate, false = deactivate)
   */
  updateUserStatus(userId: number, isActive: boolean): Observable<ApiResponse<any>> {
    const request: UpdateUserStatusRequest = { userId, isActive };
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/status`, request);
  }
}

