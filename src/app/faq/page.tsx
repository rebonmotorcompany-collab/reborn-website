'use client';

import { FAQ } from '@/components/FAQ';
import { useAppContext } from '@/context/AppContext';

export default function FAQPage() {
  const { lang } = useAppContext();

  return <FAQ lang={lang} />;
}
