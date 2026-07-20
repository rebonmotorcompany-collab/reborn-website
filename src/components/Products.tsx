'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VehicleType } from '../types';
import { ShieldAlert, ArrowRight, Zap, Flame, Compass, ChevronRight, HelpCircle, FileText, CheckCircle } from 'lucide-react';

interface ProductsProps {
  lang: string;
  theme: 'light' | 'dark';
  openQuoteModal: (productName: string) => void;
  dbProducts: any[];
}

export const Products: React.FC<ProductsProps> = ({ lang, theme, openQuoteModal, dbProducts }) => {
  const getType = (p: any) => {
    if (p.type) return p.type;
    if (Array.isArray(p.tags)) {
      const t = p.tags.find((tag: string) => ['electric', 'petrol', 'scooter', 'coming_soon'].includes(tag.toLowerCase()));
      if (t) return t.toLowerCase();
    }
    return 'electric';
  };
  const [activeTab, setActiveTab] = useState<VehicleType | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const tabs: { label: string; value: VehicleType | 'all' }[] = [
    { label: lang === 'en' ? 'All Models' : lang === 'ur' ? 'تمام ماڈلز' : '所有车型', value: 'all' },
    { label: lang === 'en' ? 'Electric Bikes' : lang === 'ur' ? 'الیکٹرک بائیکس' : '电动摩托', value: 'electric' },
    { label: lang === 'en' ? 'Petrol Bikes' : lang === 'ur' ? 'پٹرول بائیکس' : '汽油摩托', value: 'petrol' },
    { label: lang === 'en' ? 'Smart Scooters' : lang === 'ur' ? 'اسمارٹ اسکوٹرز' : '智能踏板', value: 'scooter' },
    { label: lang === 'en' ? 'Coming Soon' : lang === 'ur' ? 'عنقریب آنے والے' : '即将推出', value: 'coming_soon' },
  ];

  const filteredProducts = activeTab === 'all'
    ? dbProducts
    : dbProducts.filter(p => getType(p) === activeTab);

  return (
    <section id="products" className="py-24 bg-[#F5F5F5] dark:bg-[#0E0E0E] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'Our Lineup' : lang === 'ur' ? 'ہمارا لائن اپ' : '车辆阵容'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'Power Meets Innovation' : lang === 'ur' ? 'طاقت اور جدت کا سنگم' : '动力与创新的结合'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
          <p className="text-xs text-neutral-500 mt-4 max-w-lg mx-auto font-light leading-relaxed">
            Choose between highly optimized clean-energy electric drivetrains or standard-setting mechanical fuel engines.
          </p>
        </div>

        {/* Tab Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                  ${isActive 
                    ? 'bg-[#D72626] text-white shadow-lg shadow-red-500/25' 
                    : 'bg-white dark:bg-[#1A1A1A] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800/60'}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Products Bento Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={product.id}
                className="bg-white dark:bg-[#141414] product-card rounded-3xl overflow-hidden group flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Badge */}
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                    ${getType(product) === 'electric' || getType(product) === 'scooter'
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : getType(product) === 'petrol'
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      : 'bg-red-500/15 text-red-500 border border-red-500/30'}`}
                  >
                    {getType(product) === 'coming_soon' ? 'Coming Soon' : getType(product).toUpperCase()}
                  </span>

                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white font-display font-black text-sm px-3.5 py-1.5 rounded-xl">
                    {product.price}
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-display mb-2">{product.name}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {/* Quick Specs bar */}
                    <div className="grid grid-cols-2 gap-3 mb-6 bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800/60">
                      {product.range && (
                        <div>
                          <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Range / Mileage</span>
                          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{product.range}</span>
                        </div>
                      )}
                      <div>
                        <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Top Speed</span>
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{product.topSpeed}</span>
                      </div>
                      {product.battery && (
                        <div className="col-span-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                          <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Battery Power</span>
                          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <Zap size={11} /> {product.battery}
                          </span>
                        </div>
                      )}
                      {product.engine && !product.battery && (
                        <div className="col-span-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                          <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Engine Power</span>
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            <Flame size={11} /> {product.engine}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-2.5 rounded-xl border border-neutral-250 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-bold transition-all"
                    >
                      Learn More
                    </button>
                    <button
                      onClick={() => openQuoteModal(product.name)}
                      className="px-4 py-2.5 bg-[#D72626] hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-red-500/10 flex items-center justify-center gap-1"
                    >
                      <span>Get Quote</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Detailed Modal Drawer */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white dark:bg-neutral-950 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto"
              >
                {/* Sticky Header inside modal */}
                <div className="sticky top-0 bg-white dark:bg-neutral-950 z-10 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                  <h3 className="text-2xl font-black font-display text-neutral-900 dark:text-white uppercase">
                    {selectedProduct.name}
                  </h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Hero view */}
                  <div className="aspect-video rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Summary & Price */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-neutral-50 dark:bg-neutral-900/40 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Manufacturer Suggested Retail Price (MSRP)</p>
                      <h4 className="text-2xl font-black text-[#D72626] mt-0.5">{selectedProduct.price}</h4>
                    </div>
                    <button
                      onClick={() => {
                        const name = selectedProduct.name;
                        setSelectedProduct(null);
                        openQuoteModal(name);
                      }}
                      className="mt-4 sm:mt-0 px-6 py-3 bg-[#D72626] hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-500/10"
                    >
                      Instant Quote Request
                    </button>
                  </div>

                  {/* Feature & Technical Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Key Technical specifications */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-2">Technical Specifications</h4>
                      <table className="w-full text-xs">
                        <tbody>
                          <tr className="border-b border-neutral-100 dark:border-neutral-900 py-2 block">
                            <td className="text-neutral-500 font-medium py-1.5 w-1/2">Top Velocity</td>
                            <td className="text-neutral-900 dark:text-neutral-200 font-bold py-1.5 text-right">{selectedProduct.topSpeed}</td>
                          </tr>
                          {selectedProduct.range && (
                            <tr className="border-b border-neutral-100 dark:border-neutral-900 py-2 block">
                              <td className="text-neutral-500 font-medium py-1.5 w-1/2">Cruising Range</td>
                              <td className="text-neutral-900 dark:text-neutral-200 font-bold py-1.5 text-right">{selectedProduct.range}</td>
                            </tr>
                          )}
                          {selectedProduct.content ? (() => {
                            try {
                              const parsed = JSON.parse(selectedProduct.content);
                              return (parsed.specs || []).map((spec: any) => (
                                <tr key={spec.label} className="border-b border-neutral-100 dark:border-neutral-900 py-2 block">
                                  <td className="text-neutral-500 font-medium py-1.5 w-1/2">{spec.label}</td>
                                  <td className="text-neutral-900 dark:text-neutral-200 font-bold py-1.5 text-right">{spec.value}</td>
                                </tr>
                              ));
                            } catch { return null; }
                          })() : null}
                        </tbody>
                      </table>
                    </div>

                    {/* Highlights / Features List */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-2">Premium Ride Highlights</h4>
                      <div className="space-y-2">
                        {selectedProduct.content ? (() => {
                            try {
                              const parsed = JSON.parse(selectedProduct.content);
                              return (
                                <div className="text-neutral-600 dark:text-neutral-300 font-light text-xs whitespace-pre-line">
                                  {(parsed.features || []).map((feat: string, index: number) => (
                                    <div key={index} className="flex items-start gap-2 text-xs mb-2">
                                      <CheckCircle size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                      <span>{feat}</span>
                                    </div>
                                  ))}
                                </div>
                              );
                            } catch { return null; }
                          })() : null}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
