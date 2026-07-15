'use client';

import { DealerNetwork } from '@/components/DealerNetwork';
import { useAppContext } from '@/context/AppContext';

export default function DealerNetworkPage() {
  const { lang } = useAppContext();

  return <DealerNetwork lang={lang} />;
}
