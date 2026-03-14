# Phase 04: IPN & Return Handlers
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Xử lý dữ liệu phản hồi từ VNPay sau khi người dùng thanh toán xong.

## Requirements
### Functional
- `Return URL`: Xử lý khi user được redirect về website, kiểm tra checksum và hiển thị kết quả.
- `IPN Webhook`: Xử lý ngầm từ server VNPay sang server website để cập nhật trạng thái đơn hàng chính xác nhất.

## Implementation Steps
1. [ ] Tạo file `src/app/api/payment/vnpay/return/route.ts`.
2. [ ] Tạo file `src/app/api/payment/vnpay/ipn/route.ts`.
3. [ ] Viết logic verify checksum cho cả 2 route.
4. [ ] Cập nhật trạng thái `PAID` hoặc `FAILED` trong database dựa trên `vnp_ResponseCode`.

## Files to Create/Modify
- `src/app/api/payment/vnpay/return/route.ts`
- `src/app/api/payment/vnpay/ipn/route.ts`

## Test Criteria
- [ ] Trạng thái đơn hàng trong DB được cập nhật tự động.
- [ ] Logic verify checksum hoạt động chính xác, từ chối request giả mạo.
