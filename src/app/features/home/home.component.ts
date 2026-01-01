import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="home-container">
      <div class="home-content">
        <h1>Welcome to E-Commerce</h1>
        <p>This is the customer home page.</p>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .home-content {
      text-align: center;
      color: white;
    }
    h1 {
      font-size: 48px;
      margin-bottom: 20px;
    }
  `]
})
export class HomeComponent {}

