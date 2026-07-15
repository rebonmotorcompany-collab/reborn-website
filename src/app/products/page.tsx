'use client';

import { Products } from '@/components/Products';
import { useAppContext } from '@/context/AppContext';

export default function ProductsPage() {
  const { lang, theme, openQuoteModal } = useAppContext();

  return <Products lang={lang} theme={theme} openQuoteModal={openQuoteModal} />;
}
