import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { OrderService } from '../../../core/services/order.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent implements OnInit {
  private orderService = inject(OrderService);
  public navigationService = inject(NavigationService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  statusFilter: string = 'all';
  orderStatuses = Object.values(OrderStatus);
  orderStatusEnum = OrderStatus;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.orders = response.data;
          this.applyFilter();
        } else {
          this.errorMessage = response.message || 'Failed to load orders';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Loading orders', error);
        if (error.status === 403) {
          this.errorMessage = 'You do not have permission to view all orders.';
        } else {
          this.errorMessage = 'Failed to load orders. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.statusFilter);
    }
  }

  updateStatus(order: Order, newStatus: OrderStatus): void {
    if (order.status === OrderStatus.Cancelled || order.status === OrderStatus.Delivered) {
      this.errorMessage = `Cannot change status of ${order.status.toLowerCase()} orders.`;
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    if (!confirm(`Change order #${order.id} status to "${newStatus}"?`)) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.orderService.updateOrderStatus({ orderId: order.id, status: newStatus }).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `Order #${order.id} status updated to ${newStatus}`;
          this.loadOrders();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message || 'Failed to update order status';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Updating order status', error);
        this.errorMessage = error.error?.message || 'Failed to update order status';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending: return 'status-badge pending';
      case OrderStatus.Processing: return 'status-badge processing';
      case OrderStatus.Shipped: return 'status-badge shipped';
      case OrderStatus.Delivered: return 'status-badge delivered';
      case OrderStatus.Cancelled: return 'status-badge cancelled';
      default: return 'status-badge';
    }
  }

  canChangeStatus(order: Order): boolean {
    return order.status !== OrderStatus.Cancelled && order.status !== OrderStatus.Delivered;
  }

  goBack(): void {
    this.navigationService.goToDashboard();
  }
}

