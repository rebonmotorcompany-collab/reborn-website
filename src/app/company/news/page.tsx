import { NewsBlogClient } from '@/components/NewsBlogClient';
import { prisma } from '@/lib/db';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Company News & Blog | Rebon Motor Company',
  description: 'Stay updated with the latest press releases, innovations, and corporate news from Rebon Motor Company.',
};

export default async function CompanyNewsPage() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' }
  });

  return <NewsBlogClient posts={posts} />;
}
