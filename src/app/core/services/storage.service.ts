import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setUser(user: any): void {
    if (user) {
      // Ensure we're storing a valid object, not undefined
      const userToStore = typeof user === 'object' ? user : { role: user };
      localStorage.setItem(this.USER_KEY, JSON.stringify(userToStore));
    }
  }

  getUser(): any | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      const user = JSON.parse(userStr);
      return user;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'Admin';
  }
}



