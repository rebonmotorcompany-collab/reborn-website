'use client';

import React, { useState } from 'react';
import { VisitingCardDesigner } from '@/components/admin/VisitingCardDesigner';
import { VisitingCardManager } from '@/components/admin/VisitingCardManager';
import {
  CreditCard,
  Layers,
  Sparkles,
  Settings,
  ArrowLeft,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function VisitingCardGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'designer' | 'manager'>('designer');
  const [editingCard, setEditingCard] = useState<any | null>(null);

  const handleEditCard = (card: any) => {
    setEditingCard(card);
    setActiveTab('designer');
  };

  const handleCreateNew = () => {
    setEditingCard(null);
    setActiveTab('designer');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/settings"
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-white transition-colors"
              title="Back to Settings"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-950/60 text-[#D72626]">
              <CreditCard size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black font-display text-neutral-900 dark:text-white uppercase tracking-tight">
                Visiting Card Generator
              </h1>
              <p className="text-xs text-neutral-500 font-light mt-0.5">
                Create double-sided corporate business cards with dynamic vCard QR codes, custom templates, and printable A4 layouts.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full sm:w-auto">
          <button
            onClick={handleCreateNew}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'designer'
                ? 'bg-[#D72626] text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={16} />
            <span>Card Designer Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('manager')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'manager'
                ? 'bg-[#D72626] text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Layers size={16} />
            <span>Saved Visiting Cards</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'designer' ? (
        <VisitingCardDesigner
          key={editingCard?.id || 'new'}
          initialData={editingCard}
          onSaved={() => setActiveTab('manager')}
        />
      ) : (
        <VisitingCardManager
          onEditCard={handleEditCard}
          onCreateNew={handleCreateNew}
        />
      )}
    </div>
  );
}
