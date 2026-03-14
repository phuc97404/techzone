/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/common/Product/ProductGrid";
import FilterSidebar from "@/components/common/Product/FilterSidebar";
import styles from "./categoryPage.module.css";
import { notFound } from "next/navigation";

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const dbCat = await prisma.category.findUnique({
     where: { slug: category },
     select: { name: true }
  });

  return {
    title: dbCat ? `${dbCat.name} chính hãng` : "Danh mục sản phẩm",
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const search = await searchParams;

  const dbCat = await prisma.category.findUnique({ where: { slug: category } });
  if (!dbCat) return notFound();

  const brandParam = typeof search.brand === "string" ? search.brand.split(",") : [];
  const minPriceParam = typeof search.minPrice === "string" ? parseFloat(search.minPrice) : undefined;
  const maxPriceParam = typeof search.maxPrice === "string" ? parseFloat(search.maxPrice) : undefined;
  const sortParam = typeof search.sort === "string" ? search.sort : "newest";

  // Build prisma query
  let orderBy: any = { createdAt: "desc" };
  if (sortParam === "price_asc") orderBy = { price: "asc" };
  if (sortParam === "price_desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where: {
       categoryId: dbCat.id,
       status: "ACTIVE",
       ...(brandParam.length > 0 ? { brand: { slug: { in: brandParam } } } : {}),
       ...(minPriceParam || maxPriceParam ? {
         AND: [
           ...(minPriceParam ? [{ price: { gte: minPriceParam } }] : []),
           ...(maxPriceParam ? [{ price: { lte: maxPriceParam } }] : []),
         ]
       } : {}),
    },
    include: {
      category: { select: { slug: true } },
      brand: { select: { name: true } }
    },
    orderBy
  });

  // Get brands within this category for the filter sidebar
  const brandsInCategory = await prisma.brand.findMany({
     where: { products: { some: { categoryId: dbCat.id } } },
     select: { name: true, slug: true, id: true }
  });

  return (
    <div className={`container ${styles.pageLayout}`}>
      <aside className={styles.sidebar}>
         <FilterSidebar 
            brands={brandsInCategory} 
            currentBrands={brandParam} 
            currentSort={sortParam}
            minPrice={typeof search.minPrice === "string" ? search.minPrice : undefined}
            maxPrice={typeof search.maxPrice === "string" ? search.maxPrice : undefined}
         />
      </aside>
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
           <h1>{dbCat.name}</h1>
           <span className={styles.count}>({products.length} sản phẩm)</span>
        </div>

        {products.length === 0 ? (
          <div className={styles.emptyState}>
             <h3>Không tìm thấy sản phẩm nào!</h3>
             <p>Vui lòng chọn hệ thống lọc khác hoặc quay lại sau.</p>
          </div>
        ) : (
          <ProductGrid title="" products={products} />
        )}
      </div>
    </div>
  );
}
