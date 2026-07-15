'use client';

import { Services } from '@/components/Services';
import { useAppContext } from '@/context/AppContext';

export default function ServicesPage() {
  const { lang } = useAppContext();

  return <Services lang={lang} />;
}
