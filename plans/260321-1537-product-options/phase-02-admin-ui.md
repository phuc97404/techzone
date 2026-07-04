# Phase 02: Xây dựng Admin Product Options Builder
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Tạo giao diện người quản trị thêm tuỳ chọn (UI Builder):
- Box "Tuỳ chọn Mua hàng" nằm trên form.
- Có thể xoá / thêm Name (Kích thước) và list values ("S", "M", "L").
- Dữ liệu map dạng `[{ name: "Size", values: ["S", "M"] }]` và serialize JSON lên DB qua API `/api/admin/products`.

## Functional Requirements
- Component Dynamic Option List như cái khung Specs lúc trước.
- Parsing & Validation array (Tránh gửi tên trùng).
- Cập nhật Prisma query ở backend endpoint.

---
Next Phase: `/code phase-03`
