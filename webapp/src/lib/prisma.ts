import { PrismaClient } from '../generated/prisma';

// Ensure a single PrismaClient instance across hot reloads in dev
type GlobalWithPrisma = {
  prisma?: PrismaClient & { __dbUrl?: string };
};
const globalForPrisma = globalThis as unknown as GlobalWithPrisma;

const databaseUrl = process.env.DATABASE_URL || 'postgresql://realestate:realestate@localhost:5432/realestate?schema=public';
// Debug log to verify which URL is used in server process
if (process.env.NODE_ENV !== 'production') {
  console.log('[prisma] init with DATABASE_URL =', databaseUrl, ' PRISMA_DATASOURCE_URL=', process.env.PRISMA_DATASOURCE_URL);
}

function createClient(): PrismaClient & { __dbUrl?: string } {
  const client = new PrismaClient({
    log: ['error', 'warn'],
    datasources: { db: { url: databaseUrl } },
  }) as PrismaClient & { __dbUrl?: string };
  client.__dbUrl = databaseUrl;
  return client;
}

if (globalForPrisma.prisma && globalForPrisma.prisma.__dbUrl !== databaseUrl) {
  // URL changed across reloads; replace the cached client
  try { globalForPrisma.prisma.$disconnect(); } catch {}
  globalForPrisma.prisma = undefined;
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma as any;
}


