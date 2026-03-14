# Phase 03: Create/Edit News Form
Status: ⬜ Pending

## Objective
Xây dựng form chi tiết để đăng bài và chỉnh sửa nội dung bài viết.

## Requirements
- [ ] Trang `/admin/news/new/page.tsx` và `/admin/news/[id]/page.tsx`.
- [ ] Form sử dụng React Hook Form.
- [ ] Các trường: Title, Slug, Category, Excerpt, Thumbnail (URL), Featured (Checkbox).
- [ ] Trình soạn thảo Rich Text (hoặc Textarea cao cấp) cho Content.
- [ ] Xử lý lỗi validation và hiển thị Toast thông báo.

## Files to Create/Modify
- `src/components/admin/news/NewsPostForm.tsx`

## Test Criteria
- [ ] Tạo bài viết mới thành công và chuyển hướng về danh sách.
- [ ] Sửa bài viết cũ không làm thay đổi các trường không liên quan.
