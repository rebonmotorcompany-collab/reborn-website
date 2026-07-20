'use client';
import { NewsBlog } from '@/components/NewsBlog';
import { useAppContext } from '@/context/AppContext';

export function NewsBlogClient({ posts }: { posts: any[] }) {
  const { lang } = useAppContext();
  return <NewsBlog lang={lang} dbPosts={posts} />;
}
