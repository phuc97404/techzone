# Phase 02: Database & Prisma Schema
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Thiết kế database schema cho toàn bộ hệ thống e-commerce, tạo migrations, và seed data mẫu.

## Requirements
### Functional
- [ ] Schema hỗ trợ 7 category sản phẩm
- [ ] Quản lý đơn hàng với trạng thái
- [ ] Hệ thống khuyến mãi linh hoạt
- [ ] Tồn kho realtime
- [ ] Đánh giá & rating sản phẩm

### Non-Functional
- [ ] Query performance tối ưu với indexes
- [ ] Soft delete cho dữ liệu quan trọng

## Implementation Steps
1. [ ] Setup Neon PostgreSQL database (free tier)
2. [ ] Tạo Prisma schema với các models:
   - **User** (id, email, password, name, role, phone, address)
   - **Category** (id, name, slug, image, parentId)
   - **Brand** (id, name, slug, logo)
   - **Product** (id, name, slug, description, price, salePrice, images[], specs JSON, categoryId, brandId, stock, featured, status)
   - **ProductSpec** (id, productId, key, value) - Thông số chi tiết
   - **Review** (id, productId, userId, rating, comment, createdAt)
   - **Cart** (id, userId, items[])
   - **CartItem** (id, cartId, productId, quantity)
   - **Order** (id, userId, items[], total, status, shippingAddress, phone, note)
   - **OrderItem** (id, orderId, productId, quantity, price)
   - **Promotion** (id, name, code, discountType, discountValue, startDate, endDate, active)
3. [ ] Tạo indexes cho performance:
   - Product: categoryId, brandId, slug, price
   - Order: userId, status, createdAt
4. [ ] Tạo enum types:
   - UserRole: ADMIN, CUSTOMER
   - OrderStatus: PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
   - ProductStatus: ACTIVE, DRAFT, OUT_OF_STOCK
5. [ ] Chạy `prisma migrate dev`
6. [ ] Tạo seed data với sản phẩm mẫu:
   - 7 categories
   - 10+ brands phổ biến (Intel, AMD, NVIDIA, Samsung, Kingston, Corsair...)
   - 30+ sản phẩm mẫu với đầy đủ specs
   - 1 admin account mặc định
7. [ ] Chạy `prisma db seed`
8. [ ] Verify: Prisma Studio hiển thị data đúng
9. [ ] Tạo Prisma client singleton (lib/prisma.ts)
10. [ ] Test query cơ bản: liệt kê products, filter by category

## Files to Create/Modify
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Seed data
- `src/lib/prisma.ts` - Prisma client singleton
- `.env` - Database URL
- `package.json` - Add seed script

## Test Criteria
- [ ] `prisma migrate dev` chạy không lỗi
- [ ] `prisma db seed` tạo data mẫu thành công
- [ ] Prisma Studio hiển thị đúng tables & relations
- [ ] Query liệt kê products by category trả về đúng kết quả

## Notes
- Sử dụng Neon free tier (pooled connection)
- JSON field cho specs linh hoạt (mỗi category có specs khác nhau)
- Soft delete: dùng deletedAt thay vì xóa hẳn

---
Next Phase: [phase-03-backend.md](./phase-03-backend.md)
