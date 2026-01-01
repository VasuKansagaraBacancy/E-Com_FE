import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../core/components/header/header.component';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="seller-dashboard-container">
      <div class="dashboard-header">
        <h1>Seller Dashboard</h1>
        <p>Welcome to your seller dashboard</p>
      </div>
      <div class="dashboard-content">
        <p>This is where you can manage your products, orders, and sales.</p>
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
  `]
})
export class SellerDashboardComponent {}

