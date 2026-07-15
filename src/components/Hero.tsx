'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, ShieldCheck, Users, Milestone, Trophy, X } from 'lucide-react';

interface HeroProps {
  lang: string;
  theme: 'light' | 'dark';
  onExploreProducts: () => void;
  onBecomeDealer: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, theme, onExploreProducts, onBecomeDealer }) => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [years, setYears] = useState(0);
  const [dealers, setDealers] = useState(0);
  const [customers, setCustomers] = useState(0);

  // Counter animation
  useEffect(() => {
    const yearsInterval = setInterval(() => {
      setYears(prev => (prev < 15 ? prev + 1 : 15));
    }, 80);

    const dealersInterval = setInterval(() => {
      setDealers(prev => (prev < 100 ? prev + 4 : 100));
    }, 40);

    const customersInterval = setInterval(() => {
      setCustomers(prev => (prev < 5000 ? prev + 150 : 5000));
    }, 30);

    return () => {
      clearInterval(yearsInterval);
      clearInterval(dealersInterval);
      clearInterval(customersInterval);
    };
  }, []);

  const headline = lang === 'en' 
    ? 'Engineering the Future of Mobility' 
    : lang === 'ur' 
    ? 'نقل و حمل کے مستقبل کی انجینئرنگ' 
    : '工程化未来的出行方式';

  const subheading = lang === 'en'
    ? 'Manufacturing premium electric and petrol motorcycles with state-of-the-art innovation, quality, and reliability.'
    : lang === 'ur'
    ? 'جدید ترین جدت، معیار اور بھروسے کے ساتھ پریمیم الیکٹرک اور پٹرول موٹر سائیکلیں بنانا۔'
    : '以最先进的创新、质量和可靠性制造高端电动和汽油摩托车。';

  return (
    <section 
      id="hero" 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300 ${
        theme === 'light' ? 'hero-gradient text-neutral-900' : 'bg-[#0A0A0A] text-white'
      }`}
    >
      {/* Background Image with Theme-Aware Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/rmc_hero_motorcycle_1783492628528.jpg"
          alt="Rebon Flagship Electric Motorcycle"
          className="w-full h-full object-cover object-center scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic gradient overlay that shifts based on theme for perfect contrast */}
        <div 
          className={`absolute inset-0 z-10 transition-colors duration-300 ${
            theme === 'light' 
              ? 'bg-gradient-to-r from-white via-white/95 to-white/30 md:from-[#FFFFFF] md:via-[#FFFFFF]/90 md:to-transparent' 
              : 'bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/95 to-[#0A0A0A]/30 md:from-[#0A0A0A] md:via-[#0A0A0A]/90 md:to-transparent'
          }`} 
        />
        {/* Subtle top and bottom dark/light blend */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-32 z-10 ${
            theme === 'light' ? 'bg-gradient-to-t from-[#F5F5F5] to-transparent' : 'bg-gradient-to-t from-[#0A0A0A] to-transparent'
          }`} 
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Headline Block */}
          <div className="lg:col-span-8 text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.25em] ${
                theme === 'light'
                  ? 'bg-red-500/5 border-red-500/20 text-[#D72626]'
                  : 'bg-red-500/10 border-red-500/30 text-[#D72626]'
              }`}
            >
              <Milestone size={13} />
              <span>REBON MOTOR COMPANY — RMC</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-none uppercase ${
                theme === 'light' ? 'text-[#1E1E1E]' : 'text-white'
              }`}
            >
              {headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`text-sm md:text-base max-w-2xl font-light leading-relaxed ${
                theme === 'light' ? 'text-neutral-600' : 'text-neutral-300'
              }`}
            >
              {subheading}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button
                onClick={onExploreProducts}
                className="red-pill flex items-center gap-2"
              >
                <span>{lang === 'en' ? 'Explore Products' : lang === 'ur' ? 'پروڈکٹس دیکھیں' : '探索产品'}</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={onBecomeDealer}
                className="outline-pill"
              >
                <span>{lang === 'en' ? 'Become a Dealer' : lang === 'ur' ? 'ڈیلر بنیں' : '加盟经销商'}</span>
              </button>

              <button
                onClick={() => setVideoOpen(true)}
                className={`flex items-center gap-2.5 px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors group ${
                  theme === 'light' ? 'text-neutral-700 hover:text-black' : 'text-neutral-300 hover:text-white'
                }`}
              >
                <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                  theme === 'light' 
                    ? 'border-neutral-300 group-hover:border-black group-hover:bg-neutral-100' 
                    : 'border-neutral-700 group-hover:border-white group-hover:bg-white/10'
                }`}>
                  <Play size={13} className={`fill-current translate-x-0.5 ${theme === 'light' ? 'text-neutral-800' : 'text-white'}`} />
                </div>
                <span>{lang === 'en' ? 'Watch Video' : lang === 'ur' ? 'ویڈیو دیکھیں' : '观看视频'}</span>
              </button>
            </motion.div>
          </div>

          {/* Stats Badges floating on desktop right side */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`p-5 rounded-2xl border flex items-center gap-4 hover:border-red-500/30 transition-all group stat-card ${
                theme === 'light'
                  ? 'bg-white/90 border-neutral-200/80 shadow-sm'
                  : 'bg-neutral-900/65 backdrop-blur-md border-neutral-800/80'
              }`}
            >
              <div className="p-3 rounded-xl bg-red-500/10 text-[#D72626] group-hover:scale-110 transition-transform">
                <Trophy size={20} />
              </div>
              <div>
                <h3 className={`text-2xl font-black ${theme === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>{years}+</h3>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Years Manufacturing Experience</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`p-5 rounded-2xl border flex items-center gap-4 hover:border-red-500/30 transition-all group stat-card ${
                theme === 'light'
                  ? 'bg-white/90 border-neutral-200/80 shadow-sm'
                  : 'bg-neutral-900/65 backdrop-blur-md border-neutral-800/80'
              }`}
            >
              <div className="p-3 rounded-xl bg-red-500/10 text-[#D72626] group-hover:scale-110 transition-transform">
                <Milestone size={20} />
              </div>
              <div>
                <h3 className={`text-2xl font-black ${theme === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>{dealers}+</h3>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Authorized Showrooms</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={`p-5 rounded-2xl border flex items-center gap-4 hover:border-red-500/30 transition-all group stat-card ${
                theme === 'light'
                  ? 'bg-white/90 border-neutral-200/80 shadow-sm'
                  : 'bg-neutral-900/65 backdrop-blur-md border-neutral-800/80'
              }`}
            >
              <div className="p-3 rounded-xl bg-red-500/10 text-[#D72626] group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <div>
                <h3 className={`text-2xl font-black ${theme === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>{customers.toLocaleString()}+</h3>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'}`}>Satisfied Riders Nationwide</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-neutral-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 relative aspect-video"
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>

              {/* High-quality corporate video simulation */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/S2pX2bB951U?autoplay=1&mute=1&controls=1"
                title="Rebon Motor Company Corporate Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
