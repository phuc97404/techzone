# Phase 03: Payment Creation API
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Xây dựng API endpoint để tạo đơn hàng trong DB và sinh link redirect sang VNPay.

## Requirements
### Functional
- Nhận thông tin đơn hàng từ frontend.
- Lưu đơn hàng vào DB với trạng thái `PENDING`.
- Trả về `paymentUrl` cho frontend.

## Implementation Steps
1. [ ] Tạo file `src/app/api/payment/vnpay/create/route.ts`.
2. [ ] Implement logic kiểm tra giỏ hàng/số tiền.
3. [ ] Gọi helper `createPaymentUrl`.
4. [ ] Trả về JSON `{ url: ... }`.

## Files to Create/Modify
- `src/app/api/payment/vnpay/create/route.ts` - API tạo link thanh toán.

## Test Criteria
- [ ] API trả về link VNPay hợp lệ.
- [ ] Một bản ghi Order mới được tạo trong database.
