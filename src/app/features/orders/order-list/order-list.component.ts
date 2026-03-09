import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { OrderService } from '../../../core/services/order.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

export interface ReturnSummary {
  requested: number;
  approved: number;
  rejected: number;
  refundInitiated: number;
  refundDone: number;
  refundRefunded: number;
}

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

  /** Return and refund counts per status for this order (for display on card). */
  getOrderReturnSummary(order: Order): ReturnSummary {
    const summary: ReturnSummary = {
      requested: 0,
      approved: 0,
      rejected: 0,
      refundInitiated: 0,
      refundDone: 0,
      refundRefunded: 0
    };
    if (!order?.orderItems) return summary;
    for (const item of order.orderItems) {
      const s = item.returnStatus ?? 'None';
      if (s === 'Requested') summary.requested++;
      else if (s === 'Approved') summary.approved++;
      else if (s === 'Rejected') summary.rejected++;
      const r = item.refundStatus ?? 'None';
      if (r === 'Initiated') summary.refundInitiated++;
      else if (r === 'Done') summary.refundDone++;
      else if (r === 'Refunded') summary.refundRefunded++;
    }
    return summary;
  }

  hasAnyReturn(order: Order): boolean {
    const s = this.getOrderReturnSummary(order);
    return (
      s.requested > 0 ||
      s.approved > 0 ||
      s.rejected > 0 ||
      s.refundInitiated > 0 ||
      s.refundDone > 0 ||
      s.refundRefunded > 0
    );
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

