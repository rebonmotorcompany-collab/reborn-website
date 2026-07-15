'use client';

import { Technology } from '@/components/Technology';
import { useAppContext } from '@/context/AppContext';

export default function TechnologyPage() {
  const { lang } = useAppContext();

  return <Technology lang={lang} />;
}
