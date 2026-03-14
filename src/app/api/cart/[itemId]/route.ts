import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
// order status is unused

const updateCartSchema = z.object({
  quantity: z.coerce.number().min(1).optional(),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { quantity } = updateCartSchema.parse(body);
    const params = await context.params;
    const { itemId } = params;

    // Verify item belongs to user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
       return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (quantity) {
       // Validate stock
       const product = await prisma.product.findUnique({ where: { id: cartItem.productId } });
       if (!product || product.stock < quantity) {
           return NextResponse.json({ error: "Sản phẩm không đủ trong kho" }, { status: 400 });
       }

       await prisma.cartItem.update({
         where: { id: itemId },
         data: { quantity }
       });
    }

    return NextResponse.json({ message: "Cart item updated" });
  } catch (error: unknown) {
    if (error instanceof Error) console.error("PUT API error:", error.message);
    return NextResponse.json({ error: "API Failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
     const session = await auth();
     if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

     const params = await context.params;
     const { itemId } = params;

     const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
       return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({ message: "Cart item removed" });
  } catch (error: unknown) {
     if (error instanceof Error) console.error("DELETE API error:", error.message);
     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
