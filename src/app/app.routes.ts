import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { AdminRegisterComponent } from './features/auth/admin-register/admin-register.component';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'admin-register',
        component: AdminRegisterComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.Admin] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
