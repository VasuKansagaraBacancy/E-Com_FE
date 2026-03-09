# Ecommerce Web (Angular 18)

Frontend for an e-commerce system with authentication, RBAC (Admin/Seller/Customer), product & category management, cart/checkout, orders, and return/refund flow.

## Tech stack
- Angular 18 (standalone components)
- TypeScript
- RxJS
- Angular HttpClient + interceptors (JWT + error handling)

## Prerequisites
- Node.js (LTS recommended)
- npm

## Install

```bash
npm install
```

## Configuration

### Backend API URL
Configured in:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Example backend base URL:
- `https://localhost:7022`

### Dev proxy (recommended)
This project uses a dev proxy to avoid CORS issues.

- Proxy file: `proxy.conf.json`
- Wired in `angular.json` under `serve.configurations.development.proxyConfig`

During `npm start`, you can call APIs as `/api/...` and they are proxied to the backend.

## Run (development)

```bash
npm start
```

App runs at:
- `http://localhost:4200`

## Build (production)

```bash
npm run build
```

Note: `angular.json` contains component-style budgets. If you hit style budget errors, adjust `projects.ecommerce-web.architect.build.configurations.production.budgets` (type `anyComponentStyle`).

## Roles & routes
- **Customer**: `/home`, `/products`, `/cart`, `/checkout`, `/orders`
- **Seller**: `/seller/dashboard` (and allowed product create/edit)
- **Admin**: `/admin/dashboard`, `/admin/users`, `/admin/categories`, `/admin/products/approval`, `/admin/orders`

Route guards:
- `authGuard` (authentication)
- `roleGuard` (RBAC)

## Authentication
- JWT token is stored in localStorage
- `jwtInterceptor` adds `Authorization: Bearer <token>`
- `errorInterceptor` handles HTTP errors and redirects to login on 401

## Features

### Products
- Product listing + details
- Create/Edit product (Admin/Seller)
- Product approval (Admin)
- Per-product return policy: `returnPolicyDays`

### Categories (Admin)
- Category management (CRUD)

### Orders
- Customer: My Orders + Order Details
- Admin: Order management (all orders)

## Return & Refund flow (backend-aligned)

Order item fields:
- `returnStatus`: `None | Requested | Approved | Rejected`
- `refundStatus`: `None | Initiated | Done | Refunded`

### Customer requests a return
- **POST** `/api/order/return`
- Body:

```json
{ "orderItemId": 1, "reason": "Size does not fit" }
```

### Seller/Admin resolves the return
- **POST** `/api/order/return/resolve`
- Body:

```json
{ "orderItemId": 1, "approved": true, "note": "OK to return" }
```

### Admin updates refund status
- **PUT** `/api/order/return/refund-status`
- Body:

```json
{ "orderItemId": 1, "refundStatus": "Refunded" }
```

Customer can view return/refund status in:
- My Orders list (summary badges)
- Order Detail (per item)

## Project structure (high level)
- `src/app/core/`: guards, interceptors, models, services, shared components
- `src/app/features/`: auth, admin, seller, products, cart, checkout, orders

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
