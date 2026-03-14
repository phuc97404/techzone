import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: "desc" },
          take: 5
        }
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: "ACTIVE"
      },
      take: 4,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      product,
      relatedProducts
    });
    
  } catch (error) {
    console.error("Product Detail API Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
