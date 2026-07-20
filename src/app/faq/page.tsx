import { FAQClient } from '@/components/FAQClient';
import { prisma } from '@/lib/db';

export default async function FAQPage() {
  const faqs = await prisma.faqItem.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return <FAQClient faqs={faqs} />;
}
