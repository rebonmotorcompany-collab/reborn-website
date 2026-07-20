'use client';
import { Reviews } from '@/components/Reviews';
import { useAppContext } from '@/context/AppContext';

export function ReviewsClient({ testimonials }: { testimonials: any[] }) {
  const { lang } = useAppContext();
  return <Reviews lang={lang} dbReviews={testimonials} />;
}
