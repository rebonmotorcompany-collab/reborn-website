'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  lang: string;
  setLang: (lang: string) => void;
  openQuoteModal: (productName?: string) => void;
  settings: Record<string, string | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children, settings = {} }: { children: React.ReactNode, settings?: Record<string, string | null> }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<string>('en');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState('');

  // Sync theme with HTML document class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const openQuoteModal = (productName?: string) => {
    setSelectedProductForQuote(productName || 'Rebon E-Volt X');
    setQuoteModalOpen(true);
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, lang, setLang, openQuoteModal, settings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
