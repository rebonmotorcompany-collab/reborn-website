'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Shield, ShieldCheck, HeartHandshake, PhoneCall, Search, Settings, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ServicesProps {
  lang: string;
}

export const Services: React.FC<ServicesProps> = ({ lang }) => {
  const [partSearch, setPartSearch] = useState('');
  const [selectedPart, setSelectedPart] = useState<any>(null);

  const partsCatalog = [
    { name: 'Rebon Smart LFP 15A Fast Charger', code: 'RMC-CHG-72V', price: 'PKR 18,500', stock: 'In Stock', type: 'electric' },
    { name: 'Organic Carbon Front Disc Brake Pads', code: 'RMC-BRK-PAD2', price: 'PKR 1,450', stock: 'In Stock', type: 'universal' },
    { name: '7-inch Touch TFT Instrument Cluster Panel', code: 'RMC-TFT-700', price: 'PKR 24,000', stock: 'Low Stock', type: 'electric' },
    { name: 'High-Tension Silent Drive Belt (Carbon Fiber)', code: 'RMC-BLT-55D', price: 'PKR 8,200', stock: 'In Stock', type: 'electric' },
    { name: 'EFI Injector Nozzle Assembly 150cc', code: 'RMC-EFI-INJ15', price: 'PKR 4,800', stock: 'In Stock', type: 'petrol' },
    { name: 'Rear Inverted Monoshock Suspension damper', code: 'RMC-SUS-MONO', price: 'PKR 9,500', stock: 'Out of Stock', type: 'universal' },
  ];

  const filteredParts = partsCatalog.filter(p =>
    p.name.toLowerCase().includes(partSearch.toLowerCase()) ||
    p.code.toLowerCase().includes(partSearch.toLowerCase())
  );

  return (
    <section id="services" className="py-24 bg-[#F5F5F5] dark:bg-[#0E0E0E] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'After Sales Ecosystem' : 'سروسز اور خدمات'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'Support & Certified Care' : 'صارفین کی دیکھ بھال'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        {/* Services Core Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Block 1 */}
          <div className="p-6 bg-white dark:bg-[#141414] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#D72626] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wrench size={18} />
            </div>
            <h3 className="font-bold text-xs uppercase mb-2 text-neutral-900 dark:text-white tracking-wider">Scheduled Maintenance</h3>
            <p className="text-xs text-neutral-550 dark:text-neutral-400 font-light leading-relaxed">
              Book periodic tune-ups, motor coolant checks, and brake recalibrations at any of our 100+ authorized dealerships with ease.
            </p>
          </div>

          {/* Block 2 */}
          <div className="p-6 bg-white dark:bg-[#141414] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#D72626] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield size={18} />
            </div>
            <h3 className="font-bold text-xs uppercase mb-2 text-neutral-900 dark:text-white tracking-wider">Extended Warranty</h3>
            <p className="text-xs text-neutral-550 dark:text-neutral-400 font-light leading-relaxed">
              Activate your 3-year bumper-to-bumper warranty on batteries and motors online. Fully transferable when reselling your bike.
            </p>
          </div>

          {/* Block 3 */}
          <div className="p-6 bg-white dark:bg-[#141414] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#D72626] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings size={18} />
            </div>
            <h3 className="font-bold text-xs uppercase mb-2 text-neutral-900 dark:text-white tracking-wider">100% Genuine Spare Parts</h3>
            <p className="text-xs text-neutral-550 dark:text-neutral-400 font-light leading-relaxed">
              Every critical spare item is manufactured indigenously, guaranteeing low replacement costs and permanent local warehouse stocks.
            </p>
          </div>

          {/* Block 4 */}
          <div className="p-6 bg-white dark:bg-[#141414] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#D72626] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PhoneCall size={18} />
            </div>
            <h3 className="font-bold text-xs uppercase mb-2 text-neutral-900 dark:text-white tracking-wider">24/7 Roadside Assist</h3>
            <p className="text-xs text-neutral-550 dark:text-neutral-400 font-light leading-relaxed">
              Complimentary on-call flatbed towing, flat tire replacement, or emergency battery swaps anywhere across all major highways.
            </p>
          </div>
        </div>

        {/* Interactive Spare Parts Finder Widget */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-neutral-200/60 dark:border-neutral-800/80 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Explanatory text */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] font-black text-[#D72626] uppercase tracking-wider bg-red-500/10 px-2.5 py-1 rounded">
                Authorized Parts Lookup
              </span>
              <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-white uppercase leading-snug">
                Verify Spare Parts Authenticity
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                Enter your RMC chassis catalog part number or search by keyword to check official MSRP prices and dynamic dealership stocks.
              </p>
            </div>

            {/* Interactive parts finder search box */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 gap-3">
                <Search size={18} className="text-neutral-400" />
                <input
                  type="text"
                  placeholder="e.g. LFP Charger, Brake Pads, monoshock..."
                  value={partSearch}
                  onChange={(e) => {
                    setPartSearch(e.target.value);
                    setSelectedPart(null);
                  }}
                  className="bg-transparent border-none outline-none w-full text-xs text-neutral-900 dark:text-white"
                />
              </div>

              {/* Suggestions results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                {partSearch !== '' && filteredParts.map(part => (
                  <button
                    key={part.code}
                    onClick={() => setSelectedPart(part)}
                    className="p-3 text-left border border-neutral-200/80 dark:border-neutral-800 rounded-xl hover:border-[#D72626]/40 dark:hover:border-[#D72626]/40 bg-neutral-50 dark:bg-neutral-900/40 text-xs transition-colors flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-white">{part.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{part.code}</p>
                    </div>
                    <span className="text-[10px] font-black text-[#D72626]">{part.price}</span>
                  </button>
                ))}
              </div>

              {/* Show selected item specs details */}
              <AnimatePresence>
                {selectedPart && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                        <CheckCircle2 size={14} />
                        <span>GENUINE PART CONFIRMED</span>
                      </div>
                      <p className="font-semibold text-neutral-950 dark:text-white text-sm">{selectedPart.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Catalog ID: {selectedPart.code} | Class: {selectedPart.type.toUpperCase()}</p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-xs text-neutral-500">Retail Price (MSRP)</span>
                      <p className="text-base font-black text-[#D72626]">{selectedPart.price}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${selectedPart.stock === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' : selectedPart.stock === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                        {selectedPart.stock}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
