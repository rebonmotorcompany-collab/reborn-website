'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Wifi, Navigation, ShieldAlert, Smartphone, Gauge, Battery } from 'lucide-react';

interface TechnologyProps {
  lang: string;
}

export const Technology: React.FC<TechnologyProps> = ({ lang }) => {
  const [activeMode, setActiveMode] = useState<'ECO' | 'CITY' | 'SPORT'>('CITY');
  const [speed, setSpeed] = useState(45);
  const [charge, setCharge] = useState(78);
  const [rangeLeft, setRangeLeft] = useState(117);

  // Simulate slight changes in speed & range on dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        let next = prev + delta;
        if (activeMode === 'ECO' && next > 45) next = 44;
        if (activeMode === 'SPORT' && next < 80) next = 82;
        if (next < 10) next = 10;
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [activeMode]);

  const handleModeChange = (mode: 'ECO' | 'CITY' | 'SPORT') => {
    setActiveMode(mode);
    if (mode === 'ECO') {
      setSpeed(35);
      setRangeLeft(142);
    } else if (mode === 'CITY') {
      setSpeed(55);
      setRangeLeft(104);
    } else {
      setSpeed(95);
      setRangeLeft(68);
    }
  };

  return (
    <section id="technology" className="py-24 bg-neutral-950 text-white relative overflow-hidden transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'Core Technology' : 'جدید ترین ٹیکنالوجی'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight uppercase">
            {lang === 'en' ? 'Propelling Smart Mobility' : 'اسمارٹ نقل و حمل کا آغاز'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* High Tech Grid Left */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex gap-4 items-start group">
              <div className="p-3 bg-red-500/10 text-[#D72626] border border-red-500/20 rounded-2xl group-hover:bg-[#D72626] group-hover:text-white transition-all duration-300">
                <Battery size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display uppercase tracking-wider">Smart Battery Technology</h3>
                <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">
                  Our custom Liquid Cooled Lithium Iron Phosphate (LFP) battery cells operate with 2.5x the lifecycle of standard NMC packs, with comprehensive thermal management to beat Peak Summer heats up to 55°C.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group">
              <div className="p-3 bg-red-500/10 text-[#D72626] border border-red-500/20 rounded-2xl group-hover:bg-[#D72626] group-hover:text-white transition-all duration-300">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display uppercase tracking-wider">PMSM Mid-Drive Motors</h3>
                <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">
                  High-efficiency Permanent Magnet Synchronous Motors (PMSM) providing instantaneous 180 Nm torque, silent belt drive mechanics, and custom energy regenerative braking to add 15% range dynamically.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group">
              <div className="p-3 bg-red-500/10 text-[#D72626] border border-red-500/20 rounded-2xl group-hover:bg-[#D72626] group-hover:text-white transition-all duration-300">
                <Smartphone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display uppercase tracking-wider">Mobile App & IoT Ready</h3>
                <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">
                  Every Rebon EV is factory fitted with an eSIM module offering real-time GPS tracking, remote lock/unlock, diagnostic error codes, and speed telemetry directly to your smartphone.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive TFT Smart Dashboard Simulator Right */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-lg p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-neutral-800 rounded-full" />
              
              {/* Outer Shell Glass frame */}
              <div className="border-4 border-neutral-800 rounded-2xl bg-[#090909] p-5 relative overflow-hidden">
                {/* Simulated Screen */}
                <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-4 text-[10px] text-neutral-500 font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                    <Wifi size={10} />
                    <span>LTE CONNECTED</span>
                  </div>
                  <div>UTC 12:45 | Karachi</div>
                  <div className="flex items-center gap-1">
                    <Navigation size={10} />
                    <span>GPS FIX</span>
                  </div>
                </div>

                {/* Main Dial Area */}
                <div className="text-center py-6">
                  <span className="text-xs text-neutral-500 font-bold tracking-widest uppercase">Speed</span>
                  <div className="flex items-baseline justify-center font-display gap-1 mt-1">
                    <span className="text-6xl font-black font-display tracking-tight text-white transition-all">{speed}</span>
                    <span className="text-xs text-neutral-500 font-bold uppercase">km/h</span>
                  </div>
                </div>

                {/* Mode Selector and Battery status */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800 text-center font-mono">
                  <div>
                    <span className="block text-[9px] text-neutral-500 uppercase font-bold">Battery</span>
                    <span className="text-sm font-bold text-emerald-500 flex items-center justify-center gap-1">
                      <Zap size={11} /> {charge}%
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-neutral-500 uppercase font-bold">Drive Mode</span>
                    <span className="text-xs font-black text-[#D72626] tracking-wider bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      {activeMode}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-neutral-500 uppercase font-bold">Range Left</span>
                    <span className="text-sm font-bold text-neutral-200">{rangeLeft} km</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Controller Button interactions */}
              <div className="mt-6 flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-500">Simulate Changing Ride Modes:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleModeChange('ECO')}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg transition-colors border ${activeMode === 'ECO' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-transparent border-neutral-700 text-neutral-400 hover:text-white'}`}
                  >
                    ECO
                  </button>
                  <button
                    onClick={() => handleModeChange('CITY')}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg transition-colors border ${activeMode === 'CITY' ? 'bg-[#D72626] border-[#D72626] text-white' : 'bg-transparent border-neutral-700 text-neutral-400 hover:text-white'}`}
                  >
                    CITY
                  </button>
                  <button
                    onClick={() => handleModeChange('SPORT')}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg transition-colors border ${activeMode === 'SPORT' ? 'bg-amber-600 border-amber-600 text-white' : 'bg-transparent border-neutral-700 text-neutral-400 hover:text-white'}`}
                  >
                    SPORT
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-neutral-500 mt-3 italic">
              Interactive simulator represents live 7-inch connected touch TFT dashboards integrated on E-Volt models.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
