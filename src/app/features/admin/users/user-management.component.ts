import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { UiHelperService } from '../../../core/services/ui-helper.service';
import { LoggerService } from '../../../core/services/logger.service';
import { UserManagement } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  public navigationService = inject(NavigationService);
  public uiHelper = inject(UiHelperService);
  private logger = inject(LoggerService);

  users: UserManagement[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentUserEmail: string | null = null;

  ngOnInit(): void {
    this.loadUsers();
    // Get current user email to prevent self-deactivation
    const currentUser = this.authService.getCurrentUser();
    this.currentUserEmail = currentUser?.email || null;
  }

  goBackToDashboard(): void {
    this.navigationService.goToDashboard();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load users';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Loading users', error);
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'You do not have permission to view users.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred while loading users. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  activateUser(userId: number): void {
    this.updateUserStatus(userId, true);
  }

  deactivateUser(userId: number, userEmail: string): void {
    // Prevent self-deactivation
    if (this.currentUserEmail && userEmail === this.currentUserEmail) {
      this.errorMessage = 'You cannot deactivate your own account.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      return;
    }

    if (confirm('Are you sure you want to deactivate this user? They will not be able to log in.')) {
      this.updateUserStatus(userId, false);
    }
  }

  isCurrentUser(userEmail: string): boolean {
    return this.currentUserEmail === userEmail;
  }

  private updateUserStatus(userId: number, isActive: boolean): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateUserStatus(userId, isActive).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message || `User ${isActive ? 'activated' : 'deactivated'} successfully`;
          // Refresh user list
          this.loadUsers();
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = response.message || 'Failed to update user status';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.httpError('Updating user status', error);
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized. Please log in again.';
        } else if (error.status === 404) {
          this.errorMessage = 'User not found.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred while updating user status. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }
}
