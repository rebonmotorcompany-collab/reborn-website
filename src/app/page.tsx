'use client';

import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Products } from '@/components/Products';
import { Contact } from '@/components/Contact';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { lang, theme, openQuoteModal } = useAppContext();
  const router = useRouter();

  return (
    <>
      <Hero
        lang={lang}
        theme={theme}
        onExploreProducts={() => router.push('/products')}
        onBecomeDealer={() => router.push('/dealers')}
      />
      <About lang={lang} theme={theme} />
      <Products lang={lang} theme={theme} openQuoteModal={openQuoteModal} />
      <Contact lang={lang} />
    </>
  );
}
