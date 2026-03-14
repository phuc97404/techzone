import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const promotion = await prisma.promotion.findUnique({
      where: { id }
    });

    if (!promotion) {
      return NextResponse.json({ error: "Mã giảm giá đã bị xoá hoặc không tồn tại" }, { status: 404 });
    }

    await prisma.promotion.delete({ where: { id } });

    return NextResponse.json({ message: "Xóa mã giảm giá thành công" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xóa dữ liệu" }, { status: 500 });
  }
}
