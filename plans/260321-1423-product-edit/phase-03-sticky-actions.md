# Phase 03: Bar hành động nổi (Sticky Actions)
Status: ✅ Complete
Dependencies:

## Objective
Luôn cho người dùng lưu các nội dung đã thay đổi ở bất kỳ vị trí cuộn chuột (scroll point) ở bên dưới hoặc header. Ở đây ta di chuyển nút `Cập nhật` sang trạng thái fixed tại bottom của cửa sổ/người dùng.

## Requirements
### Functional
- [ ] Gỡ nút Submit từ box bên phải "Trạng thái lưu".
- [ ] Render 1 container chứa hành động `Lưu sản phẩm/Cập nhật` ở Fixed vị trí bottom + z-index cao để luôn nhìn thấy, và cũng thuận tiện.

## Implementation Steps
1. [ ] Cập nhật `ProductForm.tsx` & `.module.css`. 
2. [ ] Tạo container Sticky Bottom.
3. [ ] Đảm bảo spacing padding bottom cho body app, tránh component nội dung bị đè bởi block sticky dưới cùng.

## Files to Create/Modify
- `src/components/modules/Admin/ProductForm.tsx`
- `src/components/modules/Admin/ProductForm.module.css`

---
All Done!
