import HeroBanner from "@/components/modules/HeroBanner";
import CategoryGrid from "@/components/common/Category/CategoryGrid";
import ProductGrid from "@/components/common/Product/ProductGrid";
import { prisma } from "@/lib/prisma";
import { Container } from "@mui/material";
import { Sparkles } from "lucide-react";

import FeaturedNews from "@/components/news/FeaturedNews";

// This enables ISR - Revalidate every 5 minutes (300 seconds)
export const revalidate = 300; 

export default async function HomePage() {
  // Parallel data fetching for performance
  const [featuredProducts, ramProducts, ssdProducts] = await Promise.all([
    // Sản phẩm nổi bật (featured = true)
    prisma.product.findMany({
      where: { featured: true, status: "ACTIVE" },
      take: 8,
      include: { category: { select: { slug: true } }, brand: { select: { name: true } } },
      orderBy: { createdAt: "desc" }
    }),
    
    // RAM Hot
    prisma.product.findMany({
      where: { category: { slug: "ram" }, status: "ACTIVE" },
      take: 4,
      include: { category: { select: { slug: true } }, brand: { select: { name: true } } },
      orderBy: { reviewCount: "desc" }
    }),

    // SSD Hot
    prisma.product.findMany({
      where: { category: { slug: "ssd" }, status: "ACTIVE" },
      take: 4,
      include: { category: { select: { slug: true } }, brand: { select: { name: true } } },
      orderBy: { reviewCount: "desc" }
    })
  ]);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16 min-h-screen bg-slate-900 overflow-x-hidden">
      <HeroBanner />
      <CategoryGrid />
      
      <ProductGrid 
         title="Sản Phẩm Nổi Bật" 
         products={featuredProducts} 
      />
      
      <Container maxWidth="xl" className="my-8">
         <div className="relative overflow-hidden rounded-3xl bg-slate-800 border border-slate-700/50 p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pink-500/20 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-3">
                 <Sparkles size={24} className="text-pink-500 animate-pulse" />
                 <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-400">SALE CUỐI THÁNG</h3>
               </div>
               <p className="text-slate-300 font-medium text-sm sm:text-base max-w-lg">Nhập mã <span className="font-bold text-pink-400 px-2 py-1 rounded bg-pink-500/10 border border-pink-500/20 mx-1">SAVE200K</span> giảm ngay 200k cho đơn từ 2 triệu.</p>
            </div>
            
            <button className="relative z-10 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:-translate-y-1 transition-all whitespace-nowrap">
              Săn Sale Ngay
            </button>
         </div>
      </Container>

      <ProductGrid 
         title="Ngập Tràn RAM HOT" 
         products={ramProducts} 
         viewAllLink="/products/ram" 
      />
      
      <ProductGrid 
         title="SSD Tốc Độ Cực Cao" 
         products={ssdProducts} 
         viewAllLink="/products/ssd" 
      />

      {/* Tin tức nổi bật */}
      <FeaturedNews />
    </div>
  );
}
