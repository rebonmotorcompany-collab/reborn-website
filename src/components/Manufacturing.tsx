'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Factory, Cpu, ShieldCheck, Microscope, Layers, Truck } from 'lucide-react';

interface ManufacturingProps {
  lang: string;
}

export const Manufacturing: React.FC<ManufacturingProps> = ({ lang }) => {
  return (
    <section id="manufacturing" className="py-24 bg-[#FFFFFF] dark:bg-neutral-950 text-[#1E1E1E] dark:text-neutral-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'Industrial Precision' : lang === 'ur' ? 'صنعتی مہارت' : '工业精密'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'Manufacturing Excellence' : lang === 'ur' ? 'پیداواری برتری' : '卓越制造'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        {/* Big Showcase Row 1: Robotic Assembly Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-transparent opacity-10 rounded-3xl group-hover:opacity-20 transition-opacity duration-500" />
            <img
              src="/src/assets/images/rmc_factory_assembly_1783492649614.jpg"
              alt="RMC Robotic assembly plant and welding automation"
              className="w-full h-auto rounded-3xl object-cover shadow-xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-[#D72626] text-[10px] font-black uppercase tracking-wider">
              <Factory size={12} />
              <span>ROBOTIC MEGA-FACTORY — LAHORE</span>
            </div>
            <h3 className="text-2xl font-black font-display text-neutral-900 dark:text-white uppercase">
              Fully Automated Assembly Lines
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Our state-of-the-art facility features computer-controlled robotic welding, precision CNC machining, and electro-static painting modules. By minimizing manual interventions in critical structural processes, we guarantee sub-millimeter tolerances on our chassis layouts.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <span className="block text-2xl font-bold font-display text-neutral-900 dark:text-white">99.8%</span>
                <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Welding Precision Score</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-display text-neutral-900 dark:text-white">ISO 9001</span>
                <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Safety & Quality Certified</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Big Showcase Row 2: Research & Battery Labs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-row-reverse mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 space-y-6 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-[#D72626] text-[10px] font-black uppercase tracking-wider">
              <Microscope size={12} />
              <span>ADVANCED R&D LABS — CELL LAB</span>
            </div>
            <h3 className="text-2xl font-black font-display text-neutral-900 dark:text-white uppercase">
              Battery Technology & R&D Center
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              We design and simulate power configurations inside our dedicated battery laboratory. Every thermal casing is engineered to withstand temperatures up to 55°C, ensuring optimal performance on Pakistani highways, supported by intelligent local Battery Management System (BMS) software.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <span className="block text-2xl font-bold font-display text-neutral-900 dark:text-white">24+ Tests</span>
                <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Thermal & Impact Safety</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-display text-neutral-900 dark:text-white">3 Years</span>
                <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Localized Field Research</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 relative group lg:order-2"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-transparent opacity-10 rounded-3xl group-hover:opacity-20 transition-opacity duration-500" />
            <img
              src="/src/assets/images/rmc_battery_tech_1783492666766.jpg"
              alt="Advanced Battery testing laboratory"
              className="w-full h-auto rounded-3xl object-cover shadow-xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Industrial Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 border-t border-neutral-150 dark:border-neutral-800">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-red-500/10 text-[#D72626] rounded-xl">
              <Cpu size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase">Smart Dyno Testing</h4>
              <p className="text-xs text-neutral-400 mt-1 font-light">Every engine/motor is dynamically load tested across 3 different gear curves.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-red-500/10 text-[#D72626] rounded-xl">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase">Ultrasonic Scan</h4>
              <p className="text-xs text-neutral-400 mt-1 font-light">Chassis weld joints undergo ultrasonic scanners to detect inner micro-fractures.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-red-500/10 text-[#D72626] rounded-xl">
              <Layers size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase">Quality Check Gates</h4>
              <p className="text-xs text-neutral-400 mt-1 font-light">Six separate check gates to verify aesthetics, wiring harnesses, and fluid levels.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-red-500/10 text-[#D72626] rounded-xl">
              <Truck size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase">Integrated Supply Chain</h4>
              <p className="text-xs text-neutral-400 mt-1 font-light">Locally sourced alloys combined with Japanese electronics to ensure cheap, resilient assemblies.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
