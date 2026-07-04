# Plan: Nâng cấp trang Chỉnh sửa Sản phẩm
Created: 2026-03-21T14:23:00+07:00
Status: 🟡 In Progress

## Overview
Cải thiện UI/UX cho trang `/admin/products/[id]/edit` nhằm giải quyết các vấn đề:
1. Sửa lỗi parse thông số kỹ thuật bị tách rời ký tự và giúp giao diện nhập trực quan hơn
2. Thêm hỗ trợ tải lên nhiều hình ảnh (Gallery) thay vì chỉ một hình ảnh mặc định
3. Gom nhóm và thiết kế lại nút "Cập nhật" ở vị trí luôn hiển thị (Sticky Bar)

## Tech Stack
- Frontend: Next.js (App Router), React
- Styling: CSS Modules (`ProductForm.module.css`)

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Sửa lỗi & Nâng cấp UI Thông số kỹ thuật | ✅ Complete | 100% |
| 02 | Thêm tính năng Multiple Image Gallery | ✅ Complete | 100% |
| 03 | Nút Cập nhật chạy theo màn hình (Sticky) | ✅ Complete | 100% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
