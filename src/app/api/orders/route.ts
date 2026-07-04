import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const data = await req.json();
    const { items, shippingName, shippingPhone, shippingAddress, note, promoCode } = data;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Use transaction to ensure data integrity
    const order = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      let discountAmount = 0;
      let promotionId = null;

      // 1. Verify items and calculate subtotal, also verify stock
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Sản phẩm ${product.name} đã hết hàng hoặc không đủ số lượng`);
        }
        let basePrice = product.salePrice ?? product.price;
        
        // Calculate price offset from options
        const rawOptions = (product as { options?: unknown }).options;
        if (item.selectedOptions && typeof rawOptions === 'object') {
           const parsedOptions = Array.isArray(rawOptions) ? rawOptions : [];
           for (const [groupName, valName] of Object.entries(item.selectedOptions)) {
              const group = parsedOptions.find((o: any) => o.name === groupName);
              if (group && Array.isArray(group.values)) {
                 const optVal = group.values.find((v: any) => v.val === valName);
                 if (optVal && optVal.priceOffset) {
                    basePrice += optVal.priceOffset;
                 }
              }
           }
        }
        
        totalAmount += basePrice * item.quantity;
      }

      // 2. Apply promo code if present
      if (promoCode) {
        const promo = await tx.promotion.findFirst({
           where: {
             code: promoCode,
             active: true,
             startDate: { lte: new Date() },
             endDate: { gte: new Date() }
           }
        });
        
        if (promo) {
          promotionId = promo.id;
          if (promo.discountType === "PERCENTAGE") {
            discountAmount = (totalAmount * promo.discountValue) / 100;
          } else {
            discountAmount = promo.discountValue;
          }
          // Cap discount to total amount just in case
          if (discountAmount > totalAmount) discountAmount = totalAmount;

          // Increment used count
          await tx.promotion.update({
             where: { id: promo.id },
             data: { usedCount: { increment: 1 } }
          });
        }
      }

      const finalTotal = totalAmount - discountAmount;

      // 3. Create the order
      if (!session?.user?.id) {
        throw new Error("Vui lòng đăng nhập để thanh toán đơn hàng.");
      }

      const newOrder = await (tx.order as any).create({
        data: {
           userId: session.user.id,
           total: finalTotal,
           discountAmount: discountAmount,
           promotionCode: promotionId ? promoCode : null,
           status: "PENDING",
           shippingName,
           shippingPhone,
           shippingAddress,
           note,
           items: {
              create: items.map((item: any) => ({
                 productId: item.productId,
                 quantity: item.quantity,
                 price: item.price,
                 selectedOptions: item.selectedOptions || null
              }))
           }
        } as any
      });

      // 4. Decrease stock
      for (const item of items) {
         await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
         });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
