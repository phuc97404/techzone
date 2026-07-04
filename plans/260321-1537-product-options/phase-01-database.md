# Phase 01: Bổ sung lược đồ dữ liệu (Database Schema)
Status: ✅ Complete
Dependencies: None

## Objective
Thay đổi file `prisma/schema.prisma` để thêm khả năng lưu biến thể động:
- Trên bảng `Product`: `options Json @default("[]")`
- Trên bảng `CartItem`: `selectedOptions Json?`
- Trên bảng `OrderItem`: `selectedOptions Json?` (sau này hiện lên màn hình Invoices)

## Functional Requirements
- Chạy `npx prisma db push` an toàn và `npm run generate`.
- Schema mới sẽ map đúng với backend TS (interface `Prisma.JsonValue`).

---
Next Phase: `/code phase-02`
