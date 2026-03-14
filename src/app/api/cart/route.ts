import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cartItemSchema } from "@/lib/validations/api";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { 
              select: { id: true, name: true, slug: true, price: true, salePrice: true, images: true, stock: true } 
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } }
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Cart GET API Error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity } = cartItemSchema.parse(body);

    const userId = session.user.id;

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if product exists and in stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status !== "ACTIVE" || product.stock < quantity) {
      return NextResponse.json({ error: "Sản phẩm không khả dụng hoặc hết hàng" }, { status: 400 });
    }

    // Update quantity if item exists, else add new item
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
             return NextResponse.json({ error: "Vượt quá số lượng tồn kho" }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      });
    }

    return NextResponse.json({ message: "Product added to cart" }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) console.error("POST Cart API error", error);
    return NextResponse.json({ error: "Bad request or server error" }, { status: 400 });
  }
}
