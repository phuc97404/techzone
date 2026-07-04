# Phase 01: Sửa lỗi & Nâng cấp UI Thông số kỹ thuật
Status: ✅ Complete
Dependencies: None

## Objective
Khắc phục hiện tượng lỗi parse thông số kỹ thuật (JSON string bị biến thành array character như `[{"key": "0", "value": "{"}, ...]`). Chuyển đổi giao diện sang trực quan hơn, dễ chỉnh sửa các key-value pairs (tên - giá trị).

## Requirements
### Functional
- [ ] Parse `initialData.specs` chính xác từ kiểu String-JSON nếu cần. Tránh lỗi split từng ký tự.
- [ ] Render danh sách thông số rõ ràng (ví dụ: Key: "Kích thước", Value: "27 inch").
- [ ] Cho phép thêm sửa xóa thông số mượt mà. Đảm bảo dữ liệu up-save chính xác dạng JSON.

## Implementation Steps
1. [ ] Kiểm tra kiểu dữ liệu `specs` truyền vào trong thẻ `initialData` (có thể cần `try-catch` JSON.parse) trong form state.
2. [ ] Điều chỉnh logic `setSpecs` để fallback nếu không parse được JSON hợp lệ.
3. [ ] Nâng cấp UI ở component `ProductForm.tsx` ở `.specRow` để rõ ràng hơn.

## Files to Create/Modify
- `src/components/modules/Admin/ProductForm.tsx` - Điều chỉnh `useState` parse `initialData.specs`
- `src/components/modules/Admin/ProductForm.module.css` (Cải thiện nút và spacing nếu có)

---
Next Phase: `/code phase-02`
