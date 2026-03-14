# Phase 03: Data Layer & Seed
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Triển khai logic truy xuất dữ liệu và tạo dữ liệu mẫu.

## Tasks
- [ ] Hoàn thiện `src/lib/news.ts` với các hàm: `getPosts`, `getPostBySlug`, `getCategories`, `getFeaturedPosts`, `getRelatedPosts`
- [ ] Cập nhật `prisma/seed.ts` để thêm 4 categories và 10 posts mẫu
- [ ] Chạy lệnh `npx prisma db seed`

## Files to Create/Modify
- `src/lib/news.ts`
- `prisma/seed.ts`
