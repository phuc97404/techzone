# Phase 02: VNPay Utility Helpers
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Tạo các hàm helper để xử lý logic đặc thù của VNPay như tạo chữ ký mã hóa và build URL thanh toán.

## Requirements
### Functional
- Hàm tạo mã Hash SHA512.
- Hàm generate URL thanh toán từ các tham số input.
- Hàm kiểm tra tính hợp lệ của chữ ký (Checksum verification).

## Implementation Steps
1. [ ] Tạo file `src/lib/vnpay.ts`.
2. [ ] Cài đặt thư viện `crypto` (có sẵn trong Node.js).
3. [ ] Viết hàm `createPaymentUrl(params: any)`.
4. [ ] Viết hàm `verifyReturnUrl(vnp_Params: any)`.

## Files to Create/Modify
- `src/lib/vnpay.ts` - Logic chính của VNPay.

## Test Criteria
- [ ] Chữ ký tạo ra trùng khớp với công cụ test của VNPay.
- [ ] URL được sinh ra đúng định dạng yêu cầu của VNPay Sandbox.
