import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import ReviewSection from "@/components/common/Product/ReviewSection";
import ProductGrid from "@/components/common/Product/ProductGrid";
import ProductOptionsSelector from "@/components/common/Product/ProductOptionsSelector";
import { getProductSchema } from "@/lib/seo";
import { Container, Typography, Breadcrumbs } from "@mui/material";
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, select: { name: true } });
  return { title: product?.name || "Chi tiết sản phẩm" };
}

export default async function ProductDetail({ params }: { params: Promise<{ category: string, slug: string }> }) {
  const { slug } = await params;

  // Ideally fetched via Prisma since server-component
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      reviews: {
         include: { user: { select: { id: true, name: true } } },
         orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!product) return notFound();

  // Related products
  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, status: "ACTIVE" },
    take: 4,
    include: { category: true, brand: true },
    orderBy: { reviewCount: "desc" }
  });

  const images = (product.images as string[]) || [];
  let specs: Record<string, unknown> = {};
  if (typeof product.specs === 'string') {
    try { specs = JSON.parse(product.specs); } catch {}
  } else if (typeof product.specs === 'object' && product.specs !== null) {
    specs = product.specs as Record<string, unknown>;
  }

  const hasVariants = images.length > 1;

  const rawOptions = (product as { options?: unknown }).options;
  let parsedOptions: {name: string, values: {val: string, priceOffset: number}[]}[] = [];
  if (typeof rawOptions === 'string') {
    try { parsedOptions = JSON.parse(rawOptions); } catch {}
  } else if (Array.isArray(rawOptions)) {
    parsedOptions = rawOptions as any[];
  }
  
  parsedOptions = parsedOptions.map(opt => ({
    name: opt.name,
    values: opt.values.map((v: any) => typeof v === 'string' ? { val: v, priceOffset: 0 } : v)
  }));

  return (
    <Container maxWidth="xl" className="py-8 md:py-12 min-h-screen">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductSchema(product)) }}
       />
       
       {/* Breadcrumb */}
       <Breadcrumbs 
          separator={<ChevronRight size={14} className="text-slate-500" />} 
          aria-label="breadcrumb"
          className="mb-8"
          sx={{ '& .MuiBreadcrumbs-li': { margin: 0 } }}
       >
          <Link href="/" className="text-sm font-semibold text-slate-400 hover:text-pink-400 transition-colors">
             Trang chủ
          </Link>
          <Link href={`/products/${product.category.slug}`} className="text-sm font-semibold text-slate-400 hover:text-pink-400 transition-colors">
             {product.category.name}
          </Link>
          <Typography className="text-sm font-bold text-slate-200 line-clamp-1 max-w-[200px] sm:max-w-md" color="text.primary">
             {product.name}
          </Typography>
       </Breadcrumbs>

       <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 mb-16">
          {/* Left: Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
             <div className="relative w-full aspect-square bg-slate-800/50 rounded-3xl border border-slate-700/50 overflow-hidden flex items-center justify-center p-8 group shadow-inner">
                {images.length > 0 ? (
                   <>
                      <Image 
                         src={images[0]} 
                         alt={product.name} 
                         fill 
                         style={{ objectFit: 'contain' }} 
                         className="p-8 transform transition-transform duration-500 group-hover:scale-105"
                         priority 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   </>
                ) : (
                   <Typography variant="body1" className="text-slate-500 font-medium">Chưa có hình đại diện</Typography>
                )}
             </div>
             
             {hasVariants && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                   {images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-slate-800 border-2 border-transparent hover:border-pink-500 cursor-pointer overflow-hidden transition-all snap-start shadow-sm">
                          <Image src={img} alt={`Thumb ${idx}`} fill style={{ objectFit: 'contain' }} className="p-2" />
                      </div>
                   ))}
                </div>
             )}
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 flex flex-col items-start">
             <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="px-3 py-1 font-bold tracking-wider uppercase">{product.brand.name}</Badge>
                {product.stock > 0 ? (
                   <Badge variant="success" className="px-3 py-1 font-bold">Còn hàng (SL: {product.stock})</Badge>
                ) : (
                   <Badge variant="danger" className="px-3 py-1 font-bold">Hết hàng</Badge>
                )}
             </div>

             <Typography variant="h3" component="h1" className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
               {product.name}
             </Typography>
             
             <div className="flex items-center gap-4 mb-8">
                <Rating value={product.rating} count={product.reviewCount} />
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-sm font-semibold text-slate-400 hover:text-pink-400 cursor-pointer transition-colors">
                  {product.reviewCount} Đánh giá
                </span>
             </div>



             <Typography variant="body1" className="text-slate-300 text-base leading-relaxed mb-8 max-w-2xl">
                {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
             </Typography>

             <ProductOptionsSelector product={product} options={parsedOptions} images={images} />

             {/* Features/Promises */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10 py-6 border-y border-slate-700/50">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
                   <ShieldCheck className="text-emerald-400" size={28} />
                   <div>
                     <Typography className="font-bold text-slate-200 text-sm">Bảo hành 36 tháng</Typography>
                     <Typography className="text-xs text-slate-400">Chính hãng 100%</Typography>
                   </div>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
                   <Truck className="text-blue-400" size={28} />
                   <div>
                     <Typography className="font-bold text-slate-200 text-sm">Giao hàng miễn phí</Typography>
                     <Typography className="text-xs text-slate-400">Cho đơn từ 1.5 triệu</Typography>
                   </div>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
                   <RotateCcw className="text-pink-400" size={28} />
                   <div>
                     <Typography className="font-bold text-slate-200 text-sm">Đổi trả tận nơi</Typography>
                     <Typography className="text-xs text-slate-400">Lỗi là đổi mới liền</Typography>
                   </div>
                </div>
             </div>

             {/* Specs Mini Table */}
             {Object.keys(specs).length > 0 && (
                <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 sm:p-8">
                   <Typography variant="h6" className="font-bold text-slate-100 mb-6 flex items-center gap-3">
                     <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block"></span>
                     Thông số kỹ thuật
                   </Typography>
                   <ul className="flex flex-col">
                      {Object.entries(specs).slice(0, 8).map(([key, val], idx) => (
                         <li key={key} className={`flex items-start sm:items-center py-3 border-b border-slate-700/30 last:border-0 ${idx % 2 === 0 ? 'bg-slate-800/20' : ''} px-4 rounded-lg`}>
                            <span className="w-1/3 text-sm font-semibold text-slate-400 shrink-0">{key}</span>
                            <span className="w-2/3 text-sm font-bold text-slate-200 break-words">{val as string}</span>
                         </li>
                      ))}
                   </ul>
                </div>
             )}
          </div>
       </div>

       {/* Detailed Review Section */}
       <div className="mt-16 sm:mt-24 pt-16 border-t border-slate-800/80">
          <div className="max-w-4xl mx-auto">
             <ReviewSection 
                productId={product.id} 
                rating={product.rating} 
                reviewCount={product.reviewCount} 
                reviews={product.reviews} 
             />
          </div>
       </div>

       {/* Related Products */}
       {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24">
             <ProductGrid title="Sản Phẩm Tương Tự" products={relatedProducts} />
          </div>
       )}
    </Container>
  );
}
