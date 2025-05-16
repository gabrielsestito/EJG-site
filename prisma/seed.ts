import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Empty seed file - no data will be added
  console.log('Database reset complete - no seed data added');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 