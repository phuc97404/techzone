# Phase 06: Cart & Checkout
Status: ⬜ Pending
Dependencies: Phase 03, Phase 04

## Objective
Xây dựng luồng mua hàng hoàn chỉnh: Add to cart → Xem giỏ → Checkout → Xác nhận đơn.

## Requirements
### Functional
- [ ] Add to cart từ listing và detail page
- [ ] Giỏ hàng: xem, sửa số lượng, xóa
- [ ] Checkout: nhập thông tin, chọn thanh toán, đặt hàng
- [ ] Áp dụng mã khuyến mãi
- [ ] Guest cart (localStorage) + Sync khi login

### Non-Functional
- [ ] Cart persist qua refreshes
- [ ] Optimistic UI updates
- [ ] Form validation rõ ràng

## Implementation Steps

### Zustand Cart Store (2 tasks)
1. [x] Cart store (Zustand + persist middleware):
   - items: CartItem[]
   - addItem(product, quantity)
   - removeItem(productId)
   - updateQuantity(productId, quantity)
   - clearCart()
   - getTotalPrice()
   - getTotalItems()
2. [x] Cart sync logic:
   - Guest: lưu localStorage
   - Logged in: sync với server (POST /api/cart)

### Cart UI (3 tasks)
3. [x] Mini cart dropdown (header):
   - Hiển thị 3 items gần nhất
   - Tổng tiền
   - Button "Xem giỏ hàng"
4. [x] Cart page `/cart`:
   - Product list với ảnh, tên, giá, quantity selector
   - Remove button
   - Subtotal mỗi item
   - Tổng tiền
   - Nút "Tiếp tục mua" và "Thanh toán"
5. [x] Empty cart state (kèm CTA quay lại shopping)

### Checkout Flow (4 tasks)
6. [x] Checkout page `/checkout`:
   - Step 1: Thông tin giao hàng (tên, SĐT, địa chỉ)
   - Step 2: Review đơn hàng
   - Step 3: Xác nhận
7. [x] Promotion code input:
   - Input + "Áp dụng" button
   - Validate code qua API
   - Hiển thị discount trên tổng tiền
8. [x] Order confirmation:
   - Tạo order qua API
   - Giảm stock sản phẩm
   - Clear cart
   - Redirect đến trang "Đặt hàng thành công"
9. [x] Order success page:
   - Mã đơn hàng
   - Thông tin tóm tắt
   - CTA "Tiếp tục mua sắm" / "Xem đơn hàng"

### Edge Cases (1 task)
10. [x] Xử lý tình huống đặc biệt:
    - Sản phẩm hết hàng khi checkout → thông báo, suggest thay thế
    - Quantity vượt stock → giới hạn max
    - Promotion hết hạn → báo lỗi rõ ràng
    - Mất mạng khi checkout → retry logic

## Files to Create/Modify
- `src/stores/cart-store.ts` - Zustand store
- `src/app/(storefront)/cart/page.tsx` - Cart page
- `src/app/(storefront)/checkout/page.tsx` - Checkout
- `src/app/(storefront)/checkout/success/page.tsx` - Order success
- `src/components/storefront/MiniCart.tsx` - Header dropdown
- `src/components/storefront/CartItem.tsx` - Cart item row
- `src/components/storefront/CheckoutForm.tsx` - Checkout form
- `src/components/storefront/PromoCodeInput.tsx`
- `src/components/ui/QuantitySelector.tsx`

## Test Criteria
- [ ] Add to cart → số lượng badge cập nhật
- [ ] Cart persist sau page refresh
- [ ] Checkout flow hoàn chỉnh (tạo order thành công)
- [ ] Promotion code áp dụng đúng
- [ ] Edge cases xử lý mượt (hết hàng, invalid promo)

## Notes
- Zustand persist middleware dùng localStorage
- Optimistic update: UI update ngay, rollback nếu API fail
- COD (trả tiền khi nhận hàng) làm phương thức thanh toán mặc định

---
Next Phase: [phase-07-search-filter-seo.md](./phase-07-search-filter-seo.md)
