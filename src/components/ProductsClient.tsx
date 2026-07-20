'use client';

import { Products } from '@/components/Products';
import { useAppContext } from '@/context/AppContext';

export function ProductsClient({ products }: { products: any[] }) {
  const { lang, theme, openQuoteModal } = useAppContext();
  return <Products lang={lang} theme={theme} openQuoteModal={openQuoteModal} dbProducts={products} />;
}
