import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyReturnUrl } from "@/lib/vnpay";

/**
 * Handle VNPay IPN (Server-to-Server Webhook)
 * GET /api/payment/vnpay/ipn
 * Updated: 2026-03-14 17:00
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vnp_Params = Object.fromEntries(searchParams.entries());

    // 1. Verify Checksum
    const isValid = verifyReturnUrl({ ...vnp_Params });
    if (!isValid) {
      return NextResponse.json({ RspCode: "97", Message: "Invalid checksum" });
    }

    const orderCode = searchParams.get("vnp_TxnRef");
    const amount = Number(searchParams.get("vnp_Amount")) / 100;
    const responseCode = searchParams.get("vnp_ResponseCode");
    const transactionNo = searchParams.get("vnp_TransactionNo");

    // 2. Find Order in DB
    if (!orderCode) {
      return NextResponse.json({ RspCode: "01", Message: "Missing order reference" });
    }

    const order = await (prisma.order as any).findUnique({
      where: { orderCode } as any,
    });

    if (!order) {
      return NextResponse.json({ RspCode: "01", Message: "Order not found" });
    }

    // 3. Verify Amount
    // Use Math.round to avoid float issues
    if (Math.round(order.total) !== Math.round(amount)) {
      return NextResponse.json({ RspCode: "04", Message: "Invalid amount" });
    }

    // 4. Check Order current status
    // Only update if PENDING
    if (order.status !== "PENDING") {
      return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });
    }

    // 5. Process Payment Result
    if (responseCode === "00") {
      // Success
      await (prisma.order as any).update({
        where: { id: order.id },
        data: {
          status: "PAID" as any,
          vnpayTransactionId: transactionNo,
        } as any,
      });
    } else {
      // Failed or Cancelled
      await (prisma.order as any).update({
        where: { id: order.id },
        data: {
          status: "FAILED" as any,
          vnpayTransactionId: transactionNo,
        } as any,
      });
    }

    // 6. Return Success to VNPay
    return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });

  } catch (error) {
    console.error("VNPay IPN Error:", error);
    return NextResponse.json({ RspCode: "99", Message: "Unknown Error" });
  }
}
