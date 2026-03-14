import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice || null,
        stock: data.stock,
        status: data.status,
        featured: data.featured,
        images: data.images,
        specs: data.specs,
        categoryId: data.categoryId,
        brandId: data.brandId,
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
