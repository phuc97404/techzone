# Phase 05: Frontend - Admin CMS
Status: ✅ Completed
Dependencies: Phase 03, Phase 04

## Objective
Xây dựng Admin Dashboard cho quản lý sản phẩm, đơn hàng, tồn kho và khuyến mãi.

## Requirements
### Functional
- [x] Dashboard tổng quan (thống kê)
- [x] CRUD sản phẩm với upload ảnh
- [x] Quản lý đơn hàng (cập nhật trạng thái)
- [x] Theo dõi tồn kho
- [x] Quản lý khuyến mãi

### Non-Functional
- [x] Chỉ admin mới truy cập được
- [x] UI rõ ràng, dễ thao tác
- [x] Data table với sort/filter/search

## Implementation Steps

### Admin Layout (2 tasks)
1. [x] Admin layout với sidebar navigation:
   - Dashboard
   - Sản phẩm
   - Đơn hàng
   - Tồn kho
   - Khuyến mãi
   - Settings
2. [x] Admin middleware (chặn non-admin users)

### Dashboard (1 task)
3. [x] Dashboard overview:
   - Tổng doanh thu (hôm nay / tháng này)
   - Số đơn hàng mới
   - Sản phẩm sắp hết hàng
   - Đơn hàng gần đây
   - Mini chart (doanh thu 7 ngày)

### Quản Lý Sản Phẩm (3 tasks)
4. [x] Product list page:
   - Data table (name, category, price, stock, status)
   - Search, filter by category/status
   - Bulk actions (delete, change status)
5. [x] Product create/edit form:
   - Tên, slug (auto-generate), mô tả
   - Category & Brand select
   - Giá gốc, giá sale
   - Upload nhiều ảnh (drag & drop)
   - Thông số kỹ thuật (dynamic key-value pairs)
   - Trạng thái (Active/Draft)
   - Số lượng tồn kho
6. [x] Product image upload handler

### Quản Lý Đơn Hàng (2 tasks)
7. [x] Order list page:
   - Data table (mã đơn, khách hàng, tổng tiền, trạng thái, ngày)
   - Filter by status (Pending/Confirmed/Shipping/Delivered/Cancelled)
   - Search by order ID or customer
8. [x] Order detail page:
   - Thông tin khách hàng
   - Danh sách sản phẩm trong đơn
   - Timeline trạng thái
   - Buttons cập nhật trạng thái

### Tồn Kho (2 tasks)
9. [x] Inventory page:
   - Bảng tồn kho (sản phẩm, category, stock, status)
   - Cảnh báo: đỏ nếu hết hàng, vàng nếu sắp hết (< 5)
   - Quick edit stock inline
10. [x] Low stock alerts (badge trên sidebar)

### Khuyến Mãi (2 tasks)
11. [x] Promotion list + create/edit:
    - Tên, mã code, loại giảm giá (% hoặc cố định)
    - Giá trị giảm
    - Ngày bắt đầu / kết thúc
    - Trạng thái (Active/Expired/Disabled)
12. [x] Promotion validation logic (kiểm tra code hợp lệ)

## Files to Create/Modify
- `src/app/(admin)/admin/layout.tsx` - Admin layout + sidebar
- `src/app/(admin)/admin/page.tsx` - Dashboard
- `src/app/(admin)/admin/products/page.tsx` - Product list
- `src/app/(admin)/admin/products/new/page.tsx` - Create product
- `src/app/(admin)/admin/products/[id]/edit/page.tsx` - Edit product
- `src/app/(admin)/admin/orders/page.tsx` - Order list
- `src/app/(admin)/admin/orders/[id]/page.tsx` - Order detail
- `src/app/(admin)/admin/inventory/page.tsx` - Inventory
- `src/app/(admin)/admin/promotions/page.tsx` - Promotions
- `src/components/admin/Sidebar.tsx`
- `src/components/admin/DataTable.tsx`
- `src/components/admin/StatsCard.tsx`
- `src/components/admin/ProductForm.tsx`
- `src/components/admin/OrderTimeline.tsx`

## Test Criteria
- [x] Non-admin users bị redirect khi truy cập /admin
- [x] CRUD sản phẩm hoạt động end-to-end
- [x] Cập nhật trạng thái đơn hàng thành công
- [x] Tồn kho cập nhật realtime khi có đơn hàng mới
- [x] Promotion code validation hoạt động

## Notes
- Admin dùng light theme cho dễ đọc data table
- DataTable component tái sử dụng cho tất cả list pages
- Image upload dùng base64 trước, chuyển sang Cloudinary sau

---
Next Phase: [phase-06-cart-checkout.md](./phase-06-cart-checkout.md)
