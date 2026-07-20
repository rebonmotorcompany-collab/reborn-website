'use client';

import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import MediaLibrary from './MediaLibrary';

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  allowedTypes?: string[];
  placeholder?: string;
}

export default function MediaPicker({ value, onChange, allowedTypes, placeholder = 'Paste image URL or choose...' }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (url: string) => {
    onChange(url);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-805 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ImageIcon size={14} />
          <span>Choose File</span>
        </button>
      </div>

      {/* Quick visual preview of selected item */}
      {value && (
        <div className="relative group w-28 aspect-video rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50 flex items-center justify-center">
          {value.match(/\.(mp4|webm|ogg)$/i) || value.includes('video') ? (
            <video src={value} className="w-full h-full object-cover" />
          ) : value.match(/\.(pdf)$/i) ? (
            <span className="text-[10px] text-neutral-400 font-bold">PDF Document</span>
          ) : (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={10} />
          </button>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-950 w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-850 flex flex-col relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-700"
            >
              <X size={16} />
            </button>

            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/20 pr-16">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Select Media Asset</h3>
                <p className="text-[10px] text-neutral-400 font-medium">Double-click or click Choose to select a file from the repository</p>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <MediaLibrary
                mode="select"
                onSelect={handleSelect}
                allowedTypes={allowedTypes}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
