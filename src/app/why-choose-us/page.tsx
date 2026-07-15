'use client';

import { WhyChooseUs } from '@/components/WhyChooseUs';
import { useAppContext } from '@/context/AppContext';

export default function WhyChooseUsPage() {
  const { lang } = useAppContext();

  return <WhyChooseUs lang={lang} />;
}
