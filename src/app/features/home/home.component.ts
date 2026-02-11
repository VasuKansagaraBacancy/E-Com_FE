import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../core/components/header/header.component';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="home-container">
      <div class="welcome-section">
        <div class="welcome-content">
          <h1>Welcome back, {{ userName }}!</h1>
          <p>Discover amazing products at great prices</p>
        </div>
      </div>

      <div class="quick-actions">
        <a routerLink="/products" class="action-card products">
          <div class="icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3>Browse Products</h3>
          <p>Explore our wide range of products</p>
        </a>

        <a routerLink="/cart" class="action-card cart">
          <div class="icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
          </div>
          <h3>My Cart</h3>
          <p>{{ cartCount }} items in your cart</p>
        </a>

        <a routerLink="/orders" class="action-card orders">
          <div class="icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <h3>My Orders</h3>
          <p>Track your order history</p>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 64px);
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
      padding: 40px;
    }

    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 24px;
      padding: 60px 40px;
      margin-bottom: 40px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);

      .welcome-content {
        h1 {
          color: white;
          font-size: 42px;
          font-weight: 800;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
        }

        p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          margin: 0;
        }
      }
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 40px 30px;
      background: white;
      border-radius: 20px;
      text-decoration: none;
      transition: all 0.4s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
      }

      .icon-wrapper {
        position: relative;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        margin-bottom: 20px;
        transition: all 0.3s ease;

        svg {
          stroke-width: 1.5;
        }

        .badge {
          position: absolute;
          top: -8px;
          right: -8px;
          min-width: 24px;
          height: 24px;
          padding: 0 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(229, 62, 62, 0.4);
        }
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 22px;
        font-weight: 700;
        color: #1a202c;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: #718096;
      }

      &.products {
        &:hover {
          border-color: #667eea;
        }
        .icon-wrapper {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          svg { stroke: #667eea; }
        }
        &:hover .icon-wrapper {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          svg { stroke: white; }
        }
      }

      &.cart {
        &:hover {
          border-color: #38a169;
        }
        .icon-wrapper {
          background: rgba(56, 161, 105, 0.1);
          svg { stroke: #38a169; }
        }
        &:hover .icon-wrapper {
          background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
          svg { stroke: white; }
        }
      }

      &.orders {
        &:hover {
          border-color: #d69e2e;
        }
        .icon-wrapper {
          background: rgba(214, 158, 46, 0.1);
          svg { stroke: #d69e2e; }
        }
        &:hover .icon-wrapper {
          background: linear-gradient(135deg, #d69e2e 0%, #b7791f 100%);
          svg { stroke: white; }
        }
      }
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 20px 16px;
      }

      .welcome-section {
        padding: 40px 24px;
        border-radius: 20px;

        .welcome-content h1 {
          font-size: 28px;
        }

        .welcome-content p {
          font-size: 16px;
        }
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }

      .action-card {
        padding: 30px 24px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  cartCount = 0;

  get userName(): string {
    const user = this.authService.getCurrentUser();
    return user?.firstName || 'Guest';
  }

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    
    // Load cart
    this.cartService.getCart().subscribe();
  }
}
