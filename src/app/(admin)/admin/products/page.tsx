import { prisma } from "@/lib/prisma";
import ProductListClient from "./ProductListClient";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } }
    }
  });

  // Transform data to match client props expectations easily without sending complex DateTime objects if not needed 
  const formattedData = products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    status: p.status,
    category: p.category,
    image: p.images[0] || ""
  }));

  return <ProductListClient initialData={formattedData} />;
}
