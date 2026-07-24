import { HomeClient } from '@/components/HomeClient';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let products: any[] = [];
  try {
    const rawProducts = await prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' }
    });
    
    products = rawProducts.map(p => ({
      ...p,
      price: p.price ? p.price.toString() : null
    }));
  } catch (error) {
    console.error('Failed to fetch home page products:', error);
  }

  return <HomeClient products={products} />;
}
