import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { OrderService } from '../../../core/services/order.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  public navigationService = inject(NavigationService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);

  orders: Order[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    // Check for success message from checkout
    if (this.route.snapshot.queryParams['success'] === 'true') {
      this.successMessage = 'Order placed successfully! Thank you for your purchase.';
      setTimeout(() => this.successMessage = '', 5000);
    }
    
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.orders = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load orders';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Loading orders', error);
        this.errorMessage = 'Failed to load orders. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'status-badge pending';
      case OrderStatus.Processing:
        return 'status-badge processing';
      case OrderStatus.Shipped:
        return 'status-badge shipped';
      case OrderStatus.Delivered:
        return 'status-badge delivered';
      case OrderStatus.Cancelled:
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  }

  goBack(): void {
    this.navigationService.goToDashboard();
  }
}

