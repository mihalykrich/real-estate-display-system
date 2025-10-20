import { PrismaClient } from '../src/generated/prisma/index.js';

const url = process.env.DATABASE_URL || 'postgresql://realestate:realestate@localhost:5432/realestate?schema=public';
const prisma = new PrismaClient({ datasources: { db: { url } } });

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true } });
  console.log(JSON.stringify(users, null, 2));
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });


