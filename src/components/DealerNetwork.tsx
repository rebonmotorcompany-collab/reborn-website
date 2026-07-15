'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dealers } from '../data';
import { Dealer } from '../types';
import { MapPin, Phone, Mail, Award, Key, CheckCircle, ArrowRight, X } from 'lucide-react';

interface DealerNetworkProps {
  lang: string;
}

export const DealerNetwork: React.FC<DealerNetworkProps> = ({ lang }) => {
  const [selectedDealer, setSelectedDealer] = useState<Dealer>(dealers[1]); // Default to Lahore Flagship
  const [registerOpen, setRegisterOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formExperience, setFormExperience] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCity || !formPhone) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setRegisterOpen(false);
      setFormSubmitted(false);
      setFormName('');
      setFormCity('');
      setFormPhone('');
      setFormExperience('');
    }, 2000);
  };

  return (
    <section id="dealers" className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#1E1E1E] dark:text-neutral-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'Showroom Network' : 'شعبہ ڈیلرشپ'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'RMC Dealer Network' : 'ہمارا ملک گیر ڈیلر نیٹ ورک'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
          <p className="text-xs text-neutral-500 mt-4 font-light max-w-lg mx-auto">
            With 100+ locations across Pakistan, professional support is always right around the corner.
          </p>
        </div>

        {/* Map & Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* SVG Map Left */}
          <div className="lg:col-span-7 flex flex-col items-center bg-[#F5F5F5] dark:bg-[#111111] p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80">
            <h3 className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-4">Interactive Pakistan Map</h3>
            
            {/* Custom Pakistan Map Group */}
            <div className="relative w-full aspect-square max-w-lg bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden p-4 border border-neutral-200/60 dark:border-neutral-800/80">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full stroke-neutral-300 dark:stroke-neutral-800 fill-neutral-200 dark:fill-neutral-900"
              >
                {/* Simulated geographic silhouette of Pakistan regions */}
                <path
                  d="M10 80 L20 70 L25 55 L20 45 L35 40 L45 25 L55 20 L65 25 L75 30 L80 35 L75 45 L78 52 L72 60 L68 70 L55 75 L45 80 L35 85 L20 90 Z"
                  strokeWidth="0.8"
                />
                {/* Indus River line */}
                <path
                  d="M75 30 Q58 55 38 85"
                  stroke="#D72626"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  fill="none"
                  opacity="0.5"
                />
              </svg>

              {/* Pins overlays */}
              {dealers.map((dealer) => {
                const isSelected = selectedDealer.id === dealer.id;
                return (
                  <button
                    key={dealer.id}
                    onClick={() => setSelectedDealer(dealer)}
                    style={{ left: `${dealer.coordinates.x}%`, top: `${dealer.coordinates.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSelected ? 'bg-red-500' : 'bg-neutral-500'}`}></span>
                      <MapPin
                        size={18}
                        className={`relative z-10 transition-transform group-hover:scale-125 ${isSelected ? 'text-[#D72626]' : 'text-neutral-500 dark:text-neutral-400'}`}
                      />
                    </span>
                    {/* Tooltip labels */}
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 bg-neutral-900 text-white text-[9px] font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                      {dealer.city}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <p className="text-[10px] text-neutral-400 mt-4 text-center">
              💡 Tap any location pin on the map grid to show the local corporate dealer profile details.
            </p>
          </div>

          {/* Contact Details Panel Right */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDealer.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-3xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 shadow-sm space-y-6"
              >
                <div>
                  <span className="text-[10px] font-black text-[#D72626] uppercase tracking-widest bg-red-500/10 px-2.5 py-1 rounded">
                    RMC Certified Dealership
                  </span>
                  <h3 className="text-2xl font-black font-display text-neutral-900 dark:text-white uppercase mt-3">
                    {selectedDealer.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-bold tracking-widest uppercase mt-1">Region: {selectedDealer.city}, Pakistan</p>
                </div>

                <div className="space-y-4 text-xs font-light">
                  <div className="flex gap-3 items-start">
                    <MapPin size={16} className="text-[#D72626] mt-0.5 flex-shrink-0" />
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{selectedDealer.address}</p>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Phone size={16} className="text-[#D72626] flex-shrink-0" />
                    <a href={`tel:${selectedDealer.phone}`} className="text-neutral-600 dark:text-neutral-300 hover:text-[#D72626] transition-colors">{selectedDealer.phone}</a>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Mail size={16} className="text-[#D72626] flex-shrink-0" />
                    <a href={`mailto:${selectedDealer.email}`} className="text-neutral-600 dark:text-neutral-300 hover:text-[#D72626] transition-colors">{selectedDealer.email}</a>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Business Hours</span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-semibold mt-0.5 block">09:00 AM - 08:00 PM</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Services Offered</span>
                    <span className="text-emerald-500 font-bold mt-0.5 block">Sales, Parts & Tuning</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Become a dealer Call to Action */}
            <div className="p-8 rounded-3xl bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 text-white flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-black font-display uppercase tracking-wider mb-2">Partner with Rebon Motor</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                  Expand your business portfolio. Gain access to eco-friendly electric drivetrains, high-volume petrol models, parts delivery pipelines, and comprehensive mechanic diagnostic training.
                </p>
              </div>
              <button
                onClick={() => setRegisterOpen(true)}
                className="w-full py-3.5 bg-[#D72626] hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-red-500/25 flex items-center justify-center gap-1"
              >
                <span>Apply for Dealership</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Dealer benefits grid */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em]">Dealership Privileges</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-[#F5F5F5] dark:bg-[#111111] text-center">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3 text-[#D72626]">
                <Key size={16} />
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">Territorial Rights</h4>
              <p className="text-xs text-neutral-550 dark:text-neutral-400 font-light mt-1.5 leading-relaxed">Exclusive operational rights in your designated municipal radius preventing sales conflicts.</p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-[#F5F5F5] dark:bg-[#111111] text-center">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3 text-[#D72626]">
                <Award size={16} />
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">Branding & Signage</h4>
              <p className="text-xs text-neutral-550 dark:text-neutral-400 font-light mt-1.5 leading-relaxed">Complimentary 3D premium external storefront signage and high-end sales brochures provided.</p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-[#F5F5F5] dark:bg-[#111111] text-center">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3 text-[#D72626]">
                <CheckCircle size={16} />
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">Mechanic Training</h4>
              <p className="text-xs text-neutral-550 dark:text-neutral-400 font-light mt-1.5 leading-relaxed">Bi-annual localized technical courses on lithium cells, BMS diagnosis, and EFI configuration loops.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Dealer Application Form Modal */}
      <AnimatePresence>
        {registerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 relative"
            >
              <button
                onClick={() => setRegisterOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-white uppercase">Dealership Partnership Program</h3>
                <p className="text-xs text-neutral-500 mt-1">Submit your basic details. Our corporate business development team will contact you within 48 hours.</p>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-100 p-6 rounded-2xl text-center py-8">
                  <CheckCircle size={40} className="mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold">Application Received Successfully!</p>
                  <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">Your tracking number is #RMC-DEALER-{Math.floor(Math.random() * 90000 + 10000)}</p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Kamran Ali"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Target City</label>
                      <input
                        type="text"
                        required
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="e.g. Faisalabad"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Contact Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. +92 321 4567890"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Automotive Experience Details (Optional)</label>
                    <textarea
                      value={formExperience}
                      onChange={(e) => setFormExperience(e.target.value)}
                      placeholder="Briefly explain your previous or current retail/automotive workshop experience..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D72626] hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                  >
                    Submit Dealership Proposal
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
