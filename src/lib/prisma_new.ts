import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Check if the current client is up to date
const isObsolete = !globalForPrisma.prisma || !(globalForPrisma.prisma as any).order?.create || !(
  // Check for new models or fields
  (globalForPrisma.prisma as any).post && 
  (globalForPrisma.prisma as any).newsCategory
);

// Extra check for the new Order fields by trying to access the shadow DMMF or just checking if it was created after a certain time
// But the most reliable way in dev is to just re-create if we are not sure
if (isObsolete && globalForPrisma.prisma) {
  console.log("♻️  RECYCLING OBSOLETE PRISMA CLIENT (missing models)...");
}

export const prisma = (globalForPrisma.prisma && !isObsolete) ? globalForPrisma.prisma : createPrismaClient();

// Test the client immediately in dev
if (process.env.NODE_ENV !== 'production') {
  const models = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
  console.log("💎 PRISMA MODELS:", models);
  if (!models.includes('order')) {
    console.error("❌ ERROR: 'order' model missing in Prisma Client!");
  }
}

console.log("💎 PRISMA MODELS AVAILABLE:", Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
