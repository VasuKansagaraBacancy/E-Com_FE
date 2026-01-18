import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="seller-dashboard-container">
      <div class="dashboard-header">
        <h1>Seller Dashboard</h1>
        <p>Welcome to your seller dashboard</p>
      </div>
      <div class="dashboard-content">
        <div class="quick-actions">
          <a routerLink="/products" class="action-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="3" y1="9" x2="21" y2="9"></line>
            </svg>
            <h3>My Products</h3>
            <p>View and manage your products</p>
          </a>
          <a routerLink="/products/create" class="action-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <h3>Create Product</h3>
            <p>Add a new product to your catalog</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .seller-dashboard-container {
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
export class SellerDashboardComponent {}

