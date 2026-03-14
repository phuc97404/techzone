# Phase 02: Admin News List Page
Status: ⬜ Pending

## Objective
Tạo giao diện danh sách bài viết trong khu vực Admin để theo dõi và quản lý nhanh.

## Requirements
- [ ] Trang `/admin/news/page.tsx`.
- [ ] Bảng hiển thị: Tiêu đề, Danh mục, Trạng thái nổi bật, Ngày đăng.
- [ ] Nút gạt (Switch) để bật nhanh "Nổi bật".
- [ ] Tìm kiếm bài viết theo tiêu đề.
- [ ] Nút Xóa có xác nhận (Confirmation Dialog).

## Files to Create/Modify
- `src/app/(admin)/admin/news/page.tsx`
- `src/components/admin/news/NewsListTable.tsx`

## Test Criteria
- [ ] Danh sách hiển thị đúng dữ liệu từ DB.
- [ ] Nút Toggle Featured cập nhật dữ liệu ngay lập tức.
