import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const data = await req.json();
    
    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    
    // Use soft delete or hard delete depending on business rules. We use hard delete here for simplicity based on phase plan.
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
