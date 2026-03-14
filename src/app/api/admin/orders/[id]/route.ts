import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { status } = await req.json();
    
    // Validate status exists in enum
    if (!Object.values(OrderStatus).includes(status)) {
       return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
    }
    
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
