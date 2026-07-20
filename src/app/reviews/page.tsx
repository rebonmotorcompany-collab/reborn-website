import { ReviewsClient } from '@/components/ReviewsClient';
import { prisma } from '@/lib/db';

export default async function ReviewsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return <ReviewsClient testimonials={testimonials} />;
}
