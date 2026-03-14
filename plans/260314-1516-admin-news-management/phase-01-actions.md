# Phase 01: Server Actions Logic
Status: ⬜ Pending

## Objective
Xây dựng các hàm xử lý dữ liệu (Server Actions) để thực hiện CRUD bài viết và danh mục tin tức.

## Requirements
- [ ] Action `createPost`: Tạo bài viết mới.
- [ ] Action `updatePost`: Chỉnh sửa bài viết.
- [ ] Action `deletePost`: Xóa bài viết.
- [ ] Action `toggleFeatured`: Bật/tắt trạng thái nổi bật.
- [ ] Action `upsertNewsCategory`: Thêm/Sửa danh mục.
- [ ] Validation dữ liệu bằng Zod (Tiêu đề không để trống, slug duy nhất).

## Files to Create/Modify
- `src/app/actions/news.ts` - Chứa toàn bộ Server Actions cho News.
- `src/lib/validations/news.ts` - Định nghĩa Zod schema.

## Test Criteria
- [ ] Có thể gọi action tạo bài viết thành công từ code.
- [ ] Kiểm tra tính duy nhất của slug.
