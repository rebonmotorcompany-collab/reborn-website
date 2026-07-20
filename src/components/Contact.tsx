'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle, Send, PhoneCall } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface ContactProps {
  lang: string;
}

export const Contact: React.FC<ContactProps> = ({ lang }) => {
  const { settings = {} } = useAppContext();
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Query');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 2500);
  };

  const getDayHoursText = (day: string) => {
    const status = settings[`hours_${day}_status`] || 'open';
    if (status === 'closed') return 'Closed';
    const open = settings[`hours_${day}_open`] || '09:00';
    const close = settings[`hours_${day}_close`] || '18:00';
    return `${open} — ${close}`;
  };

  const phoneValue = settings?.contact_phone || '+92 (42) 111-732-661';
  const cleanPhone = phoneValue.replace(/[^0-9+]/g, '');

  return (
    <section id="contact" className="py-24 bg-[#F5F5F5] dark:bg-[#0E0E0E] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'Get In Touch' : 'رابطہ کیجیے'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'Contact Corporate Headquarters' : 'ہمارے دفاتر'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Corporate Details Left */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-6">
              <h3 className="text-lg font-black font-display uppercase tracking-wider text-neutral-900 dark:text-white">
                {settings.site_name || 'Rebon Motor Company'} (HQ)
              </h3>
              
              <div className="space-y-4 text-xs sm:text-sm font-light">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-[#D72626] flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block font-black text-neutral-400 uppercase text-[9px] tracking-wider">Corporate Headquarters</span>
                    <p className="text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                      {settings.office_address || '88-D/1, Main Boulevard Gulberg III, Lahore, Punjab, Pakistan'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-[#D72626] flex-shrink-0">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <span className="block font-black text-neutral-400 uppercase text-[9px] tracking-wider">Telephone Line</span>
                    <p className="text-neutral-700 dark:text-neutral-300 mt-1">
                      <a href={`tel:${cleanPhone}`} className="hover:text-[#D72626] transition-colors font-semibold">{phoneValue}</a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-[#D72626] flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block font-black text-neutral-400 uppercase text-[9px] tracking-wider">Corporate Email</span>
                    <p className="text-neutral-700 dark:text-neutral-300 mt-1">
                      <a href={`mailto:${settings.contact_email || 'info@rebonmotor.com'}`} className="hover:text-[#D72626] transition-colors">
                        {settings.contact_email || 'info@rebonmotor.com'}
                      </a>
                    </p>
                    {settings.support_email && (
                      <p className="text-neutral-400 text-xs font-mono">{settings.support_email}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-[#D72626] flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="block font-black text-neutral-400 uppercase text-[9px] tracking-wider">Office Hours</span>
                    <div className="text-neutral-700 dark:text-neutral-300 mt-1 space-y-1">
                      <div className="flex justify-between gap-4">
                        <span className="font-bold">Mon — Fri:</span>
                        <span>{getDayHoursText('monday')}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="font-bold">Sat:</span>
                        <span>{getDayHoursText('saturday')}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="font-bold text-red-500">Sun:</span>
                        <span className="text-red-500 font-semibold">{getDayHoursText('sunday')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom high-fidelity styled geo-location simulated map layout */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#141414] border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm flex flex-col justify-between overflow-hidden">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-3">Office Landmark Map</span>
              <div className="relative w-full h-44 bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-200/60 dark:border-neutral-800/80 rounded-xl overflow-hidden">
                {settings.google_maps_url ? (
                  <iframe 
                    src={settings.google_maps_url} 
                    className="w-full h-full border-0" 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <>
                    {/* Styled Grid resembling streets of Gulberg Lahore */}
                    <div className="absolute inset-0 bg-grid-lines stroke-neutral-200 dark:stroke-neutral-800 opacity-20 pointer-events-none" />
                    <div className="absolute left-1/3 top-0 w-1.5 h-full bg-neutral-200 dark:bg-neutral-800" /> {/* Main Boulevard */}
                    <div className="absolute left-0 top-1/2 w-full h-1.5 bg-neutral-200 dark:bg-neutral-800" /> {/* Jail Road */}
                    
                    {/* Pin Point */}
                    <div className="absolute left-[33%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                      <span className="relative flex h-6 w-6 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <MapPin size={18} className="text-[#D72626] relative z-10" />
                      </span>
                      <span className="bg-neutral-900 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded shadow mt-1">RMC HQ</span>
                    </div>
                  </>
                )}
              </div>
              <p className="text-[10px] text-neutral-400 mt-2 text-center font-light">
                🗺️ Located at {settings.office_address ? `${settings.office_city || ''} ${settings.office_country || ''}` : 'Main Boulevard Gulberg III (adjacent to Liberty Market), Lahore'}.
              </p>
            </div>
          </div>

          {/* Contact Us Form Right */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm">
              <h3 className="text-lg font-black font-display uppercase tracking-wider mb-6 text-neutral-900 dark:text-white">Send Corporate Inquiry</h3>

              <AnimatePresence mode="wait">
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-100 text-center py-12"
                  >
                    <CheckCircle size={44} className="mx-auto mb-3 text-emerald-500" />
                    <h4 className="font-black text-lg">Inquiry Dispatched Successfully!</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 max-w-sm mx-auto">
                      Thank you for contacting Rebon Motor Company. A customer relations manager has been assigned to your query and will reply via email shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Kamran Ali"
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. kamran@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +92 300 1234567"
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Inquiry Topic</label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                        >
                          <option value="Product Query">Product Query & Pricing</option>
                          <option value="Dealership">Dealership Network Partner</option>
                          <option value="Parts">Spare Parts Order</option>
                          <option value="Corporate Fleet">Corporate Fleet Order</option>
                          <option value="Media">Media & PR Announcements</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Your Detailed Message</label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please type your inquiries regarding models, specs, parts, or dealership terms in detail..."
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#D72626] hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-lg shadow-red-500/15"
                    >
                      <Send size={12} />
                      <span>Dispatch Inquiry</span>
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
