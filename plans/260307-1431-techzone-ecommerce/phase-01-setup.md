# Phase 01: Project Setup
Status: ⬜ Pending
Dependencies: None

## Objective
Khởi tạo dự án Next.js 15, cài đặt dependencies, tạo cấu trúc folder chuẩn, setup Git.

## Requirements
### Functional
- [ ] Next.js 15 app chạy được với `npm run dev`
- [ ] TypeScript configured
- [ ] Cấu trúc folder rõ ràng, scalable

### Non-Functional
- [ ] Build time < 30s
- [ ] Dev server hot reload < 2s

## Implementation Steps
1. [ ] Tạo Next.js 15 project với App Router + TypeScript
2. [ ] Install core dependencies:
   - prisma, @prisma/client
   - next-auth@beta
   - zustand
   - bcryptjs
   - zod (validation)
3. [ ] Install dev dependencies:
   - @types/bcryptjs
   - prisma (CLI)
4. [ ] Setup folder structure:
   ```
   src/
   ├── app/
   │   ├── (storefront)/     # Public pages
   │   │   ├── page.tsx       # Home
   │   │   ├── products/      # Product listing & detail
   │   │   ├── cart/           # Shopping cart
   │   │   └── checkout/      # Checkout flow
   │   ├── (admin)/           # Admin CMS
   │   │   └── admin/
   │   │       ├── page.tsx         # Dashboard
   │   │       ├── products/        # CRUD products
   │   │       ├── orders/          # Order management
   │   │       ├── inventory/       # Stock management
   │   │       └── promotions/      # Promotion management
   │   ├── api/               # API Routes
   │   │   ├── auth/
   │   │   ├── products/
   │   │   ├── orders/
   │   │   └── admin/
   │   ├── layout.tsx
   │   └── globals.css
   ├── components/
   │   ├── ui/                # Reusable UI components
   │   ├── storefront/        # Storefront-specific
   │   └── admin/             # Admin-specific
   ├── lib/
   │   ├── prisma.ts          # Prisma client
   │   ├── auth.ts            # Auth config
   │   ├── utils.ts           # Utility functions
   │   └── constants.ts       # App constants
   ├── stores/
   │   └── cart-store.ts      # Zustand cart store
   ├── types/
   │   └── index.ts           # TypeScript types
   └── data/
       └── seed.ts            # Seed data
   ```
5. [ ] Setup CSS design system (globals.css):
   - Color palette (dark theme primary)
   - Typography scale
   - Spacing system
   - CSS Variables
6. [ ] Tạo .env.example với các biến cần thiết
7. [ ] Setup Git + .gitignore + initial commit
8. [ ] Verify: `npm run dev` chạy thành công

## Files to Create/Modify
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `src/app/layout.tsx` - Root layout
- `src/app/globals.css` - Design system
- `src/lib/prisma.ts` - Prisma singleton
- `.env.example` - Environment template
- `.gitignore` - Git ignore rules

## Test Criteria
- [ ] `npm run dev` chạy không lỗi
- [ ] `npm run build` build thành công
- [ ] Truy cập localhost:3000 thấy trang home

## Notes
- Đây là phase DUY NHẤT chạy npm install
- Các phase sau KHÔNG install thêm trừ khi cần package mới

---
Next Phase: [phase-02-database.md](./phase-02-database.md)
