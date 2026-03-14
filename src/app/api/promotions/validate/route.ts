import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, orderTotal } = await req.json();

    if (!code || orderTotal === undefined) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const promo = await prisma.promotion.findFirst({
      where: {
        code: code,
        active: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      }
    });

    if (!promo) {
       return NextResponse.json({ error: "Mã khuyến mãi không hợp lệ hoặc đã hết hạn" }, { status: 404 });
    }

    let discountAmount = 0;
    if (promo.discountType === "PERCENTAGE") {
      discountAmount = (orderTotal * promo.discountValue) / 100;
    } else {
      discountAmount = promo.discountValue;
    }

    if (discountAmount > orderTotal) {
       discountAmount = orderTotal;
    }

    return NextResponse.json({ discountAmount, promoCode: promo.code }, { status: 200 });

  } catch (error: any) {
    console.error("Promo code error:", error);
    return NextResponse.json({ error: "Lỗi kiểm tra mã" }, { status: 500 });
  }
}
