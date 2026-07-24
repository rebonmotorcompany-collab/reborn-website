'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Rocket, Heart, Cpu, ShieldCheck, Factory, Award, Star, Zap, Globe, Users, Clock } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

// ─── Icon map for dynamic icon rendering ──────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Eye, Rocket, Heart, Cpu, ShieldCheck, Factory, Award, Star, Zap, Globe, Users, Clock,
};

function DynIcon({ name, size = 20 }: { name?: string; size?: number }) {
  if (!name) return null;
  const Icon = ICON_MAP[name];
  if (!Icon) return <span className="text-xs text-neutral-400">{name}</span>;
  return <Icon size={size} />;
}

// ─── Fallback static data (shown when DB has no data yet) ─────────────────────
const FALLBACK_TIMELINE = [
  { year: '2011', title: 'Founding & Precision Parts',      description: 'Rebon Motor Company started as a high-precision automotive engineering component supplier in Lahore, Pakistan.' },
  { year: '2015', title: 'Entry into Motorcycle Manufacturing', description: 'Launched first petrol commuter bikes, expanding rapidly to 30 dealership points.' },
  { year: '2019', title: 'The Green Energy Initiative',     description: 'Inaugurated our EV R&D Lab, investing over $5M in indigenizing electric drivetrain and battery cell tech.' },
  { year: '2023', title: 'Robotic Mega-Factory Open',       description: 'Completed construction of our high-tech robotic assembly plant in Lahore.' },
  { year: '2025', title: 'National EV Leadership',          description: 'Launched the landmark E-Volt Series, becoming Pakistan\'s premier electric motorcycle brand.' },
  { year: '2026', title: 'Smart IoT Ecosystem Integration', description: 'Deployed advanced IoT systems with proprietary mobile app support, crossing 10,000+ happy riders.' },
];

const FALLBACK_WHY_US = [
  { icon: 'Factory',     title: 'Manufacturing Excellence', description: 'State-of-the-art Japanese CNC machining and robotic welding technologies meeting ISO 9001 standards.' },
  { icon: 'Cpu',         title: 'Indigenization & Tech',    description: 'Pioneering regional R&D to code local firmware, design battery casings, and build IoT units.' },
  { icon: 'ShieldCheck', title: 'Uncompromising Quality',   description: 'Every chassis and battery undergoes 24 unique load tests on our computer-controlled dyno track.' },
];

const FALLBACK_STATS = [
  { title: 'Years Experience',  number: '13+',    icon: 'Clock'  },
  { title: 'Happy Customers',   number: '10,000+', icon: 'Heart'  },
  { title: 'Dealers',           number: '150+',   icon: 'Globe'  },
  { title: 'Products',          number: '20+',    icon: 'Zap'    },
];

interface AboutProps {
  lang: string;
  theme: 'light' | 'dark';
}

export const About: React.FC<AboutProps> = ({ lang, theme }) => {
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);
  const { settings = {} } = useAppContext();

  // ── Dynamic data from DB ────────────────────────────────────────────────────
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/about')
      .then(r => r.json())
      .then(json => { if (json.success) setSections(json.data) })
      .catch(() => {}) // Silently fall back to static defaults
      .finally(() => setLoading(false));
  }, []);

  // ── Resolved values (DB → fallback) ────────────────────────────────────────
  const hero    = sections.hero    || {};
  const mission = sections.mission || {};
  const vision  = sections.vision  || {};
  const story   = sections.story   || {};
  const whyUs   = (sections.why_us?.items   || FALLBACK_WHY_US).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  const stats   = sections.stats?.items || FALLBACK_STATS;
  const timeline = story.timeline?.length ? story.timeline : FALLBACK_TIMELINE;

  // Reset index when timeline changes
  useEffect(() => {
    setSelectedYearIndex(timeline.length - 1);
  }, [timeline.length]);

  return (
    <section id="about" className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#1E1E1E] dark:text-neutral-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2">
            {story.title || (lang === 'en' ? 'Our Story' : lang === 'ur' ? 'ہماری کہانی' : '品牌故事')}
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {hero.title || settings?.company_tagline || 'Engineering Beyond Boundaries'}
          </motion.h2>
          {hero.subtitle && (
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
              className="mt-4 text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {hero.subtitle}
            </motion.p>
          )}
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        {/* ── Stats Bar ── */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 group hover:border-red-500/30 transition-all">
                <div className="text-[#D72626] mx-auto mb-2 flex justify-center group-hover:scale-110 transition-transform">
                  <DynIcon name={stat.icon} size={24} />
                </div>
                <div className="text-3xl font-black font-display text-neutral-900 dark:text-white">{stat.number}</div>
                <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-medium">{stat.title}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Mission & Vision ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-red-500/10 text-[#D72626]">
                {mission.icon ? <DynIcon name={mission.icon} size={22} /> : <Rocket size={22} />}
              </div>
              <h3 className="text-lg font-black font-display uppercase tracking-wider">
                {mission.title || (lang === 'en' ? 'Our Mission' : lang === 'ur' ? 'ہمارا مشن' : '企业使命')}
              </h3>
            </div>
            <p className="text-sm text-neutral-650 dark:text-neutral-400 leading-relaxed font-light">
              {mission.description || settings?.company_description || 'To accelerate Pakistan\'s transition to sustainable clean energy by producing premium electric vehicles.'}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-red-500/10 text-[#D72626]">
                {vision.icon ? <DynIcon name={vision.icon} size={22} /> : <Eye size={22} />}
              </div>
              <h3 className="text-lg font-black font-display uppercase tracking-wider">
                {vision.title || (lang === 'en' ? 'Our Vision' : lang === 'ur' ? 'ہمارا وژن' : '企业愿景')}
              </h3>
            </div>
            <p className="text-sm text-neutral-650 dark:text-neutral-400 leading-relaxed font-light">
              {vision.description || 'To become the gold standard of automotive innovation in South Asia.'}
            </p>
          </motion.div>
        </div>

        {/* ── Interactive Timeline ── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-lg font-black text-neutral-400 uppercase tracking-widest">
              {story.title || 'Interactive Company History'}
            </h3>
            {story.description && (
              <p className="text-sm text-neutral-500 mt-2 max-w-xl mx-auto">{story.description}</p>
            )}
            {!story.description && (
              <p className="text-xs text-neutral-500 mt-1">Select any milestone year to reveal engineering breakthroughs</p>
            )}
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-4 md:gap-0">
            <div className="absolute left-1/2 md:left-0 top-0 md:top-1/2 w-0.5 md:w-full h-full md:h-0.5 bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 z-0" />
            {timeline.map((item: any, index: number) => {
              const isSelected = selectedYearIndex === index;
              return (
                <button key={item.year} onClick={() => setSelectedYearIndex(index)}
                  className="relative z-10 flex flex-col items-center group focus:outline-none">
                  <motion.div
                    animate={{
                      scale: isSelected ? 1.3 : 1,
                      backgroundColor: isSelected ? '#D72626' : theme === 'dark' ? '#111111' : '#FFFFFF',
                      borderColor: isSelected ? '#D72626' : theme === 'dark' ? '#3A3A3A' : '#D1D5DB'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-display font-bold text-sm select-none">
                    <span className={isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-[#D72626]'}>
                      {String(item.year).substring(2)}
                    </span>
                  </motion.div>
                  <span className={`text-xs font-bold mt-2 font-display ${isSelected ? 'text-[#D72626]' : 'text-neutral-500'}`}>
                    {item.year}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 max-w-3xl mx-auto min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.div key={selectedYearIndex}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 text-center relative shadow-sm">
                <span className="text-5xl font-black font-display text-red-500/10 absolute top-2 left-6">
                  {timeline[selectedYearIndex]?.year}
                </span>
                <h4 className="text-xl font-bold font-display text-neutral-900 dark:text-white mt-4">
                  {timeline[selectedYearIndex]?.title}
                </h4>
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mt-3 font-light leading-relaxed">
                  {timeline[selectedYearIndex]?.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Why Choose Us ── */}
        {whyUs.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h3 className="text-lg font-black text-neutral-400 uppercase tracking-widest">Our Corporate Values</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyUs.map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 text-center hover:border-red-500/30 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#D72626] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <DynIcon name={item.icon} size={20} />
                  </div>
                  <h4 className="text-xs font-black font-display mb-2 uppercase tracking-wider text-neutral-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-neutral-550 dark:text-neutral-400 leading-relaxed font-light">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Gallery ── */}
        {sections.gallery?.images?.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <h3 className="text-lg font-black text-neutral-400 uppercase tracking-widest">Gallery</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sections.gallery.images.map((url: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="aspect-square rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/80 group">
                  <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
