'use client';

import { Manufacturing } from '@/components/Manufacturing';
import { useAppContext } from '@/context/AppContext';

export default function ManufacturingPage() {
  const { lang } = useAppContext();

  return <Manufacturing lang={lang} />;
}
