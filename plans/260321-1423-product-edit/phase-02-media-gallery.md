# Phase 02: Hỗ trợ tính năng Media Gallery
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Thay thế khung thả ảnh duy nhất thành danh sách cho phép upload và quản lý nhiều ảnh (Gallery ảnh sản phẩm), hiện thumnails trực quan để người dùng review.

## Requirements
### Functional
- [ ] Render input cho phép multi-file upload.
- [ ] Giao diện hiện danh sách ảnh đang được chọn. Xóa từng ảnh nếu không mong muốn.
- [ ] Update trạng thái file mới upload và hình ảnh cũ hiện có vào database khi lưu form.

## Implementation Steps
1. [ ] Thêm biến trạng thái (state variable) để quản lý mảng `images`.
2. [ ] Tạo Grid UI chứa các thumbnail (`src` preview của các file đã chọn trên client `URL.createObjectURL(file)`).
3. [ ] Cập nhật module CSS cho khu vực `.uploadArea` & Grid hình. Mở rộng cho nhiều ảnh.
4. [ ] Cập nhật logic `handleSubmit` để gửi được mảng file qua API (FormData) hoặc truyền URL (trường hợp upload S3/cloudinary trước).

## Files to Create/Modify
- `src/components/modules/Admin/ProductForm.tsx`
- `src/components/modules/Admin/ProductForm.module.css`

---
Next Phase: `/code phase-03`
