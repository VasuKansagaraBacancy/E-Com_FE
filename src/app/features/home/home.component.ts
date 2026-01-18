import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../core/components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="home-container">
      <div class="home-content">
        <h1>Welcome to E-Commerce</h1>
        <p>Discover amazing products at great prices</p>
        <a routerLink="/products" class="btn-browse">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="3" y1="9" x2="21" y2="9"></line>
          </svg>
          Browse Products
        </a>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }
    .home-content {
      text-align: center;
      color: white;
    }
    h1 {
      font-size: 48px;
      margin-bottom: 16px;
      font-weight: 700;
    }
    p {
      font-size: 20px;
      margin-bottom: 32px;
      opacity: 0.9;
    }
    .btn-browse {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 32px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      transition: all 0.3s ease;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    .btn-browse:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
    .btn-browse svg {
      stroke-width: 2.5;
    }
  `]
})
export class HomeComponent {}

