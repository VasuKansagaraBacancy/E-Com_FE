# Ecommerce Web (Angular 18 + .NET backend)

Frontend for a full e‑commerce system with:
- Email/password auth
- Google Sign‑In
- Role‑based access (Admin / Seller / Customer)
- Product & category management
- Cart & checkout
- Orders + per‑item returns and refunds

This README covers the **whole project**, not just the return/refund APIs.

---

## 1. Tech stack
- **Angular 18** (standalone components)
- **TypeScript**
- **RxJS**
- **SCSS** component styles
- **JWT** + Http interceptors (auth + error handling)

---

## 2. Prerequisites
- Node.js (LTS)
- npm
- Running backend (e.g. `https://localhost:7022`)

---

## 3. Install & run

### Install dependencies
```bash
npm install
```

### Start dev server
```bash
npm start
```

Dev URL:
- `http://localhost:4200`

The dev server uses a **proxy** so all frontend API calls go to `/api/...` and are forwarded to the backend.

---

## 4. Configuration

### Backend base URL & Google client id
Files:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Example:
- `apiUrl: 'https://localhost:7022'`
- `googleClientId: '<your-google-client-id>'`

### Proxy
- `proxy.conf.json` proxies `/api` → backend URL
- Wired in `angular.json` → `serve.configurations.development.proxyConfig`

---

## 5. Available scripts

In `package.json`:

- **`npm start`** – dev server (`ng serve`, uses dev proxy)
- **`npm run build`** – production build
- **`npm test`** – unit tests (Karma/Jasmine)

Build budgets for component styles are configured in `angular.json` (type `anyComponentStyle`).

---

## 6. Roles & navigation

### Roles
- **Customer**
- **Seller**
- **Admin**

### Route layout
- `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/admin-register`
- `/home` – customer home
- `/products` – product list (public browsing)
- `/products/:id` – product details
- `/products/create`, `/products/edit/:id` – Seller/Admin only
- `/cart` – customer cart
- `/checkout` – customer checkout
- `/orders` – customer order list
- `/orders/:id` – customer order detail
- `/seller/dashboard` – seller dashboard
- `/admin/dashboard` – admin dashboard
- `/admin/users` – user management
- `/admin/categories` – category management
- `/admin/products/approval` – product approval
- `/admin/orders` – order & return/refund management

### Guards
- `authGuard` – requires login
- `roleGuard` – restricts routes by `UserRole` (Admin / Seller / Customer)

---

## 7. Authentication & Google Sign‑In

### Email/password
- Login, register, forgot password, reset password use **Reactive Forms** with validation.
- JWT token stored in `localStorage`.
- Current user information stored and exposed via `AuthService`.

### Http interceptors
- `jwtInterceptor` – attaches `Authorization: Bearer <token>` for API calls.
- `errorInterceptor` – handles HTTP errors, logs via `LoggerService`, redirects to login on 401.

### Google Sign‑In
- Google Identity script included in `src/index.html`.
- Login page has a “Sign in with Google” button.
- On success, frontend sends Google ID token to backend:
  - **POST** `/api/Auth/google-login`
- Backend returns a JWT and user info; role for new users defaults to **Customer**.

---

## 8. Core services & utilities

Located in `src/app/core/`:

- `auth.service.ts` – login/register/forgot/reset, Google login, current user stream.
- `storage.service.ts` – wrapper around `localStorage` for token & user.
- `product.service.ts` – product CRUD + queries.
- `category.service.ts` – category CRUD.
- `order.service.ts` – order create/list/detail + status update + return/refund APIs.
- `user.service.ts` – admin user management.
- `navigation.service.ts` – central place for redirects (login, dashboards, products, etc).
- `ui-helper.service.ts` – helpers for formatting prices, dates, status badges, image fallbacks.
- `logger.service.ts` – dev‑only logging.

Models in `src/app/core/models/`:
- `user.model.ts` – `User`, `UserRole`, auth DTOs, user management DTOs.
- `product.model.ts` – `Product`, `Category`, request DTOs for create/update/approve.
- `order.model.ts` – `Order`, `OrderItem`, `OrderStatus`, `ReturnStatus`, `RefundStatus`.
- `api-response.model.ts` – `ApiResponse<T>`, `PaginatedResponse<T>`.

Shared constants:
- `core/constants/validation.constants.ts` – field lengths, numeric ranges, route helpers, etc.

---

## 9. Features by area

### 9.1 Auth (customer + admin)
- **Login** (`/auth/login`)
  - Email + password.
  - Google Sign‑In.
  - Shows errors & loading state.
- **Register** (`/auth/register`)
  - Customer self‑registration.
  - Min password length 8, email validation.
- **Admin register** (`/auth/admin-register`)
  - Admin‑only screen to create Admin/Seller/Customer users.
- **Forgot/Reset password**
  - Forgot password triggers backend email; reset uses token link.
  - Reset email field is non‑editable (readonly/disabled).

### 9.2 Dashboards
- **Customer home** (`/home`)
  - Hero + CTA to browse products.
- **Seller dashboard** (`/seller/dashboard`)
  - Overview + quick links to My Products, Create Product.
- **Admin dashboard** (`/admin/dashboard`)
  - Quick links to:
    - Admin register
    - User management
    - Category management
    - Product approval
    - All products & orders

### 9.3 Products
- **List** (`/products`)
  - Card grid with images, price, status, “Add to cart”.
  - Seller/Admin shortcuts: edit, approve visibility depending on role.
- **Details** (`/products/:id`)
  - Image, price, stock, description.
  - Return policy text based on `returnPolicyDays`.
  - Add to cart from detail page.
- **Create/Edit** (`/products/create`, `/products/edit/:id`)
  - Protected for Seller/Admin only.
  - Fields: name, description, price, stock, category, image URL, `returnPolicyDays`.
  - Uses reactive form, validation constants, category dropdown (only active categories).
- **Approval** (`/admin/products/approval`)
  - Shows Pending/Approved/Rejected products.
  - Admin can approve/reject.

### 9.4 Categories (Admin only)
- **`/admin/categories`**
  - List, create, edit, delete categories.
  - Active/inactive flag controls visibility in product forms.

### 9.5 Cart & checkout
- **Cart** (`/cart`)
  - Line items, quantities, totals.
  - Uses `UiHelperService` for price formatting.
- **Checkout** (`/checkout`)
  - Shipping address form + order summary.
  - On success, navigates with `?success=true` so My Orders can show a success banner.

### 9.6 Orders (Customer)

- **My Orders** (`/orders`)
  - Card view per order: id, date, items preview, shipping, total.
  - “View Details” opens `orders/:id`.
  - Summary badges for returns/refunds per order:
    - Requested / Approved / Rejected
    - Refund Initiated / Refund Done / Refunded

- **Order Detail** (`/orders/:id`)
  - Full order info:
    - Items, quantities, prices, subtotal, shipping, notes.
    - Delivery date (from `deliveredAt`).
  - For each item:
    - Shows return window text based on:
      - `product.returnPolicyDays`
      - `order.deliveredAt`
    - Shows return status badge if `returnStatus != None`.
    - Shows refund status badge if `refundStatus != None` with friendly labels:
      - Initiated → “Refund initiated”
      - Done → “Refund completed”
      - Refunded → “Return refunded”
    - Shows **Request Return** button only when:
      - Order is Delivered
      - Within `returnPolicyDays` window
      - `returnStatus === "None"`

---

## 10. Return & refund flow (full)

These APIs are implemented on the backend and consumed here:

### 10.1 Request return (Customer)
- **Endpoint**: `POST /api/order/return`
- **Body**:
  ```json
  {
    "orderItemId": 1,
    "reason": "Size does not fit"
  }
  ```
- Frontend:
  - From Order Detail → “Request Return” button.
  - Calls `orderService.requestReturn(...)`.

### 10.2 Resolve return (Admin or Seller)
- **Endpoint**: `POST /api/order/return/resolve`
- **Body**:
  ```json
  {
    "orderItemId": 1,
    "approved": true,
    "note": "OK to return"
  }
  ```
- Backend:
  - Changes `returnStatus` to Approved / Rejected.
  - When approved, sets `refundStatus` to `"Initiated"`.
- Frontend:
  - Admin Order Management → “Pending return requests” table.
  - Approve/Reject buttons call `orderService.resolveReturn(...)`.

### 10.3 Update refund status (Admin)
- **Endpoint**: `PUT /api/order/return/refund-status`
- **Body**:
  ```json
  {
    "orderItemId": 1,
    "refundStatus": "Refunded"
  }
  ```
- Valid `refundStatus`:
  - `"None"`, `"Initiated"`, `"Done"`, `"Refunded"`
- Frontend:
  - Admin Order Management → “Refund status (Approved returns)” table.
  - A single **Mark Refunded** button per item:
    - Calls `orderService.updateRefundStatus(orderItemId, 'Refunded')`.
    - Disabled when already Refunded.

Customer can see `refundStatus`:
- In My Orders summary.
- On Order Detail per item.

---

## 11. Project structure (high level)

- `src/main.ts` – bootstrap.
- `src/app/app.routes.ts` – all routes and guards.
- `src/app/core/`
  - `models/` – DTOs and enums.
  - `services/` – API and helper services.
  - `guards/` – `authGuard`, `roleGuard`.
  - `interceptors/` – `jwt.interceptor.ts`, `error.interceptor.ts`.
  - `components/header/` – main header/navigation.
- `src/app/features/`
  - `auth/` – login/register/forgot/reset/admin-register.
  - `home/`
  - `products/` – list, details, form.
  - `cart/`
  - `checkout/`
  - `orders/` – list, detail.
  - `admin/` – dashboard, users, categories, products approval, orders management.
  - `seller/` – seller dashboard.


# EcommerceWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
