# Phase 02: Database Schema
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Thiết kế và cập nhật Schema Prisma để hỗ trợ module News.

## Tasks
- [ ] Định nghĩa model `NewsCategory` trong `schema.prisma`
- [ ] Định nghĩa model `Post` với các quan hệ và index cần thiết
- [ ] Chạy `npx prisma generate` và `npx prisma db push` (hoặc migrate)

## Requirements
### Functional
- Bảng `NewsCategory` có: id, name, slug
- Bảng `Post` có: id, title, slug, excerpt, content, thumbnail, categoryId, isFeatured, createdAt, updatedAt
- Quan hệ 1-N giữa Category và Post

## Files to Create/Modify
- `prisma/schema.prisma` - Cập nhật model
