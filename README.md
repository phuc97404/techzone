# 🖥️ TechZone - Linh Kiện Máy Tính Chính Hãng

TechZone là nền tảng thương mại điện tử chuyên cung cấp linh kiện máy tính, được xây dựng với kiến trúc hiện đại, tập trung vào hiệu năng, SEO và trải nghiệm người dùng cao cấp.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI/UX**: [Material UI (MUI)](https://mui.com/) + Atomic Design Structure
- **Styling**: CSS Modules + Global Design Tokens
- **Database**: [PostgreSQL (Neon Serverless)](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## 🏗️ Kiến trúc dự án (Architecture)

Dự án áp dụng mô hình **Atomic Design** để quản lý Component:

- **Atoms (`src/components/ui`)**: Thành phần cơ bản (Button, Card, DataTable, Badge...).
- **Molecules (`src/components/common`)**: Kết hợp các Atoms (ProductCard, CategoryGrid...).
- **Organisms (`src/components/modules`)**: Các khối UI lớn theo module (Header, Footer, Admin CMS...).

## 🛠️ Hướng dẫn cài đặt (Setup)

1. **Clone project và cài đặt thư viện**:
   ```bash
   yarn install
   ```

2. **Cấu hình biến môi trường**:
   Copy file `.env.example` thành `.env` và điền các thông tin:
   - `DATABASE_URL`: Kết nối PostgreSQL.
   - `AUTH_SECRET`: Khóa bảo mật NextAuth.
   - `NEXT_PUBLIC_BASE_URL`: URL trang web.

3. **Chạy Migration & Seed dữ liệu**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Chạy server phát triển**:
   ```bash
   yarn dev
   ```

## 📖 Tài liệu quan trọng

- [Kiến trúc Component](brain/4b31b84b-d3a4-4efa-ac3a-568464010883/techzone_architecture.md)
- [Hướng dẫn sử dụng Component (Constructor)](brain/4b31b84b-d3a4-4efa-ac3a-568464010883/techzone_constructor.md)
- [Changelog](CHANGELOG.md)

## 📁 Cấu trúc thư mục chính

```text
src/
├── app/             # Next.js App Router (Storefront & Admin)
├── components/      # UI Components (Atomic Design)
│   ├── ui/          # Atoms
│   ├── common/      # Molecules
│   └── modules/     # Organisms/Modules
├── lib/             # Utility functions, Auth, Prisma Client
├── styles/          # Global CSS & Tokens
└── types/           # Shared TypeScript definitions
```

---
Dự án được phát triển và tối ưu bởi **Antigravity AI**.
