import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { OrderService } from '../../../core/services/order.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Order, OrderItem, OrderStatus } from '../../../core/models/order.model';

/** Flattened row for the pending return requests table */
export interface PendingReturnRow {
  order: Order;
  item: OrderItem;
}

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
  /** Items with returnStatus === 'Requested' across all orders */
  pendingReturns: PendingReturnRow[] = [];
  /** Items with Approved return where refundStatus can be updated by Admin */
  refundItems: PendingReturnRow[] = [];
  isLoading = false;
  resolvingItemId: number | null = null;
  updatingRefundItemId: number | null = null;
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
          this.buildPendingReturns();
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

  private buildPendingReturns(): void {
    const pending: PendingReturnRow[] = [];
    const refunds: PendingReturnRow[] = [];
    for (const order of this.orders) {
      if (!order.orderItems) continue;
      for (const item of order.orderItems) {
        if (item.returnStatus === 'Requested') {
          pending.push({ order, item });
        } else if (item.returnStatus === 'Approved') {
          // Backend sets refundStatus to Initiated when approved. Admin can update to Done/Refunded.
          refunds.push({ order, item });
        }
      }
    }
    this.pendingReturns = pending;
    this.refundItems = refunds;
  }

  applyFilter(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.statusFilter);
    }
  }

  resolveReturn(row: PendingReturnRow, approved: boolean): void {
    const action = approved ? 'Approve' : 'Reject';
    const note = prompt(`${action} return for "${row.item.productName}" (Order #${row.order.id}). Optional note for the customer:`) ?? '';

    this.errorMessage = '';
    this.successMessage = '';
    this.resolvingItemId = row.item.id;

    this.orderService.resolveReturn(row.item.id, approved, note).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message || (approved ? 'Return approved.' : 'Return rejected.');
          this.loadOrders();
          setTimeout(() => (this.successMessage = ''), 4000);
        } else {
          this.errorMessage = response.message || `Failed to ${action.toLowerCase()} return.`;
        }
        this.resolvingItemId = null;
      },
      error: (err) => {
        this.logger.httpError('Resolve return', err);
        this.errorMessage = err?.error?.message || `Failed to ${action.toLowerCase()} return. Please try again.`;
        this.resolvingItemId = null;
      }
    });
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

  /** Return counts for this order (for Admin returns column). */
  getOrderReturnSummary(order: Order): { requested: number; approved: number; rejected: number } {
    const summary = { requested: 0, approved: 0, rejected: 0 };
    if (!order?.orderItems) return summary;
    for (const item of order.orderItems) {
      const s = item.returnStatus ?? 'None';
      if (s === 'Requested') summary.requested++;
      else if (s === 'Approved') summary.approved++;
      else if (s === 'Rejected') summary.rejected++;
    }
    return summary;
  }

  hasAnyReturn(order: Order): boolean {
    const s = this.getOrderReturnSummary(order);
    return s.requested > 0 || s.approved > 0 || s.rejected > 0;
  }

  getOrderRefundSummary(order: Order): { initiated: number; done: number; refunded: number } {
    const summary = { initiated: 0, done: 0, refunded: 0 };
    if (!order?.orderItems) return summary;
    for (const item of order.orderItems) {
      const r = item.refundStatus ?? 'None';
      if (r === 'Initiated') summary.initiated++;
      else if (r === 'Done') summary.done++;
      else if (r === 'Refunded') summary.refunded++;
    }
    return summary;
  }

  /** Update refund status to a specific value (Admin only). */
  updateRefundStatus(row: PendingReturnRow, refundStatus: 'None' | 'Initiated' | 'Done' | 'Refunded'): void {
    const label =
      refundStatus === 'Refunded'
        ? 'Mark as refunded'
        : refundStatus === 'Done'
        ? 'Mark refund completed'
        : 'Update refund status';

    if (!confirm(`${label} for "${row.item.productName}" (Order #${row.order.id})?`)) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.updatingRefundItemId = row.item.id;

    this.orderService.updateRefundStatus(row.item.id, refundStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message || 'Refund status updated successfully.';
          this.loadOrders();
          setTimeout(() => (this.successMessage = ''), 4000);
        } else {
          this.errorMessage = response.message || 'Failed to update refund status.';
        }
        this.updatingRefundItemId = null;
      },
      error: (err) => {
        this.logger.httpError('Update refund status', err);
        this.errorMessage = err?.error?.message || 'Failed to update refund status. Please try again.';
        this.updatingRefundItemId = null;
      }
    });
  }

  goBack(): void {
    this.navigationService.goToDashboard();
  }
}

