# Phase 01: Setup Environment & Prisma
Status: ⬜ Pending
Dependencies: None

## Objective
Thiết lập các biến môi trường cần thiết và cập nhật schema database để hỗ trợ thanh toán VNPay.

## Requirements
### Functional
- Cập nhật model `Order` trong Prisma để lưu `orderCode` và các thông tin thanh toán.
- Thiết lập các giá trị VNPay Sandbox trong `.env`.

## Implementation Steps
1. [ ] Cập nhật `.env` với các biến `VNP_TMNCODE`, `VNP_HASHSECRET`, `VNP_URL`, `VNP_RETURN_URL`.
2. [ ] Sửa đổi `prisma/schema.prisma`:
    - Thêm `orderCode` (String, Unique).
    - Thêm `paymentMethod` (String, default: "VNPAY").
    - Cập nhật `OrderStatus` enum nếu cần (PENDING, PAID, FAILED).
3. [ ] Chạy `npx prisma generate` và `npx prisma db push`.

## Files to Create/Modify
- `.env` - Thêm cấu hình VNPay.
- `prisma/schema.prisma` - Cập nhật model Order.

## Test Criteria
- [ ] Database phản ánh đúng cấu trúc mới.
- [ ] Prisma Client được regenerate thành công.
