import { NewsBlogClient } from '@/components/NewsBlogClient';
import { prisma } from '@/lib/db';

export default async function NewsPage() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' }
  });

  return <NewsBlogClient posts={posts} />;
}
