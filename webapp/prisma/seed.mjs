import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  // Ensure 12 display records exist
  for (let i = 1; i <= 12; i++) {
    await prisma.display.upsert({
      where: { id: i },
      update: {},
      create: { id: i },
    });
  }
  console.log('Seeded 12 display slots.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


