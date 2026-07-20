import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.faqItem.findMany();
  console.log('FaqItems found:', result.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
