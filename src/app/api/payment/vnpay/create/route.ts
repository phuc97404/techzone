import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { auth } from "@/lib/auth";
import { createPaymentUrl } from "@/lib/vnpay";

/**
 * Handle VNPay Payment Creation
 * POST /api/payment/vnpay/create
 * Updated: 2026-03-14 17:25 (Aggressive Refresh)
 */
export async function POST(req: Request) {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để thanh toán." }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingName, shippingPhone, shippingAddress, note, promoCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }

    // 1. Database Warm-up (Wakes up Neon if it's sleeping)
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("⚡ Database is awake");
    } catch (e) {
      console.warn("⚠️ Database warm-up failed, proceeding anyway:", e);
    }

    // 2. Calculations (Outside transaction)
    let totalAmount = 0;
    let discountAmount = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
      const price = product.salePrice ?? product.price;
      totalAmount += price * item.quantity;
    }

    if (promoCode) {
      const promo = await prisma.promotion.findFirst({
         where: { code: promoCode, active: true }
      });
      if (promo) {
        discountAmount = promo.discountType === "PERCENTAGE" 
          ? (totalAmount * promo.discountValue) / 100 
          : promo.discountValue;
      }
    }

    const finalTotal = totalAmount - discountAmount;

    // 3. Create order record using RAW SQL to bypass STALE Prisma Client validation
    console.log("📝 Saving order to database via RAW SQL...");
    const orderId = `ord_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const orderCode = orderId.slice(-8).toUpperCase();
    const now = new Date();

    await prisma.$executeRaw`
      INSERT INTO "orders" 
      ("id", "orderCode", "total", "status", "paymentMethod", "shippingName", "shippingPhone", "shippingAddress", "note", "userId", "discountAmount", "promotionCode", "createdAt", "updatedAt")
      VALUES 
      (${orderId}, ${orderCode}, ${finalTotal}, 'PENDING', 'vnpay', ${shippingName}, ${shippingPhone}, ${shippingAddress}, ${note || ''}, ${session.user.id}, ${discountAmount}, ${promoCode || null}, ${now}, ${now})
    `;

    // 4. Create order items via RAW SQL
    for (const item of items) {
      const itemId = `item_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      await prisma.$executeRaw`
        INSERT INTO "order_items" ("id", "quantity", "price", "orderId", "productId")
        VALUES (${itemId}, ${item.quantity}, ${item.price}, ${orderId}, ${item.productId})
      `;
    }

    console.log("✅ Order saved via RAW SQL:", orderId);

    // 5. Generate VNPay URL
    const ipAddr = req.headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
    
    const paymentUrl = createPaymentUrl({
      amount: finalTotal,
      orderId: orderCode,
      orderInfo: `Thanh toan don hang ${orderCode} tai TechZone`,
      ipAddr,
    });

    return NextResponse.json({ 
      url: paymentUrl,
      orderCode: orderCode 
    });

  } catch (error: any) {
    console.error("VNPay Create API Error:", error);
    // Return friendly error
    const message = error.message.includes("transaction") 
      ? "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau vài giây."
      : error.message || "Không thể tạo liên kết thanh toán";
      
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
