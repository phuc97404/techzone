# Technical Specification: News/Blog Module

## 1. Executive Summary
Module Tin tức/Blog giúp TechZone cung cấp nội dung hữu ích, cập nhật công nghệ và tối ưu SEO. Người dùng có thể xem danh sách bài viết, lọc theo chủ đề và đọc nội dung chi tiết.

## 2. Database Design

### Model: NewsCategory
- `id`: String (CUID), Primary Key
- `name`: String
- `slug`: String, Unique
- `createdAt`: DateTime, default: now()

### Model: Post
- `id`: String (CUID), Primary Key
- `title`: String
- `slug`: String, Unique
- `excerpt`: String (Tóm tắt)
- `content`: String (Dạng Text/HTML)
- `thumbnail`: String (URL hình ảnh)
- `categoryId`: String, Foreign Key -> NewsCategory
- `isFeatured`: Boolean, default: false
- `createdAt`: DateTime, default: now()
- `updatedAt`: DateTime, updated

### Relationships
- `NewsCategory` 1 --- N `Post`

## 3. Logic Flow
1. **Trang chủ**: Fetch các bài viết có `isFeatured: true`.
2. **Trang `/news`**: 
   - Mặc định hiện tất cả bài viết mới nhất.
   - Có thể lọc theo category thông qua URL query param `?category=slug`.
   - Hỗ trợ phân trang qua `?page=n`.
3. **Trang `/news/[slug]`**:
   - Tìm bài viết theo slug. Nếu không thấy hiện trang 404.
   - Hiển thị bài viết và 3 bài cùng category (ngoại trừ bài hiện tại).

## 4. UI Components
- `NewsCard`: Dùng Grid layout. Hiển thị ảnh (Next/Image), title, mô tả ngắn, tag danh mục.
- `CategoryFilter`: Thanh danh mục ngang hoặc sidebar.
- `PostDetail`: Nội dung trình bày sạch sẽ, typography chuẩn cho đọc báo.

## 5. SEO & Metadata
- Sử dụng `generateMetadata` trong App Router.
- Open Graph tags cho Facebook/Zalo sharing.
- Slug thân thiện (URL-friendly).

## 6. Tech Stack Details
- Framework: Next.js 14 (App Router)
- ORM: Prisma
- Database: Neon PostgreSQL
- Styling: TailwindCSS
- Icons: Lucide React
