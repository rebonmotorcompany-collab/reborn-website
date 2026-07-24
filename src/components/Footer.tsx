'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { RmcLogo } from './RmcLogo';
import { Check, Mail, Send, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface FooterProps {
  lang: string;
  theme: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ lang, theme }) => {
  const { settings = {} } = useAppContext();
  const [subEmail, setSubEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setSubEmail('');
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isEnabled = (key: string) => settings[key] === 'true';

  return (
    <footer className="bg-neutral-950 text-white pt-20 pb-8 border-t border-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Directory layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-900">
          
          {/* Logo & Bio Left */}
          <div className="md:col-span-3 space-y-6">
            <RmcLogo 
              theme="dark" 
              className="h-10 w-auto" 
              logoUrl={settings.footer_logo || settings.logo_white || settings.logo_primary} 
            />
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              {settings?.footer_description || settings?.site_description || "Rebon Motor Company (RMC) is Pakistan's pioneering automotive company, crafting next-generation, high-performance electric and fuel-efficient petrol motorcycles designed indigenously with global engineering standards."}
            </p>
            {/* Social media icons */}
            <div className="flex flex-wrap gap-3">
              {settings?.social_facebook && isEnabled('social_facebook_enabled') && (
                <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:bg-[#D72626] text-neutral-400 hover:text-white transition-colors" title="Facebook">
                  <Facebook size={16} />
                </a>
              )}
              {settings?.social_twitter && isEnabled('social_twitter_enabled') && (
                <a href={settings.social_twitter} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:bg-[#D72626] text-neutral-400 hover:text-white transition-colors" title="Twitter">
                  <Twitter size={16} />
                </a>
              )}
              {settings?.social_instagram && isEnabled('social_instagram_enabled') && (
                <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:bg-[#D72626] text-neutral-400 hover:text-white transition-colors" title="Instagram">
                  <Instagram size={16} />
                </a>
              )}
              {settings?.social_linkedin && isEnabled('social_linkedin_enabled') && (
                <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:bg-[#D72626] text-neutral-400 hover:text-white transition-colors" title="LinkedIn">
                  <Linkedin size={16} />
                </a>
              )}
              {settings?.social_youtube && isEnabled('social_youtube_enabled') && (
                <a href={settings.social_youtube} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:bg-[#D72626] text-neutral-400 hover:text-white transition-colors" title="YouTube">
                  <Youtube size={16} />
                </a>
              )}
              {settings?.social_tiktok && isEnabled('social_tiktok_enabled') && (
                <a href={settings.social_tiktok} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:bg-[#D72626] text-neutral-400 hover:text-white transition-colors text-xs font-bold leading-none flex items-center justify-center min-w-8 min-h-8" title="TikTok">
                  <span>TT</span>
                </a>
              )}
              {settings?.social_threads && isEnabled('social_threads_enabled') && (
                <a href={settings.social_threads} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:bg-[#D72626] text-neutral-400 hover:text-white transition-colors text-xs font-bold leading-none flex items-center justify-center min-w-8 min-h-8" title="Threads">
                  <span>TH</span>
                </a>
              )}
              {settings?.social_pinterest && isEnabled('social_pinterest_enabled') && (
                <a href={settings.social_pinterest} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:bg-[#D72626] text-neutral-400 hover:text-white transition-colors text-xs font-bold leading-none flex items-center justify-center min-w-8 min-h-8" title="Pinterest">
                  <span>PIN</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick links sitemaps */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-300 border-b border-neutral-900 pb-2">Products</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-light">
              <li><a href="#products" className="hover:text-[#D72626] transition-colors">E-Volt X Heavy</a></li>
              <li><a href="#products" className="hover:text-[#D72626] transition-colors">E-Glide Smart Scooter</a></li>
              <li><a href="#products" className="hover:text-[#D72626] transition-colors">Sprinter 150cc Petrol</a></li>
              <li><a href="#products" className="hover:text-[#D72626] transition-colors">Volt Lite Commuter</a></li>
              <li><a href="#products" className="hover:text-[#D72626] transition-colors">Upcoming Horizon 200</a></li>
            </ul>
          </div>

          {/* Company links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-300 border-b border-neutral-900 pb-2">Company</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-light">
              <li><Link href="/company/about" className="hover:text-[#D72626] transition-colors">About Us</Link></li>
              <li><Link href="/company/news" className="hover:text-[#D72626] transition-colors">Latest News</Link></li>
              <li><Link href="/company/team" className="hover:text-[#D72626] transition-colors">Meet Our Team</Link></li>
              <li><Link href="/company/careers" className="hover:text-[#D72626] transition-colors">Careers / Jobs</Link></li>
              <li><Link href="/contact" className="hover:text-[#D72626] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-300 border-b border-neutral-900 pb-2">Dealerships</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-light">
              <li><a href="#dealers" className="hover:text-[#D72626] transition-colors">Dealer Locations</a></li>
              <li><a href="#dealers" className="hover:text-[#D72626] transition-colors">Apply For Rights</a></li>
              <li><a href="#dealers" className="hover:text-[#D72626] transition-colors">Corporate Fleet Orders</a></li>
              <li><a href="#services" className="hover:text-[#D72626] transition-colors">Spare Parts Catalogue</a></li>
            </ul>
          </div>

          {/* Newsletter subscription form */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-300 border-b border-neutral-900 pb-2">Newsletter</h4>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Subscribe to receive latest software OTA updates, heavy launch announcements, and dealership exclusive pricing plans.
            </p>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-bold"
                >
                  <Check size={14} />
                  <span>Subscription Confirmed!</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-1.5">
                  <input
                    type="email"
                    required
                    placeholder="Type your email address"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs px-2.5 py-1.5 w-full text-white placeholder-neutral-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-[#D72626] hover:bg-red-700 transition-colors text-white"
                  >
                    <Send size={14} />
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Regulatory footer bottom */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} {settings.copyright_text || "Rebon Motor Company (RMC) Pakistan. All Rights Reserved."}
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors focus:outline-none"
            >
              Privacy Policy
            </Link>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none"
            >
              <span>Back To Top</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
