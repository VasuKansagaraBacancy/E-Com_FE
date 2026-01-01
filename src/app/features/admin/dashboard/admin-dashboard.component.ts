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
            <h3>Register New User</h3>
            <p>Create Admin or Seller accounts</p>
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
    }
    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    .action-card h3 {
      margin: 0 0 8px 0;
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

