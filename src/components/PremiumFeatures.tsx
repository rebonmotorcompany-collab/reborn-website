'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ChevronUp, Bot, Send, User, Sparkles, CheckSquare } from 'lucide-react';

interface PremiumFeaturesProps {
  lang: string;
}

export const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ lang }) => {
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chat conversation state
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'bot',
      text: 'Salam! Welcome to Rebon Motor Company. I am your smart virtual assistant. How can I assist you on your journey today?',
      time: 'Just now'
    }
  ]);

  const presetQueries = [
    { label: 'Book E-Volt X Test Ride', text: 'I would like to book a test ride for E-Volt X.' },
    { label: 'Battery Lifespan & Safety', text: 'Tell me about LFP battery lifespans.' },
    { label: 'Dealer in my city?', text: 'Where can I find an authorized showroom?' }
  ];

  // Loader timer
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(progressTimer);
  }, []);

  // Show scroll top on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMsg = { sender: 'user', text, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);

    // Simulate smart auto-reply
    setTimeout(() => {
      let replyText = "Understood. Our sales specialist has been notified about your query. You can also directly call our toll-free corporate helpline: +92 (42) 111-732-661.";
      
      if (text.includes('test ride')) {
        replyText = "Fabulous choice! To register for a test ride at our Lahore, Karachi, or Islamabad flagship showrooms, please enter your contact number or click the 'Get Quote' button in the menu so we can lock in a diagnostic slot for you.";
      } else if (text.includes('LFP')) {
        replyText = "Our custom Lithium Iron Phosphate (LFP) batteries are engineered for extreme durability, surviving 2,000+ charging cycles with active liquid cooling. They are covered by a full 3-year replacement warranty!";
      } else if (text.includes('showroom') || text.includes('showroom')) {
        replyText = "We have over 100 showrooms nationwide. Please scroll down to our 'Dealer Network' section on this page to view our interactive Pakistan map with phone contacts for Karachi, Lahore, Islamabad, Peshawar, and Quetta.";
      }

      const botReply = { sender: 'bot', text: replyText, time: 'Just now' };
      setMessages(prev => [...prev, botReply]);
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Premium Entrance Pre-Loader Screen */}
      {loading && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center text-white p-6 transition-opacity duration-300"
        >
          <div className="text-center max-w-sm space-y-6">
            {/* Animated Glowing Title logo indicator with Tailwind pulse */}
            <div
              className="text-4xl font-black font-display tracking-tight text-white flex justify-center animate-pulse"
            >
              <span>REBON </span>
              <span className="text-[#D72626] ml-2">MOTOR</span>
            </div>

            {/* Progress Bar container */}
            <div className="space-y-2">
              <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                <div
                  style={{ width: `${loadingProgress}%` }}
                  className="h-full bg-[#D72626] rounded-full transition-all duration-75"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                <span>PRE-LOADING DESIGN SYSTEMS...</span>
                <span>{loadingProgress}%</span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-600 font-mono tracking-widest uppercase">
              POWERING THE FUTURE OF MOBILITY
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons Area Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        
        {/* Scroll To Top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleScrollTop}
              className="p-3 bg-neutral-900 border border-neutral-800 text-white rounded-full hover:bg-[#D72626] transition-colors shadow-xl"
              title="Scroll back to top"
            >
              <ChevronUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating WhatsApp Action Trigger */}
        <a
          href="https://wa.me/923000000000"
          target="_blank"
          rel="noreferrer"
          className="p-3.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors shadow-2xl flex items-center justify-center hover:scale-105 transform"
          title="Connect via WhatsApp"
        >
          <MessageCircle size={22} className="fill-current" />
        </a>

        {/* Floating Smart Support Chat Toggle */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`p-3.5 text-white rounded-full transition-all shadow-2xl flex items-center justify-center hover:scale-105 transform
            ${chatOpen ? 'bg-neutral-800' : 'bg-[#D72626]'}`}
        >
          {chatOpen ? <X size={22} /> : <Bot size={22} />}
        </button>
      </div>

      {/* Floating Support Chat Screen Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
          >
            {/* Header */}
            <div className="bg-[#D72626] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">RMC Smart Assistant</h4>
                  <p className="text-[10px] text-red-100 opacity-90 font-light">Online • Dynamic response</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-1 rounded-full hover:bg-black/10">
                <X size={16} />
              </button>
            </div>

            {/* Conversation Messages area */}
            <div className="p-4 h-64 overflow-y-auto space-y-3 scrollbar-thin">
              {messages.map((msg, index) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={index} className={`flex ${isBot ? 'justify-start' : 'justify-end'} gap-2`}>
                    {isBot && (
                      <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-[#D72626] text-[10px] flex-shrink-0">
                        <Bot size={12} />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed
                        ${isBot 
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none' 
                          : 'bg-[#D72626] text-white rounded-tr-none'}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prompt presets trigger blocks */}
            <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col gap-1.5">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest pl-1">Tap a preset question:</span>
              <div className="flex flex-wrap gap-1.5">
                {presetQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q.text)}
                    className="px-2.5 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-[10px] font-bold text-neutral-700 dark:text-neutral-300 hover:border-[#D72626] transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
