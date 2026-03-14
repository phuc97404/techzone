import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPromotionSchema } from "@/lib/validations/api";
import { z } from "zod";

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(promotions);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải dữ liệu Promotions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = createPromotionSchema.parse(body);

    const existingPromotion = await prisma.promotion.findUnique({
      where: { code: parsedData.code }
    });

    if (existingPromotion) {
      return NextResponse.json({ error: "Mã giảm giá đã tồn tại. Xin chọn mã khác" }, { status: 400 });
    }

    const promotion = await prisma.promotion.create({
      data: {
         name: parsedData.name,
         code: parsedData.code,
         discountType: parsedData.discountType as any,
         discountValue: parsedData.discountValue,
         minOrderValue: parsedData.minOrderValue || 0,
         maxDiscount: parsedData.maxDiscount,
         startDate: parsedData.startDate,
         endDate: parsedData.endDate,
         usageLimit: parsedData.usageLimit,
         active: true     // Sets to default internally or by param
      }
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Tham số đầu vào không đúng", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Thêm sự kiện giảm giá thất bại" }, { status: 500 });
  }
}
