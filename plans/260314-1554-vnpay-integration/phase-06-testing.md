# Phase 06: Testing & Polish
Status: ⬜ Pending
Dependencies: Phase 05

## Objective
Kiểm thử toàn bộ quy trình và xử lý các trường hợp ngoại lệ (Edge Cases).

## Requirements
### Functional
- Đảm bảo IPN hoạt động kể cả khi server bận.
- Xử lý trường hợp người dùng hủy thanh toán ngang chừng.
- Format tiền tệ và mã đơn hàng chuẩn.

## Implementation Steps
1. [ ] Test luồng thành công.
2. [ ] Test luồng thất bại/hủy thanh toán.
3. [ ] Kiểm tra log server để đảm bảo IPN được gọi đúng.
4. [ ] Refactor code nếu cần.

## Test Criteria
- [ ] Quy trình end-to-end trơn tru.
- [ ] Không có bug nghiêm trọng liên quan đến tiền tệ.
