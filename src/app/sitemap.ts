import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hupu.vn";

  // Static routes
  const staticRoutes = [
    "",
    "/cart",
    "/search",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as any,
    priority: route === "" ? 1 : 0.8,
  }));

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Dynamic Categories
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/products/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as any,
    priority: 0.7,
  }));

  // Dynamic Products
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
  });

  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.category.slug}/${prod.slug}`,
    lastModified: prod.updatedAt,
    changeFrequency: "daily" as any,
    priority: 0.6,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
