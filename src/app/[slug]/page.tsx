import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import React from 'react';

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await prisma.contentPage.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!page || !page.isPublished) {
    return {
      title: 'Page Not Found | Rebon Motor Company',
    };
  }

  return {
    title: `${page.title} | Rebon Motor Company`,
    description: page.description || `Read about ${page.title} at Rebon Motor Company.`,
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const resolvedParams = await params;
  const page = await prisma.contentPage.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <main className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#1E1E1E] dark:text-neutral-100 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-black font-display text-neutral-900 dark:text-white mb-4">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light">
              {page.description}
            </p>
          )}
        </header>

        <div className="space-y-12">
          {page.sections.length === 0 ? (
            <div className="text-neutral-500 font-light italic">This page has no content yet.</div>
          ) : (
            page.sections.map((section) => (
              <section key={section.id} className="prose prose-neutral dark:prose-invert max-w-none">
                {section.title && (
                  <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                )}
                {/* Normally we'd use a Markdown parser or just output HTML if it's rich text. 
                    Assuming it's text/html or simple string for now. */}
                <div 
                  className="text-neutral-700 dark:text-neutral-300 font-light leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
