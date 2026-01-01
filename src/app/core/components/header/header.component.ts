import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="app-header" *ngIf="authService.isAuthenticated()">
      <div class="header-content">
        <div class="header-left">
          <h2 class="logo">E-Commerce</h2>
        </div>
        <div class="header-right">
          <div class="user-info" *ngIf="currentUser">
            <span class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
            <span class="user-role">{{ currentUser.role }}</span>
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      .logo {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
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
        font-size: 12px;
        color: #718096;
        text-transform: capitalize;
      }
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
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
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 12px 16px;
      }

      .user-info {
        display: none;
      }

      .logout-btn {
        padding: 8px 16px;
        font-size: 13px;
      }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  onLogout(): void {
    this.authService.logout();
  }
}

