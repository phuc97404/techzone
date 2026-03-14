# Phase 03: Backend API
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Xây dựng tất cả API endpoints cho cả storefront (public) và admin (protected).

## Requirements
### Functional
- [ ] CRUD products (admin)
- [ ] List/filter/search products (public)
- [ ] Cart management (authenticated)
- [ ] Order management (admin + customer)
- [ ] Promotion management (admin)
- [ ] Review system (authenticated)

### Non-Functional
- [ ] Response time < 200ms cho listing
- [ ] Input validation với Zod
- [ ] Error handling chuẩn
- [ ] Rate limiting cho public APIs

## Implementation Steps

### Auth (2 tasks)
1. [ ] Setup NextAuth.js v5 với Credentials provider
2. [ ] Tạo middleware bảo vệ admin routes

### Product APIs (4 tasks)
3. [ ] `GET /api/products` - List products (pagination, filter, sort)
   - Query params: category, brand, minPrice, maxPrice, search, sort, page, limit
4. [ ] `GET /api/products/[slug]` - Product detail + reviews + related
5. [ ] `POST /api/admin/products` - Create product (admin only)
6. [ ] `PUT/DELETE /api/admin/products/[id]` - Update/Delete product

### Category & Brand APIs (2 tasks)
7. [ ] `GET /api/categories` - List categories with product count
8. [ ] `GET /api/brands` - List brands with product count

### Cart APIs (2 tasks)
9. [ ] `GET/POST /api/cart` - Get cart / Add to cart
10. [ ] `PUT/DELETE /api/cart/[itemId]` - Update quantity / Remove item

### Order APIs (2 tasks)
11. [ ] `POST /api/orders` - Create order (checkout)
12. [ ] `GET /api/orders` - List orders (customer: own orders, admin: all)
    - `PUT /api/admin/orders/[id]` - Update order status

### Review API (1 task)
13. [ ] `POST /api/products/[id]/reviews` - Add review
    - `GET` included in product detail endpoint

### Promotion API (1 task)
14. [ ] `GET/POST/PUT/DELETE /api/admin/promotions` - CRUD promotions
    - `POST /api/promotions/validate` - Validate promo code at checkout

## Files to Create/Modify
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/products/route.ts`
- `src/app/api/products/[slug]/route.ts`
- `src/app/api/categories/route.ts`
- `src/app/api/brands/route.ts`
- `src/app/api/cart/route.ts`
- `src/app/api/cart/[itemId]/route.ts`
- `src/app/api/orders/route.ts`
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/products/[id]/route.ts`
- `src/app/api/admin/orders/[id]/route.ts`
- `src/app/api/admin/promotions/route.ts`
- `src/app/api/products/[id]/reviews/route.ts`
- `src/lib/auth.ts` - Auth configuration
- `src/lib/validations/` - Zod schemas
- `src/middleware.ts` - Route protection

## Test Criteria
- [ ] Login/Register hoạt động
- [ ] List products với filter trả về đúng kết quả
- [ ] CRUD products qua API thành công
- [ ] Add to cart + checkout flow hoạt động
- [ ] Admin endpoints chặn unauthorized access

## Notes
- Sử dụng Next.js Route Handlers (app/api/)
- Zod validation cho tất cả input
- Proper error responses: { error: string, status: number }

---
Next Phase: [phase-04-frontend-storefront.md](./phase-04-frontend-storefront.md)
