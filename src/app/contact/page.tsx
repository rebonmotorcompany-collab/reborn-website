'use client';

import { Contact } from '@/components/Contact';
import { useAppContext } from '@/context/AppContext';

export default function ContactPage() {
  const { lang } = useAppContext();

  return <Contact lang={lang} />;
}
