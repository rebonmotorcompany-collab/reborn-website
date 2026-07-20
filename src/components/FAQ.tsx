'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQProps {
  lang: string;
  dbFaqs: any[];
}

export const FAQ: React.FC<FAQProps> = ({ lang, dbFaqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first item

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#1E1E1E] dark:text-neutral-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'Support Center' : 'عام سوالات'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'Frequently Asked Questions' : 'اکثر پوچھے گئے سوالات'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        {/* Collapsible Accordion Group */}
        <div className="space-y-4">
          {dbFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-[#F5F5F5] dark:bg-[#111111] overflow-hidden transition-all duration-300"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                >
                  <div className="flex gap-4 items-center pr-4">
                    <HelpCircle size={18} className="text-[#D72626] flex-shrink-0" />
                    <span className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                {/* Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed border-t border-neutral-150 dark:border-neutral-800/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
