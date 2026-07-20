'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { Star, ArrowLeft, ArrowRight, Quote } from 'lucide-react';

interface ReviewsProps {
  lang: string;
  dbReviews: any[];
}

export const Reviews: React.FC<ReviewsProps> = ({ lang, dbReviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? dbReviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === dbReviews.length - 1 ? 0 : prev + 1));
  };

  if (!dbReviews || dbReviews.length === 0) return null;

  return (
    <section className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#1E1E1E] dark:text-neutral-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'Verified Feedback' : 'صارفین کی آراء'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'Loved by Pakistani Riders' : 'صارفین کا اعتماد'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        {/* Carousel Container */}
        <div className="relative bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 p-8 sm:p-12 rounded-3xl shadow-sm">
          {/* Decorative quote icon */}
          <div className="absolute top-6 left-6 text-red-500/10 pointer-events-none">
            <Quote size={80} className="fill-current" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 space-y-6"
            >
              {/* Star rating */}
              <div className="flex gap-1">
                {[...Array(dbReviews[currentIndex].rating || 5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-500 text-amber-500" />
                ))}
              </div>

              {/* Comment text */}
              <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 font-light leading-relaxed italic">
                "{dbReviews[currentIndex].content}"
              </p>

              {/* User Bio */}
              <div className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                {dbReviews[currentIndex].image && (
                  <img
                    src={dbReviews[currentIndex].image}
                    alt={dbReviews[currentIndex].author}
                    className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <h4 className="font-bold text-sm text-neutral-950 dark:text-white">{dbReviews[currentIndex].author}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{dbReviews[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <div className="absolute bottom-6 right-6 flex gap-2 z-20">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full border border-neutral-250 dark:border-neutral-700 hover:bg-[#D72626] hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full border border-neutral-250 dark:border-neutral-700 hover:bg-[#D72626] hover:text-white transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
