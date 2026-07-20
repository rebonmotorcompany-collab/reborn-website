'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Rocket, Heart, Cpu, ShieldCheck, Factory, Award } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const timelineItems = [
  {
    year: '2011',
    title: 'Founding & Precision Parts',
    description: 'Rebon Motor Company (RMC) started as a high-precision automotive engineering component supplier in Lahore, Pakistan.'
  },
  {
    year: '2015',
    title: 'Entry into Motorcycle Manufacturing',
    description: 'Successfully built and launched our first line of highly durable petrol commuter bikes, expanding rapidly to 30 dealership points.'
  },
  {
    year: '2019',
    title: 'The Green Energy Initiative',
    description: 'Inaugurated our dedicated EV Research and Development Lab, investing over $5M in indigenizing electric drivetrain and battery cell tech.'
  },
  {
    year: '2023',
    title: 'Robotic Mega-Factory Open',
    description: 'Completed construction of a high-tech robotic assembly plant in Lahore with state-of-the-art testing tracks and strict quality check cells.'
  },
  {
    year: '2025',
    title: 'National EV Leadership',
    description: 'Launched the landmark E-Volt Series, becoming Pakistans premier brand in high-performance premium electric and smart motorcycles.'
  },
  {
    year: '2026',
    title: 'Smart IoT Ecosystem Integration',
    description: 'Deployed advanced IoT systems with proprietary mobile app support and GPS safety tracking, crossing 10,000+ happy riders.'
  }
];

interface AboutProps {
  lang: string;
  theme: 'light' | 'dark';
}

export const About: React.FC<AboutProps> = ({ lang, theme }) => {
  const [selectedYearIndex, setSelectedYearIndex] = useState(timelineItems.length - 1);
  const { settings = {} } = useAppContext();

  return (
    <section id="about" className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#1E1E1E] dark:text-neutral-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2"
          >
            {lang === 'en' ? 'Our Story' : lang === 'ur' ? 'ہماری کہانی' : '品牌故事'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase"
          >
            {settings?.company_tagline || (lang === 'en' ? 'Engineering Beyond Boundaries' : lang === 'ur' ? 'سرحدوں سے آگے انجینئرنگ' : '超越边界的工程技术')}
          </motion.h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        {/* Core Pillars: Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-red-500/10 text-[#D72626]">
                <Rocket size={22} />
              </div>
              <h3 className="text-lg font-black font-display uppercase tracking-wider">
                {lang === 'en' ? 'Our Mission' : lang === 'ur' ? 'ہمارا مشن' : '企业使命'}
              </h3>
            </div>
            <p className="text-sm text-neutral-650 dark:text-neutral-400 leading-relaxed font-light">
              {settings?.company_description || (lang === 'en' 
                ? 'To accelerate Pakistans transition to sustainable clean energy by producing premium, reliable, highly performant electric vehicles while continuing to deliver fuel-efficient mechanical precision for everyday riders.'
                : lang === 'ur'
                ? 'روزمرہ سواروں کے لیے ایندھن کے لحاظ سے کارآمد مکینیکل پریسجن فراہم کرتے ہوئے پریمیم, قابل اعتماد, انتہائی کارآمد الیکٹرک گاڑیاں بنا کر پاکستان کی پائیدار صاف توانائی کی طرف منتقلی کو تیز کرنا۔'
                : '通过生产优质、可靠、高性能的电动汽车，同时继续为日常骑手提供省油的机械精度，加速巴基斯坦向可持续清洁能源的转型。')}
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-red-500/10 text-[#D72626]">
                <Eye size={22} />
              </div>
              <h3 className="text-lg font-black font-display uppercase tracking-wider">
                {lang === 'en' ? 'Our Vision' : lang === 'ur' ? 'ہمارا وژن' : '企业愿景'}
              </h3>
            </div>
            <p className="text-sm text-neutral-650 dark:text-neutral-400 leading-relaxed font-light">
              {lang === 'en'
                ? 'To become the gold standard of automotive innovation in South Asia, building globally competitive smart motor technologies designed indigenously in Pakistan to lead the global eco-mobility revolution.'
                : lang === 'ur'
                ? 'جنوبی ایشیا میں آٹوموٹیو جدت کا سونے کا معیار بننا، عالمی ماحول دوست نقل و حمل کے انقلاب کی قیادت کرنے کے لیے پاکستان میں مقامی طور پر تیار کردہ عالمی سطح پر مسابقتی اسمارٹ موٹر ٹیکنالوجی بنانا۔'
                : '成为南亚汽车创新的金牌标准，打造在巴基斯坦本土设计、具有全球竞争力的智能电动技术，引领全球生态出行革命。'}
            </p>
          </motion.div>
        </div>

        {/* Interactive Corporate History Timeline */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-lg font-black text-neutral-400 uppercase tracking-widest">Interactive Company History</h3>
            <p className="text-xs text-neutral-500 mt-1">Select any milestone year to reveal engineering breakthroughs</p>
          </div>

          {/* Timeline Bar */}
          <div className="relative flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-4 md:gap-0">
            {/* Background line running behind the points */}
            <div className="absolute left-1/2 md:left-0 top-0 md:top-1/2 w-0.5 md:w-full h-full md:h-0.5 bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 z-0" />
            
            {timelineItems.map((item, index) => {
              const isSelected = selectedYearIndex === index;
              return (
                <button
                  key={item.year}
                  onClick={() => setSelectedYearIndex(index)}
                  className="relative z-10 flex flex-col items-center group focus:outline-none"
                >
                  {/* Indicator circle */}
                  <motion.div
                    animate={{
                      scale: isSelected ? 1.3 : 1,
                      backgroundColor: isSelected ? '#D72626' : theme === 'dark' ? '#111111' : '#FFFFFF',
                      borderColor: isSelected ? '#D72626' : theme === 'dark' ? '#3A3A3A' : '#D1D5DB'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-display font-bold text-sm select-none"
                  >
                    <span className={isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-[#D72626]'}>
                      {item.year.substring(2)}
                    </span>
                  </motion.div>
                  <span className={`text-xs font-bold mt-2 font-display ${isSelected ? 'text-[#D72626]' : 'text-neutral-500'}`}>
                    {item.year}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Timeline Description Panel */}
          <div className="mt-8 max-w-3xl mx-auto min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYearIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 text-center relative shadow-sm"
              >
                <span className="text-5xl font-black font-display text-red-500/10 absolute top-2 left-6">
                  {timelineItems[selectedYearIndex].year}
                </span>
                <h4 className="text-xl font-bold font-display text-neutral-900 dark:text-white mt-4">
                  {timelineItems[selectedYearIndex].title}
                </h4>
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mt-3 font-light leading-relaxed">
                  {timelineItems[selectedYearIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Corporate Core Values */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-lg font-black text-neutral-400 uppercase tracking-widest">Our Corporate Values</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 text-center hover:border-red-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#D72626] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Factory size={20} />
              </div>
              <h4 className="text-xs font-black font-display mb-2 uppercase tracking-wider text-neutral-900 dark:text-white">Manufacturing Excellence</h4>
              <p className="text-xs text-neutral-550 dark:text-neutral-400 leading-relaxed font-light">
                Utilizing state-of-the-art Japanese CNC machining and robotic welding technologies to meet and exceed ISO 9001 global manufacturing standards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 text-center hover:border-red-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#D72626] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Cpu size={20} />
              </div>
              <h4 className="text-xs font-black font-display mb-2 uppercase tracking-wider text-neutral-900 dark:text-white">Indigenization & Tech</h4>
              <p className="text-xs text-neutral-550 dark:text-neutral-400 leading-relaxed font-light">
                Pioneering regional R&D to code local firmware, design custom thermal battery casings, and build IoT units for Pakistans unique conditions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 text-center hover:border-red-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#D72626] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-xs font-black font-display mb-2 uppercase tracking-wider text-neutral-900 dark:text-white">Uncompromising Quality</h4>
              <p className="text-xs text-neutral-550 dark:text-neutral-400 leading-relaxed font-light">
                Every chassis and battery undergoes 24 unique load tests on our computer-controlled dyno track before receiving factory certification.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
