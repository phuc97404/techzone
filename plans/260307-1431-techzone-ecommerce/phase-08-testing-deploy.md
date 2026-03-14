# Phase 08: Testing & Deployment
Status: ⬜ Pending
Dependencies: All previous phases

## Objective
Kiểm tra toàn bộ ứng dụng, fix bugs, tối ưu performance và deploy lên Vercel.

## Requirements
### Functional
- [ ] Tất cả features hoạt động end-to-end
- [ ] Không có critical bugs
- [ ] Deploy thành công trên Vercel

### Non-Functional
- [ ] Lighthouse Performance > 85
- [ ] Build thành công không errors/warnings
- [ ] Environment variables configured

## Implementation Steps

### Testing (4 tasks)
1. [x] Smoke test tất cả pages:
   - Home, Product listing, Product detail
   - Cart, Checkout, Order success
   - Admin: Dashboard, Products, Orders, Inventory, Promotions
   - Auth: Login, Register
2. [x] End-to-end user flows:
   - Guest browsing → Register → Add to cart → Checkout
   - Admin login → Create product → Verify on storefront
   - Apply promotion → Checkout → Verify discount
3. [x] Responsive testing:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1280px, 1920px)
4. [x] Edge case testing:
   - Empty states (no products, empty cart)
   - Out of stock scenarios
   - Invalid inputs
   - Slow network

### Performance Optimization (3 tasks)
5. [x] Image optimization:
   - All images use Next/Image
   - Proper sizes & srcset
   - WebP format
   - Lazy loading
6. [x] Code optimization:
   - Route-based code splitting (default in App Router)
   - Dynamic imports for heavy components
   - Minimize client-side JavaScript
7. [x] Caching strategy:
   - ISR cho home page (revalidate: 300)
   - SSR cho product pages
   - API response caching headers

### Deployment (3 tasks)
8. [x] Setup Vercel project:
   - Connect Git repository
   - Configure environment variables
   - Setup Neon database (production)
9. [x] Pre-deploy checklist:
   - [ ] `npm run build` passes
   - [ ] No TypeScript errors
   - [ ] All env vars set
   - [ ] Database migrated
   - [ ] Seed data loaded (production)
   - [ ] Admin account created
10. [x] Deploy & verify:
    - Deploy to Vercel
    - Test production URL
    - Verify all features work
    - Check performance (Lighthouse)
    - Monitor for errors

## Files to Create/Modify
- `vercel.json` - Vercel configuration
- `.env.production` - Production env vars
- `next.config.ts` - Production optimizations
- Various files - Bug fixes from testing

## Test Criteria
- [ ] All pages load without errors
- [ ] Lighthouse Performance > 85, SEO > 90
- [ ] Mobile responsive hoạt động tốt
- [ ] Production deploy thành công
- [ ] Admin login + CRUD hoạt động trên production

## Notes
- Vercel free tier: đủ cho MVP
- Neon free tier: 0.5 GB storage
- Monitor: Vercel Analytics (free)
- Rollback: Vercel auto-keeps previous deployments

---
🎉 PROJECT COMPLETE!
