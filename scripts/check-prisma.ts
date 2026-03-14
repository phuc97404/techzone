import { prisma } from './src/lib/prisma';

async function check() {
  console.log('Available Prisma models:');
  const keys = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
  console.log(keys.sort().join(', '));
  process.exit(0);
}

check();
