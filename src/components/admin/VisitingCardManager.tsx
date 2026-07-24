'use client';

import React, { useState, useEffect } from 'react';
import { VisitingCardPreview } from './VisitingCardPreview';
import { VisitingCardPrint } from './VisitingCardPrint';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Printer,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface VisitingCardManagerProps {
  onEditCard: (card: any) => void;
  onCreateNew: () => void;
}

export const VisitingCardManager: React.FC<VisitingCardManagerProps> = ({
  onEditCard,
  onCreateNew,
}) => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [previewCard, setPreviewCard] = useState<any | null>(null);
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/visiting-cards${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCards(data.data);
      }
    } catch (e) {
      console.error('Failed to load visiting cards:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this visiting card?')) return;
    try {
      const res = await fetch(`/api/visiting-cards/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCards(prev => prev.filter(c => c.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete card:', e);
    }
  };

  const handleDuplicate = async (card: any) => {
    try {
      const payload = { ...card, cardName: `${card.fullName} (Copy)`, id: undefined };
      const res = await fetch('/api/visiting-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        fetchCards();
      }
    } catch (e) {
      console.error('Failed to duplicate card:', e);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(cards.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handlePrintCard = () => {
    const printElem = document.getElementById('printable-visiting-card-area');
    if (!printElem) {
      window.print();
      return;
    }

    const printWin = window.open('', '_blank', 'width=950,height=800');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm 0mm;
            }
            html, body {
              background-color: #0F0F11 !important;
              color: #FFFFFF !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              min-height: 100vh !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              font-family: sans-serif;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            /* Grid Centered Layout for A4 Physical Printing */
            .printable-grid-container {
              display: grid !important;
              grid-template-rows: auto auto !important;
              justify-content: center !important;
              align-content: center !important;
              gap: 15mm !important;
              width: 100% !important;
              margin: auto !important;
            }
            .card-print-frame {
              box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
              border: 1px solid rgba(255, 255, 255, 0.15) !important;
            }
          </style>
        </head>
        <body>
          ${printElem.innerHTML}
          <script>
            document.title = "";
            setTimeout(function() {
              window.print();
              window.close();
            }, 450);
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search saved cards by name, designation, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchCards()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm text-neutral-900 dark:text-white focus:border-[#D72626] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedIds.length > 0 && (
            <button
              onClick={handlePrintCard}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2"
            >
              <Printer size={14} />
              <span>Bulk Print ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 rounded-xl bg-[#D72626] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Plus size={16} />
            <span>Create New Visiting Card</span>
          </button>
        </div>
      </div>

      {/* Cards Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#D72626] mb-2" size={32} />
            <span>Loading visiting cards...</span>
          </div>
        ) : cards.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">No Saved Cards Found</p>
            <p className="text-xs mb-4">Design corporate cards for employees or dealers using the Card Designer studio.</p>
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-[#D72626] text-white rounded-xl text-xs font-bold"
            >
              Launch Designer Studio
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === cards.length && cards.length > 0}
                      onChange={handleSelectAll}
                      className="rounded accent-[#D72626]"
                    />
                  </th>
                  <th className="p-4">Card / Employee Name</th>
                  <th className="p-4">Designation & Department</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">QR Type</th>
                  <th className="p-4">Date Created</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
                {cards.map(card => (
                  <tr key={card.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(card.id)}
                        onChange={() => handleToggleSelect(card.id)}
                        className="rounded accent-[#D72626]"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-neutral-900 dark:text-white">{card.fullName}</div>
                      <div className="text-[11px] text-neutral-500 font-medium">{card.cardName}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200">{card.designation || 'N/A'}</div>
                      <div className="text-[11px] text-neutral-500">{card.department || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-neutral-700 dark:text-neutral-300">{card.email}</div>
                      <div className="text-neutral-500 text-[11px]">{card.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-[#D72626] font-bold text-[10px] uppercase">
                        {card.qrCodeType || 'VCARD'}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewCard(card)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-white"
                          title="Live Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onEditCard(card)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-blue-600"
                          title="Edit Card"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(card.id)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-amber-600"
                          title="Duplicate Card"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-red-600"
                          title="Delete Card"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRINT-ONLY CONTAINER FOR SAVED CARDS */}
      <div id="printable-visiting-card-area">
        {previewCard ? (
          <VisitingCardPrint cardData={previewCard} sizePreset="ISO" />
        ) : (
          cards
            .filter(c => selectedIds.includes(c.id))
            .map(c => (
              <VisitingCardPrint key={c.id} cardData={c} sizePreset="ISO" />
            ))
        )}
      </div>

      {/* Preview Modal Dialog */}
      {previewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 text-white w-full max-w-xl rounded-3xl p-6 relative shadow-2xl">
            <button
              onClick={() => setPreviewCard(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{previewCard.fullName}</h3>
              <button
                onClick={() => setPreviewSide(s => (s === 'front' ? 'back' : 'front'))}
                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-full"
              >
                Flip to {previewSide === 'front' ? 'Back' : 'Front'}
              </button>
            </div>

            <div className="py-6 flex justify-center bg-neutral-950 rounded-2xl border border-neutral-800">
              <VisitingCardPreview cardData={previewCard} side={previewSide} scale={0.9} />
            </div>

            <div className="mt-6 flex justify-between items-center gap-2">
              <button
                onClick={handlePrintCard}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <Printer size={14} />
                <span>Print Card Only</span>
              </button>
              <button
                onClick={() => { setPreviewCard(null); onEditCard(previewCard); }}
                className="px-4 py-2 bg-[#D72626] text-white font-bold text-xs rounded-xl"
              >
                Edit in Designer Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
