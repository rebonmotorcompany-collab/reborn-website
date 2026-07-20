'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Search, Globe, LogIn, Sparkles, MessageCircle, ArrowRight, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { RmcLogo } from './RmcLogo';
import { useRouter, usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { validateCaptchaAction } from '@/actions/auth';
import { authenticate } from '@/actions/auth';
import Captcha from '@/components/Captcha';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

interface NavbarProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  lang: string;
  setLang: (lang: string) => void;
  openQuoteModal: (productName?: string) => void;
  dbProducts: any[];
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  setTheme,
  lang,
  setLang,
  openQuoteModal,
  dbProducts,
}) => {
  const { settings = {} } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dealerLoginOpen, setDealerLoginOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleDealerLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const captchaToken = formData.get('captchaToken') as string;
    const captchaCode = formData.get('captchaCode') as string;

    // 1. Validate CAPTCHA on server
    const captchaResult = await validateCaptchaAction(captchaToken, captchaCode, 'dealer_portal');
    if (!captchaResult.success) {
      setErrorMessage(captchaResult.error || 'CAPTCHA failed');
      setIsPending(false);
      return;
    }

    // 2. Sign In
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setErrorMessage('Invalid email or password.');
      setIsPending(false);
    } else {
      router.push('/dashboard');
    }
  };

  // Close modals on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDealerLoginOpen(false);
        setLangOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = [
    { label: lang === 'en' ? 'Home' : lang === 'ur' ? 'ہوم' : '首页', id: 'hero' },
    { label: lang === 'en' ? 'About' : lang === 'ur' ? 'ہمارے بارے میں' : '关于', id: 'about' },
    { label: lang === 'en' ? 'Products' : lang === 'ur' ? 'پروڈکٹس' : '产品', id: 'products' },
    { label: lang === 'en' ? 'Technology' : lang === 'ur' ? 'ٹیکنالوجی' : '科技', id: 'technology' },
    { label: lang === 'en' ? 'Manufacturing' : lang === 'ur' ? 'پیداوار' : '制造', id: 'manufacturing' },
    { label: lang === 'en' ? 'Dealers' : lang === 'ur' ? 'ڈیلرز' : '经销商', id: 'dealers' },
    { label: lang === 'en' ? 'Services' : lang === 'ur' ? 'خدمات' : '服务', id: 'services' },
    { label: lang === 'en' ? 'News' : lang === 'ur' ? 'خبریں' : '新闻', id: 'news' },
    { label: lang === 'en' ? 'Contact' : lang === 'ur' ? 'رابطہ' : '联系我们', id: 'contact' },
  ];

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false);

    let path = '/';
    if (id === 'hero') path = '/';
    else if (id === 'about') path = '/about';
    else if (id === 'products') path = '/products';
    else if (id === 'technology') path = '/technology';
    else if (id === 'manufacturing') path = '/manufacturing';
    else if (id === 'dealers') path = '/dealers';
    else if (id === 'services') path = '/services';
    else if (id === 'news') path = '/news';
    else if (id === 'contact') path = '/contact';

    router.push(path);
  };

  const filteredProducts = (dbProducts || []).filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="navbar-wrapper">
      {/* Main Glass Navbar */}
      <nav
        id="main-navbar"
        suppressHydrationWarning
        className="fixed top-0 left-0 w-full z-40 transition-all duration-300 glass-nav text-neutral-800 dark:text-white"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Brand Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => handleScroll('hero')}>
              <RmcLogo 
                theme={theme} 
                className="h-10 w-auto" 
                logoUrl={theme === 'dark' 
                  ? (settings.logo_dark || settings.logo_primary || settings.logo_white) 
                  : (settings.logo_secondary || settings.logo_primary || settings.logo_dark)
                } 
              />
            </div>

            {/* Desktop Navigation links */}
            <div className="hidden xl:flex items-center space-x-1 2xl:space-x-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScroll(item.id)}
                  className="px-2 py-2 text-[10px] 2xl:text-[11px] font-bold uppercase tracking-[0.12em] 2xl:tracking-[0.15em] text-neutral-800 dark:text-white hover:text-[#D72626] dark:hover:text-[#D72626] transition-all duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#D72626] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
                </button>
              ))}
            </div>

            {/* Action Buttons Right */}
            <div className="hidden xl:flex items-center space-x-2 2xl:space-x-3">
              {/* Dark mode Toggle */}
              <button
                id="theme-toggle-btn"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={17} className="text-yellow-400" /> : <Moon size={17} className="text-[#3A3A3A]" />}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  id="lang-selector-btn"
                  onClick={() => setLangOpen(!langOpen)}
                  className="p-1.5 rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors flex items-center gap-1 text-[10px] font-bold tracking-wider"
                >
                  <Globe size={14} />
                  <span>{lang.toUpperCase()}</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-lg shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 py-1 text-xs text-neutral-800 dark:text-white">
                    <button
                      onClick={() => { setLang('en'); setLangOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLang('ur'); setLangOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-urdu"
                    >
                      اردو (Urdu)
                    </button>
                    <button
                      onClick={() => { setLang('zh'); setLangOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      中文 (Chinese)
                    </button>
                  </div>
                )}
              </div>

              {/* Search Toggle */}
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(true)}
                className="p-1.5 rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <Search size={17} />
              </button>

              {/* Dealer Login */}
              <button
                id="dealer-login-btn"
                onClick={() => setDealerLoginOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-[#D72626] dark:hover:border-[#D72626] transition-colors text-[9px] 2xl:text-[10px] font-bold uppercase tracking-wider"
              >
                <LogIn size={12} />
                <span>{lang === 'en' ? 'Dealer Portal' : lang === 'ur' ? 'ڈیلر پورٹل' : '经销商门户'}</span>
              </button>

              {/* WhatsApp Floating link click simulation */}
              <a
                href={`https://wa.me/${(settings?.whatsapp_number || settings?.contact_phone || '923000000000').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                id="whatsapp-header-link"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-[9px] 2xl:text-[10px] font-bold uppercase tracking-wider shadow-sm"
              >
                <MessageCircle size={12} />
                <span>WhatsApp</span>
              </a>

              {/* Get Quote Button */}
              <button
                id="get-quote-header-btn"
                onClick={() => openQuoteModal()}
                className="red-pill scale-80 2xl:scale-90 origin-center"
              >
                {lang === 'en' ? 'Get Quote' : lang === 'ur' ? 'قیمت معلوم کریں' : '获取报价'}
              </button>
            </div>

            {/* Mobile Actions Overlay Trigger (Hamburger & Toggles) */}
            <div className="flex xl:hidden items-center space-x-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <Search size={18} />
              </button>
              <button
                id="mobile-menu-hamburger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleScroll(item.id)}
                    className="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-[#D72626] dark:hover:text-[#D72626] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setDealerLoginOpen(true); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white text-xs font-semibold"
                  >
                    <LogIn size={14} />
                    <span>Dealer Portal</span>
                  </button>
                  <button
                    onClick={() => { openQuoteModal(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#D72626] text-white text-xs font-semibold"
                  >
                    <span>Get Quote</span>
                  </button>
                </div>

                <div className="pt-3 flex justify-between items-center text-xs text-neutral-500">
                  <span>Language:</span>
                  <div className="flex gap-2">
                    <button onClick={() => setLang('en')} className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-[#D72626] text-white' : ''}`}>EN</button>
                    <button onClick={() => setLang('ur')} className={`px-2 py-1 rounded font-urdu ${lang === 'ur' ? 'bg-[#D72626] text-white' : ''}`}>اردو</button>
                    <button onClick={() => setLang('zh')} className={`px-2 py-1 rounded ${lang === 'zh' ? 'bg-[#D72626] text-white' : ''}`}>中文</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
            >
              {/* Search input header */}
              <div className="flex items-center p-4 border-b border-neutral-200 dark:border-neutral-800 gap-3">
                <Search className="text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Search electric bikes, petrol models, tech features, dealers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search results */}
              <div className="max-h-96 overflow-y-auto p-4">
                {searchQuery === '' ? (
                  <div className="text-center py-6 text-neutral-500 text-sm">
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Search RMC Ecosystem</p>
                    <p>Type model name like &quot;E-Volt X&quot; or product category to get instant specs.</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Product Catalog Matches</p>
                    {filteredProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSearchOpen(false);
                          handleScroll('products');
                        }}
                        className="flex items-center p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors gap-4"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-12 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{p.name}</h4>
                          <p className="text-xs text-[#D72626] font-medium uppercase tracking-widest">{p.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-500 font-semibold">{p.price}</p>
                          <p className="text-[10px] text-neutral-400 flex items-center gap-1 justify-end">
                            Specs <ArrowRight size={10} />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    No results matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dealer Portal Login Modal */}
      <AnimatePresence>
        {dealerLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 relative"
            >
              <button
                onClick={() => setDealerLoginOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LogIn className="text-[#D72626]" size={24} />
                </div>
                <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-neutral-100">Authorized Dealer Portal</h3>
                <p className="text-xs text-neutral-500 mt-1">Manage orders, stock delivery status, and warranty claims.</p>
              </div>

              <form onSubmit={handleDealerLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Registered Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. dealer@rebonmotor.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 text-sm focus:border-[#D72626] outline-none"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Access Passcode</label>
                    <Link href="/forgot-password" className="text-[10px] text-[#D72626] hover:text-red-500 font-bold uppercase tracking-wider transition-colors">Forgot Password?</Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 pr-10 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Captcha moduleKey="dealer_portal" />

                {errorMessage && (
                  <div className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/50 p-2.5 rounded-lg border border-red-200 dark:border-red-950">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 bg-[#D72626] hover:bg-opacity-90 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-red-500/10"
                >
                  {isPending ? 'Authenticating...' : 'Authenticate and Access Portal'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
