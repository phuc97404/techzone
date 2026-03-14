# Phase 07: Search, Filter & SEO
Status: ⬜ Pending
Dependencies: Phase 04, Phase 06

## Objective
Tối ưu tìm kiếm, filter sản phẩm và SEO cho toàn bộ storefront.

## Requirements
### Functional
- [ ] Search bar với autocomplete/suggestions
- [ ] URL-based filters (có thể share link)
- [ ] SEO meta tags cho tất cả trang

### Non-Functional
- [ ] Search response < 300ms
- [ ] SEO score > 90 (Lighthouse)
- [ ] Open Graph + Twitter Cards

## Implementation Steps

### Search (3 tasks)
1. [x] Search component:
   - Input với debounce (300ms)
   - Dropdown suggestions (top 5 products)
   - "Xem tất cả kết quả" link
   - Recent searches (localStorage)
2. [x] Search results page `/search?q=...`:
   - Product grid với highlight từ khóa
   - Số lượng kết quả
   - Sort options
3. [x] Full-text search API:
   - Prisma full-text search on PostgreSQL
   - Search in: name, description, specs
   - Fuzzy matching

### URL-based Filters (2 tasks)
4. [x] Filter sync with URL params:
   - Mỗi filter thay đổi → update URL
   - URL params → restore filter state
   - Shareable filter URLs
5. [x] Filter combinations:
   - Multiple brands
   - Price range
   - Category-specific filters (socket, capacity)

### SEO (3 tasks)
6. [x] Metadata cho tất cả pages:
   - Title, description, keywords
   - Open Graph (og:title, og:image, og:description)
   - Twitter Cards
   - Canonical URLs
7. [x] Structured Data (JSON-LD):
   - Product schema (price, rating, availability)
   - Organization schema
   - BreadcrumbList schema
8. [x] Technical SEO:
   - Sitemap.xml (auto-generated)
   - Robots.txt
   - Dynamic meta cho product pages
   - Image alt tags
   - Proper heading hierarchy (h1 > h2 > h3)

## Files to Create/Modify
- `src/components/storefront/SearchBar.tsx`
- `src/components/storefront/SearchSuggestions.tsx`
- `src/app/(storefront)/search/page.tsx`
- `src/app/sitemap.ts` - Dynamic sitemap
- `src/app/robots.ts` - Robots.txt
- `src/lib/seo.ts` - SEO helper functions
- All page files - Add generateMetadata()

## Test Criteria
- [ ] Search "RAM Kingston" trả về kết quả chính xác
- [ ] Filter URL shareable (copy-paste URL giữ filter)
- [ ] Lighthouse SEO score > 90
- [ ] Open Graph preview hiển thị đúng khi share
- [ ] Sitemap bao gồm tất cả product URLs

## Notes
- Debounce search: 300ms delay tránh spam API
- URL params dùng nuqs hoặc custom hook
- generateMetadata() cho dynamic SEO per page

---
Next Phase: [phase-08-testing-deploy.md](./phase-08-testing-deploy.md)
