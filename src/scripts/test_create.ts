import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("🧪 Testing Prisma order creation...");
    const order = await (prisma.order as any).create({
      data: {
        userId: 'cmmg1e6cc00016nzitx4wutq7', 
        total: 1000,
        status: 'PENDING',
        paymentMethod: 'vnpay',
        shippingName: 'Test',
        shippingPhone: '000',
        shippingAddress: 'Test',
      }
    });
    console.log("✅ Success:", order.id);
  } catch (e: any) {
    console.error("❌ Error type:", e.constructor.name);
    console.error("❌ Error message:", e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
