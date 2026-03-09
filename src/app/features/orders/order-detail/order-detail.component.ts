import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Order, OrderItem, OrderStatus } from '../../../core/models/order.model';
import { Product } from '../../../core/models/product.model';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { LoggerService } from '../../../core/services/logger.service';
import { HeaderComponent } from '../../../core/components/header/header.component';

interface OrderItemReturnInfo {
  item: OrderItem;
  product: Product | null;
  returnPolicyDays: number | null;
  isReturnAllowed: boolean;
  returnUntilLabel: string | null;
  returnText: string;
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  readonly uiHelper = inject(UiHelperService);
  private navigationService = inject(NavigationService);
  private logger = inject(LoggerService);

  order: Order | null = null;
  orderId!: number;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  itemsWithReturnInfo: OrderItemReturnInfo[] = [];

  readonly orderStatusEnum = OrderStatus;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!id || Number.isNaN(id)) {
      this.errorMessage = 'Invalid order id.';
      return;
    }

    this.orderId = id;
    this.loadOrder();
  }

  loadOrder(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getOrderById(this.orderId).subscribe({
      next: response => {
        if (!response.success || !response.data) {
          this.errorMessage = response.message || 'Failed to load order details.';
          this.isLoading = false;
          return;
        }

        this.order = response.data;
        this.isLoading = false;
        this.buildReturnInfo();
      },
      error: err => {
        this.logger.error('Error loading order details', err);
        this.errorMessage = 'Something went wrong while loading the order. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private buildReturnInfo(): void {
    if (!this.order) {
      this.itemsWithReturnInfo = [];
      return;
    }

    const isDelivered = this.order.status === OrderStatus.Delivered;

    // If order is not yet delivered, show simple message and skip product lookups
    if (!isDelivered) {
      this.itemsWithReturnInfo = this.order.orderItems.map(item => ({
        item,
        product: null,
        returnPolicyDays: null,
        isReturnAllowed: false,
        returnUntilLabel: null,
        returnText: 'Returns are available only after the order is delivered.'
      }));
      return;
    }

    // Prefer deliveredAt from backend; fall back to createdAt if not set yet
    const deliveredSource = this.order.deliveredAt || this.order.createdAt;
    const deliveredAtDate = new Date(deliveredSource);
    const now = new Date();
    const daysSinceDelivery =
      (now.getTime() - deliveredAtDate.getTime()) / (1000 * 60 * 60 * 24);

    const productRequests = this.order.orderItems.map(item =>
      this.productService.getProductById(item.productId)
    );

    forkJoin(productRequests).subscribe({
      next: responses => {
        this.itemsWithReturnInfo = this.order!.orderItems.map((item, index) => {
          const productResponse = responses[index];
          const product = productResponse.success ? productResponse.data : null;

          if (!product) {
            return {
              item,
              product: null,
              returnPolicyDays: null,
              isReturnAllowed: false,
              returnUntilLabel: null,
              returnText: 'Return information is currently unavailable for this item.'
            };
          }

          const policyDays = product.returnPolicyDays;

          if (!policyDays || policyDays <= 0) {
            return {
              item,
              product,
              returnPolicyDays: policyDays,
              isReturnAllowed: false,
              returnUntilLabel: null,
              returnText: 'No returns on this product.'
            };
          }

          const isWithinWindow = daysSinceDelivery <= policyDays;
          const returnDeadline = new Date(deliveredAtDate);
          returnDeadline.setDate(returnDeadline.getDate() + policyDays);

          const returnUntilLabel = this.uiHelper.formatDateShort(
            returnDeadline.toISOString()
          );

          const returnText = isWithinWindow
            ? `Return within ${policyDays} days of delivery (until ${returnUntilLabel}).`
            : 'Return window expired for this item.';

          return {
            item,
            product,
            returnPolicyDays: policyDays,
            isReturnAllowed: isWithinWindow,
            returnUntilLabel,
            returnText
          };
        });
      },
      error: err => {
        this.logger.error('Error loading product return info for order', err);
        // Fallback: still show order items, but without detailed return info
        this.itemsWithReturnInfo = this.order!.orderItems.map(item => ({
          item,
          product: null,
          returnPolicyDays: null,
          isReturnAllowed: false,
          returnUntilLabel: null,
          returnText: 'Unable to load return information for this item.'
        }));
      }
    });
  }

  getStatusClass(status: OrderStatus): string {
    return {
      [OrderStatus.Pending]: 'status-badge status-pending',
      [OrderStatus.Processing]: 'status-badge status-processing',
      [OrderStatus.Shipped]: 'status-badge status-shipped',
      [OrderStatus.Delivered]: 'status-badge status-delivered',
      [OrderStatus.Cancelled]: 'status-badge status-cancelled'
    }[status];
  }

  goBack(): void {
    // Back to My Orders; if user came from elsewhere, NavigationService will still send them to correct dashboard
    this.router.navigate(['/orders']);
  }

  goBackToDashboard(): void {
    this.navigationService.goToDashboard();
  }

  requestReturn(info: OrderItemReturnInfo): void {
    const reason = prompt('Please enter a reason for the return:')?.trim();

    if (!reason) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    this.orderService.requestReturn(info.item.id, reason).subscribe({
      next: response => {
        if (!response.success) {
          this.errorMessage = response.message || 'Failed to submit return request.';
          return;
        }

        this.successMessage = response.message || `Return request for "${info.item.productName}" submitted successfully.`;
        this.loadOrder();
      },
      error: err => {
        this.logger.error('Error submitting return request', err);
        this.errorMessage = err?.error?.message || 'Something went wrong while submitting the return request. Please try again.';
      }
    });
  }

  /** True when item has no return request yet (customer can request return). */
  canRequestReturn(info: OrderItemReturnInfo): boolean {
    const status = info.item.returnStatus ?? 'None';
    return info.isReturnAllowed && status === 'None';
  }

  /** Return status for display (Requested | Approved | Rejected). */
  getReturnStatusLabel(status: string | undefined): string {
    if (!status || status === 'None') return '';
    return status;
  }

  /** Refund status label for display based on backend value. */
  getRefundStatusLabel(refundStatus: string | undefined): string {
    if (!refundStatus || refundStatus === 'None') {
      return '';
    }
    switch (refundStatus) {
      case 'Initiated':
        return 'Refund initiated';
      case 'Done':
        return 'Refund completed';
      case 'Refunded':
        return 'Return refunded';
      default:
        return refundStatus;
    }
  }
}


