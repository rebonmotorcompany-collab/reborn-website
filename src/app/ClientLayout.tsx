'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PremiumFeatures } from '@/components/PremiumFeatures';
import { AppProvider, useAppContext } from '@/context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle, Send, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

function ClientLayoutInner({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, lang, setLang, openQuoteModal } = useAppContext();
  const pathname = usePathname();
  
  // Need to duplicate quote modal state from App.tsx since it's tightly coupled to the layout
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState('');
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCity, setCustCity] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const isPortalRoute = pathname?.startsWith('/dashboard') || 
                        pathname?.startsWith('/company') || 
                        pathname?.startsWith('/dealer') || 
                        pathname?.startsWith('/unauthorized');

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone || !custCity) return;
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteModalOpen(false);
      setQuoteSubmitted(false);
      setCustName('');
      setCustEmail('');
      setCustPhone('');
      setCustCity('');
    }, 2500);
  };
  
  if (isPortalRoute) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-300">
        <main className="relative">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-300">
      <Navbar
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
        openQuoteModal={() => { setQuoteModalOpen(true); setSelectedProductForQuote('Rebon E-Volt X'); }}
      />

      <main className="relative">
        {children}
      </main>

      <PremiumFeatures lang={lang} />
      <Footer lang={lang} theme={theme} />

      {/* Global Interactive Quote Request Modal */}
      <AnimatePresence>
        {quoteModalOpen && (
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
                onClick={() => setQuoteModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-3 text-[#D72626]">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-white uppercase">Request Vehicle Pricing Quote</h3>
                <p className="text-xs text-neutral-500 mt-1">Get certified dealer pricing and commercial financing options immediately.</p>
              </div>

              {quoteSubmitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-100 p-6 rounded-2xl text-center py-8">
                  <CheckCircle size={40} className="mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold">Pricing Proposal Requested!</p>
                  <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">Our regional sales dealer will send your quotation over SMS and Email within 15 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Target Model Selection</label>
                    <select
                      value={selectedProductForQuote}
                      onChange={(e) => setSelectedProductForQuote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                    >
                      <option value="Rebon E-Volt X">Rebon E-Volt X (Flagship Heavy Electric)</option>
                      <option value="Rebon E-Glide Smart">Rebon E-Glide Smart (Scooter)</option>
                      <option value="Rebon Sprinter 150cc">Rebon Sprinter 150cc (Petrol Sports)</option>
                      <option value="Rebon Volt Lite">Rebon Volt Lite (Eco Commuter)</option>
                      <option value="Rebon Horizon 200">Rebon Horizon 200 (Upcoming Tourer)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="e.g. Kamran Ali"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">City Location</label>
                      <input
                        type="text"
                        required
                        value={custCity}
                        onChange={(e) => setCustCity(e.target.value)}
                        placeholder="e.g. Multan"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="e.g. +92 300 1234567"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="e.g. kamran@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#D72626] hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <Send size={12} />
                    <span>Get Pricing & Proposals</span>
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ClientLayoutInner>
        {children}
      </ClientLayoutInner>
    </AppProvider>
  );
}
