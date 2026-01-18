import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="admin-dashboard-container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to your admin dashboard</p>
      </div>
      <div class="dashboard-content">
        <div class="quick-actions">
          <a routerLink="/auth/admin-register" class="action-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <h3>Register New User</h3>
            <p>Create Admin or Seller accounts</p>
          </a>
          <a routerLink="/admin/users" class="action-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h3>Manage Users</h3>
            <p>View and manage all users</p>
          </a>
          <a routerLink="/admin/categories" class="action-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            <h3>Manage Categories</h3>
            <p>Create and manage product categories</p>
          </a>
          <a routerLink="/admin/products/approval" class="action-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <h3>Product Approval</h3>
            <p>Review and approve pending products</p>
          </a>
          <a routerLink="/products" class="action-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="3" y1="9" x2="21" y2="9"></line>
            </svg>
            <h3>All Products</h3>
            <p>View and manage all products</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-container {
      min-height: 100vh;
      padding: 40px;
      background: #f7fafc;
    }
    .dashboard-header {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    h1 {
      color: #2d3748;
      margin-bottom: 10px;
    }
    .dashboard-content {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    .action-card {
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
      text-decoration: none;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }
    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    .action-card svg {
      stroke-width: 2;
      opacity: 0.9;
    }
    .action-card h3 {
      margin: 0;
      font-size: 20px;
    }
    .action-card p {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }
  `]
})
export class AdminDashboardComponent {}

