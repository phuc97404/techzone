import { NextResponse } from "next/server";
import { verifyReturnUrl } from "@/lib/vnpay";
import { prisma } from "@/lib/prisma";

/**
 * Handle VNPay Return URL (User Redirect)
 * GET /api/payment/vnpay/return
 * VNPay sẽ deeplink về URL này sau khi thanh toán
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vnp_Params = Object.fromEntries(searchParams.entries());

  try {
    const orderCode = searchParams.get("vnp_TxnRef");
    const responseCode = searchParams.get("vnp_ResponseCode");
    const transactionNo = searchParams.get("vnp_TransactionNo");

    // 1. Verify Checksum (optional skip on signature fail - still update order)
    const isValid = verifyReturnUrl({ ...vnp_Params });

    if (!isValid) {
      console.warn("⚠️ VNPay return: invalid signature for order", orderCode);
      return NextResponse.redirect(
        new URL(`/checkout/result?status=error&message=Sai+chữ+ký&orderCode=${orderCode}`, req.url)
      );
    }

    // 2. Update order status in DB based on VNPay response
    if (orderCode) {
      try {
        if (responseCode === "00") {
          // Payment success - update order to PAID
          await prisma.$executeRaw`
            UPDATE "orders" 
            SET status = 'PAID', "vnpayTransactionId" = ${transactionNo}
            WHERE "orderCode" = ${orderCode}
          `;
          console.log("✅ Order paid:", orderCode, "txn:", transactionNo);
        } else {
          // Payment failed/cancelled
          await prisma.$executeRaw`
            UPDATE "orders" 
            SET status = 'FAILED', "vnpayTransactionId" = ${transactionNo}
            WHERE "orderCode" = ${orderCode}
          `;
          console.log("❌ Order failed:", orderCode, "code:", responseCode);
        }
      } catch (dbErr) {
        console.error("DB update error on return:", dbErr);
      }
    }

    // 3. Redirect user to result page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    if (responseCode === "00") {
      return NextResponse.redirect(
        new URL(`/checkout/result?status=success&orderCode=${orderCode}`, appUrl)
      );
    } else {
      return NextResponse.redirect(
        new URL(`/checkout/result?status=failed&code=${responseCode}&orderCode=${orderCode}`, appUrl)
      );
    }
  } catch (error) {
    console.error("VNPay Return Handler Error:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      new URL(`/checkout/result?status=error&message=Internal+Server+Error`, appUrl)
    );
  }
}
