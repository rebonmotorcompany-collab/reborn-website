import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rebon Motor Company (RMC) | Powering the Future of Mobility",
  description: "Rebon Motor Company (RMC) is Pakistan's premier manufacturer of advanced electric and petrol vehicles. Discover our flagship E-Volt X and smart mobility solutions.",
  openGraph: {
    title: "Rebon Motor Company (RMC)",
    description: "Powering the future of mobility with advanced electric and petrol vehicles in Pakistan.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div suppressHydrationWarning dangerouslySetInnerHTML={{
          __html: `
            <div id="global-preloader" class="fixed inset-0 z-[9999] bg-neutral-950 flex flex-col items-center justify-center text-white p-6 transition-opacity duration-500 pointer-events-none">
              <div class="text-center max-w-sm space-y-6">
                <div class="text-4xl font-black font-display tracking-tight text-white flex justify-center animate-pulse">
                  <span>REBON </span><span class="text-[#D72626] ml-2">MOTOR</span>
                </div>
                <div class="space-y-2">
                  <div class="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div class="h-full bg-[#D72626] rounded-full transition-all duration-75" style="width: 0%" id="loader-progress"></div>
                  </div>
                  <div class="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                    <span>PRE-LOADING DESIGN SYSTEMS...</span>
                    <span id="loader-percentage">0%</span>
                  </div>
                </div>
                <div class="text-[10px] text-neutral-600 font-mono tracking-widest uppercase">
                  POWERING THE FUTURE OF MOBILITY
                </div>
              </div>
            </div>
            <script>
              (function() {
                var progress = 0;
                var bar = document.getElementById('loader-progress');
                var pct = document.getElementById('loader-percentage');
                var preloader = document.getElementById('global-preloader');
                var interval = setInterval(function() {
                  progress += 4;
                  if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(function() {
                      if (preloader) {
                        preloader.style.opacity = '0';
                        setTimeout(function() { preloader.remove(); }, 500);
                      }
                    }, 300);
                  }
                  if (bar) bar.style.width = progress + '%';
                  if (pct) pct.innerText = progress + '%';
                }, 40);
              })();
            </script>
          `
        }} />
        <ClientLayout>
          {children}
        </ClientLayout>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const chromane = document.getElementById('chromane-theme-root');
              if (chromane) chromane.remove();
            `
          }}
        />
      </body>
    </html>
  );
}
