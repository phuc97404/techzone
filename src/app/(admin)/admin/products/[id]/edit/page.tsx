import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/modules/Admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.brand.findMany({ select: { id: true, name: true } })
  ]);

  if (!product) {
    return notFound();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
         <Link href="/admin/products" style={{ color: "var(--color-text-muted)", display: "flex", alignItems: "center" }}>
            <ArrowLeft size={20} />
         </Link>
         <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>Chỉnh sửa sản phẩm: {product.name}</h1>
      </div>

      <ProductForm initialData={product} categories={categories} brands={brands} />
    </div>
  );
}
