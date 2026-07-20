'use client';
import { FAQ } from '@/components/FAQ';
import { useAppContext } from '@/context/AppContext';

export function FAQClient({ faqs }: { faqs: any[] }) {
  const { lang } = useAppContext();
  return <FAQ lang={lang} dbFaqs={faqs} />;
}
