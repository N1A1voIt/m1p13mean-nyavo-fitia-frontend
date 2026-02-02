# AI Frontend Context – MEAN M1 Project

## 1️⃣ Project Overview

- **Project name:** m1p13mean-xxx-yyy-frontend
- **Stack:** Angular 18+ (Standalone Components), TypeScript, Node.js backend (20 LTS)
- **Purpose:** Frontend for shopping center application
- **Roles:**
  - ADMIN → manage shops, manage users
  - SHOP → manage products, view orders
  - CUSTOMER → browse products, view profile, cart
- **Authentication:** JWT-based
- **Routing:** Lazy-loaded standalone components per role
- **Environment:** environment.ts (dev) and environment.prod.ts (prod)
- **Deployment:** Frontend on Vercel, backend separate

---

## 2️⃣ Frontend Folder / Component Structure

src/
├── app/
│ ├── core/ # Global services, guards, interceptors
│ │ ├── services/
│ │ │ ├── auth.service.ts
│ │ │ └── api.service.ts
│ │ ├── guards/
│ │ │ └── role.guard.ts
│ │ └── interceptors/
│ │ └── jwt.interceptor.ts (functional)
│ │
│ ├── shared/ # Reusable components: Header, Footer, Login
│ │
│ ├── features/ # Role-based feature components
│ │ ├── admin/
│ │ │ ├── admin-dashboard.component.ts
│ │ │ └── admin-settings.component.ts
│ │ ├── shop/
│ │ │ ├── shop-dashboard.component.ts
│ │ │ └── shop-products.component.ts
│ │ └── customer/
│ │ ├── customer-home.component.ts
│ │ └── customer-profile.component.ts
│ │
│ ├── app.routes.ts # Routing with lazy loading & role metadata
│ └── app.component.ts # Standalone root component
├── environments/
│ ├── environment.ts # Dev API URL
│ └── environment.prod.ts # Prod API URL
└── main.ts # bootstrapApplication


---

## 3️⃣ Key Angular Guidelines

- **Standalone Components:** Use `standalone: true` for all feature and shared components
- **Lazy Loading:** Use `loadComponent` for feature components
- **Guards:** `roleGuard` with `data: { role: 'ROLE' }` protects routes
- **Interceptor:** Functional `HttpInterceptorFn` to attach JWT automatically
- **Services:** AuthService for login/logout, ApiService for backend calls
- **Environment files:** API URLs only; backend secrets never in frontend
- **LocalStorage:** JWT + role stored for frontend route guards only; backend always validates JWT

---

## 4️⃣ Example Routing with Guards

```ts
export const routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/shop-dashboard.component').then(m => m.ShopDashboardComponent),
    canActivate: [roleGuard],
    data: { role: 'SHOP' }
  },
  {
    path: 'customer',
    loadComponent: () =>
      import('./features/customer/customer-home.component').then(m => m.CustomerHomeComponent),
    canActivate: [roleGuard],
    data: { role: 'CUSTOMER' }
  },
  { path: '', redirectTo: 'customer', pathMatch: 'full' }
];
```

5️⃣ Default Users (Frontend Demo)
```
  ADMIN
  email: admin@mall.com
  password: admin123
  
  SHOP
  email: shop@mall.com
  password: shop123
  
  CUSTOMER
  email: user@mall.com
  password: user123
```
  Can be hardcoded in login forms for testing purposes

  Real authentication comes from backend JWT

6️⃣ AI Coding Guidelines for Frontend

When generating frontend code, AI should:

    Follow project folder and component structure exactly

    Generate standalone Angular components (lazy-loaded if features)

    Use roleGuard and data.role for route protection

    Use functional JWT interceptor attached globally via provideHttpClient(withInterceptors([jwtInterceptor]))

    Use environment.ts for API URLs

    Do not include backend secrets in frontend code

    Include shared components like Header, Footer, Login

    Produce modular, exam/production-ready code

    Separate each feature into its own folder and file

7️⃣ How to Use This Context with AI

    Save this file as AI_CONTEXT_FRONTEND.md in the frontend project root

    At the top of any file you want AI to generate code in, add a reference:

/* Reference: AI_CONTEXT_FRONTEND.md */

    Add a specific prompt as a comment:

// Generate AdminDashboardComponent with standalone Angular, lazy-loaded, using AuthService + roleGuard

    AI will follow folder structure, guards, interceptor, and environment rules
