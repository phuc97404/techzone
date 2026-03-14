# Phase 04: Frontend - Storefront UI
Status: ✅ Completed
Dependencies: Phase 03

## Objective
Xây dựng giao diện storefront hoàn chỉnh với thiết kế premium, hiện đại, lấy cảm hứng từ memoryzone.com.vn.

## Requirements
### Functional
- [x] Trang chủ với đầy đủ sections
- [x] Trang danh sách sản phẩm theo category
- [x] Trang chi tiết sản phẩm
- [x] Responsive trên mobile/tablet/desktop

### Non-Functional
- [x] LCP < 2.5s (Core Web Vitals)
- [x] Premium UI với dark theme
- [x] Smooth animations & transitions
- [x] Image optimization với Next/Image

## Implementation Steps

### Layout & Navigation (3 tasks)
1. [x] Header component:
   - Logo TechZone
   - Navigation menu (7 categories)
   - Search bar
   - Cart icon với badge (số lượng)
   - User menu (Login/Register/Account)
2. [x] Footer component:
   - Thông tin công ty
   - Liên kết nhanh
   - Mạng xã hội
   - Bản quyền
3. [x] Mobile responsive menu (hamburger)

### Trang Chủ (6 tasks)
4. [x] Hero Banner Slider:
   - Auto-play carousel
   - Responsive images
   - CTA buttons (Mua ngay, Xem thêm)
5. [x] Category Grid:
   - 7 category cards với icon/image
   - Hover effect
   - Link đến trang danh mục
6. [x] Sản phẩm nổi bật (Featured Products):
   - Grid 4 cột
   - Product card component (image, name, price, rating, add to cart)
7. [x] RAM Hot section:
   - Horizontal scroll hoặc grid
   - Lọc sẵn category RAM, sort by popularity
8. [x] SSD Hot section:
   - Tương tự RAM Hot
9. [x] Khuyến mãi section:
   - Banner khuyến mãi
   - Countdown timer (nếu có end date)
   - Danh sách sản phẩm giảm giá

### Product Card Component (2 tasks)
10. [x] ProductCard component:
    - Product image với lazy loading
    - Brand badge
    - Product name (2 lines max)
    - Original price (strikethrough nếu có sale)
    - Sale price (highlighted)
    - Discount badge (% off)
    - Rating stars
    - Add to cart button
    - Quick view hover overlay
11. [x] ProductCard skeleton loading (shimmer effect)

### Trang Danh Sách Sản Phẩm (4 tasks)
12. [x] Product listing page `/products/[category]`:
    - Breadcrumb navigation
    - Sidebar filters (desktop) / Bottom sheet (mobile)
    - Product grid (3-4 columns)
    - Sort dropdown (Giá tăng/giảm, Mới nhất, Bán chạy)
    - Pagination
13. [x] Filter sidebar:
    - Khoảng giá (range slider)
    - Thương hiệu (checkbox list)
    - Socket CPU (cho category CPU/Mainboard)
    - Dung lượng (cho RAM/SSD)
    - Rating filter
14. [x] Empty state khi không có sản phẩm
15. [x] Loading states (skeleton grid)

### Trang Chi Tiết Sản Phẩm (3 tasks)
16. [x] Product detail page `/products/[category]/[slug]`:
    - Image gallery (main + thumbnails)
    - Product info (name, brand, price, availability)
    - Thông số kỹ thuật (table format)
    - Quantity selector + Add to cart
    - Mô tả chi tiết
17. [x] Review section:
    - Average rating display
    - Review list (avatar, name, rating, comment, date)
    - "Viết đánh giá" form
18. [x] Related products carousel

## Files to Create/Modify
- `src/components/storefront/Header.tsx` + `Header.module.css`
- `src/components/storefront/Footer.tsx` + `Footer.module.css`
- `src/components/storefront/HeroBanner.tsx`
- `src/components/storefront/CategoryGrid.tsx`
- `src/components/storefront/ProductCard.tsx`
- `src/components/storefront/ProductGrid.tsx`
- `src/components/storefront/FilterSidebar.tsx`
- `src/components/storefront/ReviewSection.tsx`
- `src/app/(storefront)/page.tsx` - Home
- `src/app/(storefront)/products/[category]/page.tsx` - Listing
- `src/app/(storefront)/products/[category]/[slug]/page.tsx` - Detail
- `src/components/ui/Skeleton.tsx`
- `src/components/ui/Rating.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/PriceDisplay.tsx`

## Test Criteria
- [x] Trang chủ hiển thị đầy đủ sections
- [x] Product listing filter hoạt động chính xác
- [x] Product detail hiển thị đầy đủ thông tin
- [x] Responsive: Mobile 375px, Tablet 768px, Desktop 1280px+
- [x] Images lazy loaded, skeleton loading hiển thị

## Notes
- Dark theme làm chủ đạo (phong cách gaming/tech)
- Sử dụng CSS Modules cho scoped styling
- Next/Image cho tất cả product images
- SSR cho product pages (SEO)
- ISR cho trang chủ (revalidate mỗi 5 phút)

---
Next Phase: [phase-05-admin-cms.md](./phase-05-admin-cms.md)
