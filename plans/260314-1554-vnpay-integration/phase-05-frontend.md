# Phase 05: Frontend Integration
Status: ⬜ Pending
Dependencies: Phase 04

## Objective
Hoàn thiện giao diện người dùng để thực hiện thanh toán và xem kết quả.

## Requirements
### Functional
- Trang Checkout có nút "Thanh toán với VNPay".
- Trang thông báo kết quả thanh toán (Success/Fail).

## Implementation Steps
1. [ ] Tạo/Cập nhật trang Checkout.
2. [ ] Gắn sự kiện click vào nút thanh toán để gọi API `/api/payment/vnpay/create`.
3. [ ] Tạo trang `src/app/checkout/success/page.tsx` và `src/app/checkout/failure/page.tsx` (hoặc xử lý ngay tại return URL).

## Files to Create/Modify
- `src/app/checkout/page.tsx`
- `src/app/checkout/result/page.tsx` (optional)

## Test Criteria
- [ ] Người dùng có thể click thanh toán và được dẫn sang VNPay.
- [ ] Sau khi thanh toán, người dùng nhìn thấy trang kết quả phù hợp.
