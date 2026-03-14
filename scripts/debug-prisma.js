const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Keys in prisma client:');
  console.log(Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')).sort().join(', '));
  await prisma.$disconnect();
}

main().catch(console.error);
