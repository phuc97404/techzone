import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.findFirst();
    console.log("User ID:", user?.id);
  } catch (e: any) {
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main();
