import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="app-header" *ngIf="authService.isAuthenticated()">
      <div class="header-content">
        <div class="header-left">
          <a class="logo" [routerLink]="getDashboardRoute()">ShopHub</a>
          <nav class="nav-links" *ngIf="isCustomer">
            <a routerLink="/products" class="nav-link">Products</a>
            <a routerLink="/orders" class="nav-link">My Orders</a>
          </nav>
        </div>
        <div class="header-right">
          <a routerLink="/cart" class="cart-btn" *ngIf="isCustomer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="cart-count" *ngIf="cartCount > 0">{{ cartCount > 99 ? '99+' : cartCount }}</span>
          </a>
          <div class="user-info" *ngIf="currentUser">
            <span class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
            <span class="user-role" [class]="'role-' + currentUser.role.toLowerCase()">{{ currentUser.role }}</span>
          </div>
          <button class="logout-btn" (click)="onLogout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: white;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 40px;

      .logo {
        margin: 0;
        font-size: 26px;
        font-weight: 800;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-decoration: none;
        letter-spacing: -0.5px;
      }

      .nav-links {
        display: flex;
        gap: 8px;

        .nav-link {
          padding: 10px 18px;
          color: #4a5568;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          border-radius: 10px;
          transition: all 0.2s ease;

          &:hover {
            background: #f7fafc;
            color: #667eea;
          }
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .cart-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      border-radius: 14px;
      text-decoration: none;
      transition: all 0.3s ease;

      svg {
        stroke: #4a5568;
        stroke-width: 2;
      }

      &:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

        svg {
          stroke: white;
        }
      }

      .cart-count {
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 22px;
        height: 22px;
        padding: 0 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
        color: white;
        border-radius: 11px;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 2px 6px rgba(229, 62, 62, 0.4);
      }
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;

      .user-name {
        font-weight: 600;
        color: #2d3748;
        font-size: 14px;
      }

      .user-role {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 10px;

        &.role-admin {
          background: #fed7d7;
          color: #c53030;
        }

        &.role-seller {
          background: #bee3f8;
          color: #2c5282;
        }

        &.role-customer {
          background: #c6f6d5;
          color: #22543d;
        }
      }
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

      svg {
        stroke-width: 2.5;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 12px 16px;
      }

      .header-left {
        gap: 16px;

        .logo {
          font-size: 22px;
        }

        .nav-links {
          display: none;
        }
      }

      .user-info {
        display: none;
      }

      .cart-btn {
        width: 42px;
        height: 42px;
      }

      .logout-btn {
        padding: 10px 16px;
        font-size: 13px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);

  cartCount = 0;

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isCustomer() {
    return this.currentUser?.role === UserRole.Customer;
  }

  ngOnInit(): void {
    // Subscribe to cart count changes
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    // Load cart if customer
    if (this.isCustomer) {
      this.cartService.getCart().subscribe();
    }
  }

  getDashboardRoute(): string {
    const role = this.currentUser?.role;
    switch (role) {
      case UserRole.Admin:
        return '/admin/dashboard';
      case UserRole.Seller:
        return '/seller/dashboard';
      default:
        return '/home';
    }
  }

  onLogout(): void {
    this.cartService.resetCart();
    this.authService.logout();
  }
}
