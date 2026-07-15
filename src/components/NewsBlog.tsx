'use client';
import React from 'react';
import { motion } from 'motion/react';
import { newsArticles } from '../data';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

interface NewsBlogProps {
  lang: string;
}

export const NewsBlog: React.FC<NewsBlogProps> = ({ lang }) => {
  return (
    <section id="news" className="py-24 bg-[#F5F5F5] dark:bg-[#0E0E0E] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'News & Media' : 'خبریں اور بلاگ'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'Latest Publications' : 'تازہ ترین اپ ڈیٹس'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white dark:bg-[#141414] rounded-3xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm hover:border-[#D72626]/40 dark:hover:border-[#D72626]/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                {/* Category tag */}
                <span className="absolute top-4 left-4 bg-[#D72626] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {article.category}
                </span>
              </div>

              {/* Text content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-bold mb-3 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> RMC Official
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white group-hover:text-[#D72626] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mt-2.5 line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
                  <span className="text-xs font-black text-[#D72626] uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                    <span>Read Full Story</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};
