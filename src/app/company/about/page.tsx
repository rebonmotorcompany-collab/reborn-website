'use client';

import { About } from '@/components/About';
import { useAppContext } from '@/context/AppContext';

export default function CompanyAboutPage() {
  const { lang, theme } = useAppContext();

  return <About lang={lang} theme={theme} />;
}
