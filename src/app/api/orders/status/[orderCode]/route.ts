import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;
    
    const order = await (prisma.order as any).findUnique({
      where: { orderCode } as any,
      select: { status: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ status: order.status });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
