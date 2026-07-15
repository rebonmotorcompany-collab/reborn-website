'use client';

import { NewsBlog } from '@/components/NewsBlog';
import { useAppContext } from '@/context/AppContext';

export default function NewsBlogPage() {
  const { lang } = useAppContext();

  return <NewsBlog lang={lang} />;
}
