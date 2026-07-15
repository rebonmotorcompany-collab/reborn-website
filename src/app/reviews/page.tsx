'use client';

import { Reviews } from '@/components/Reviews';
import { useAppContext } from '@/context/AppContext';

export default function ReviewsPage() {
  const { lang } = useAppContext();

  return <Reviews lang={lang} />;
}
