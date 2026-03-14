# TechZone - E-commerce Spec

## 1. Executive Summary
TechZone là website thương mại điện tử bán linh kiện máy tính, xây dựng trên nền tảng Next.js 15 full-stack, deploy trên Vercel. Website phục vụ khách hàng cá nhân mua linh kiện PC với đầy đủ chức năng: duyệt sản phẩm, tìm kiếm/filter, giỏ hàng, checkout, và quản trị hệ thống (CMS).

## 2. User Stories

### Customer
- Là khách hàng, tôi muốn **duyệt sản phẩm theo danh mục** để tìm linh kiện cần thiết
- Là khách hàng, tôi muốn **filter theo giá, hãng, socket** để thu hẹp lựa chọn
- Là khách hàng, tôi muốn **xem thông số kỹ thuật chi tiết** để so sánh sản phẩm
- Là khách hàng, tôi muốn **đọc đánh giá** từ người mua trước
- Là khách hàng, tôi muốn **thêm vào giỏ hàng** và **checkout** nhanh chóng
- Là khách hàng, tôi muốn **dùng mã khuyến mãi** để được giảm giá

### Admin
- Là admin, tôi muốn **thêm/sửa/xóa sản phẩm** dễ dàng
- Là admin, tôi muốn **theo dõi đơn hàng** và cập nhật trạng thái
- Là admin, tôi muốn **giám sát tồn kho** và nhận cảnh báo hết hàng
- Là admin, tôi muốn **tạo khuyến mãi** với mã code và thời hạn

## 3. Product Categories
| Category | Ví dụ sản phẩm | Specs đặc thù |
|----------|----------------|---------------|
| CPU | Intel i9-14900K, AMD Ryzen 9 7950X | Socket, Cores, Threads, Clock, TDP |
| Mainboard | ASUS ROG STRIX, MSI MAG | Socket, Chipset, Form Factor, RAM slots |
| GPU | RTX 4090, RX 7900 XTX | VRAM, CUDA Cores, Clock, TDP |
| RAM | Kingston Fury, Corsair Vengeance | Capacity, Speed, DDR gen, Latency |
| SSD | Samsung 990 Pro, WD Black | Capacity, Interface, Read/Write speed |
| Phụ kiện | Keychron, Razer, Logitech | Type, Connectivity, Features |
| Màn hình | ASUS ProArt, LG UltraGear | Size, Resolution, Panel, Refresh rate |

## 4. Data Entities
- **User:** id, email, password, name, role, phone, address
- **Category:** id, name, slug, image, parentId
- **Brand:** id, name, slug, logo
- **Product:** id, name, slug, description, price, salePrice, images, categoryId, brandId, stock, featured, status, specs (JSON)
- **Review:** id, productId, userId, rating, comment
- **Cart / CartItem:** userId, productId, quantity
- **Order / OrderItem:** userId, total, status, shippingAddress, items
- **Promotion:** id, name, code, discountType, discountValue, dates, active

## 5. Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database | PostgreSQL (Neon Serverless) |
| ORM | Prisma |
| Auth | NextAuth.js v5 (Credentials) |
| Styling | CSS Modules + CSS Variables |
| State | Zustand (Cart, Filters) |
| Validation | Zod |
| Deploy | Vercel |

## 6. Pages
| Page | Route | Type |
|------|-------|------|
| Home | `/` | ISR |
| Product Listing | `/products/[category]` | SSR |
| Product Detail | `/products/[category]/[slug]` | SSR |
| Search | `/search` | CSR |
| Cart | `/cart` | CSR |
| Checkout | `/checkout` | CSR |
| Order Success | `/checkout/success` | CSR |
| Login | `/login` | CSR |
| Register | `/register` | CSR |
| Admin Dashboard | `/admin` | SSR (Protected) |
| Admin Products | `/admin/products` | SSR (Protected) |
| Admin Orders | `/admin/orders` | SSR (Protected) |
| Admin Inventory | `/admin/inventory` | SSR (Protected) |
| Admin Promotions | `/admin/promotions` | SSR (Protected) |

## 7. Edge Cases
| Tình huống | Xử lý |
|------------|--------|
| Hết hàng khi checkout | Thông báo, suggest sản phẩm thay thế |
| Quantity vượt stock | Giới hạn max = stock |
| Mã khuyến mãi hết hạn | Báo lỗi "Mã đã hết hạn" |
| Upload ảnh lớn | Resize + compress trước khi lưu |
| Khách hủy đơn | Hoàn stock, cập nhật trạng thái CANCELLED |
| Mất mạng khi checkout | Retry logic, lưu draft đơn hàng |
