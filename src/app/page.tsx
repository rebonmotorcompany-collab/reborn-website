import { HomeClient } from '@/components/HomeClient';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const rawProducts = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { sortOrder: 'asc' }
  });
  
  const products = rawProducts.map(p => ({
    ...p,
    price: p.price ? p.price.toString() : null
  }));

  return <HomeClient products={products} />;
}
