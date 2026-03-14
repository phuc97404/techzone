import { prisma } from "@/lib/prisma";
import InventoryListClient from "./InventoryListClient";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { stock: "asc" }, // Sắp xếp theo số lượng tồn kho (thấp nhất lên đầu)
    select: {
      id: true,
      name: true,
      stock: true,
      status: true,
      images: true,
      category: { select: { name: true } }
    }
  });

  const formattedData = products.map(p => ({
    id: p.id,
    name: p.name,
    stock: p.stock,
    status: p.status,
    category: p.category.name,
    image: p.images[0] || ""
  }));

  return <InventoryListClient initialData={formattedData} />;
}
