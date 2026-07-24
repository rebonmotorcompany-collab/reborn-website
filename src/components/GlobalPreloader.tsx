'use client';

import React, { useState, useEffect } from 'react';

interface GlobalPreloaderProps {
  logoLoading?: string | null;
  siteNameFirst?: string;
  siteNameRest?: string;
  tagline?: string;
}

export function GlobalPreloader({
  logoLoading,
  siteNameFirst = 'REBON',
  siteNameRest = 'MOTOR COMPANY',
  tagline = 'POWERING THE FUTURE OF MOBILITY',
}: GlobalPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // If preloader has already run in this browser session, skip immediately
    if (typeof window !== 'undefined' && sessionStorage.getItem('rmc_preloaded') === 'true') {
      setVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFading(true);
          setTimeout(() => {
            setVisible(false);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('rmc_preloaded', 'true');
            }
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 20);

    // Ultimate fallback safety timer (max 400ms)
    const fallbackTimer = setTimeout(() => {
      clearInterval(interval);
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('rmc_preloaded', 'true');
        }
      }, 300);
    }, 400);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="global-preloader"
      style={{ opacity: fading ? 0 : 1 }}
      className="fixed inset-0 z-[9999] bg-neutral-950 flex flex-col items-center justify-center text-white p-6 transition-opacity duration-300 pointer-events-none select-none"
    >
      <div className="text-center max-w-lg space-y-6">
        {logoLoading ? (
          <img src={logoLoading} alt="Loading..." className="h-16 w-auto object-contain mx-auto animate-pulse" />
        ) : (
          <div className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white flex items-center justify-center whitespace-nowrap flex-nowrap animate-pulse">
            <span className="whitespace-nowrap">{siteNameFirst}</span>
            <span className="text-[#D72626] ml-2 whitespace-nowrap">{siteNameRest}</span>
          </div>
        )}
        <div className="space-y-2 max-w-sm mx-auto">
          <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D72626] rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
            <span>PRE-LOADING DESIGN SYSTEMS...</span>
            <span>{progress}%</span>
          </div>
        </div>
        <div className="text-[10px] text-neutral-600 font-mono tracking-widest uppercase">
          {tagline}
        </div>
      </div>
    </div>
  );
}
