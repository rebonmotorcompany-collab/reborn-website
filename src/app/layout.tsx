import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "./ClientLayout";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  let settingsObj: Record<string, string | null> = {};
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            'site_name',
            'site_description',
            'seo_meta_title',
            'seo_meta_description',
            'seo_keywords',
            'seo_og_image',
            'seo_twitter_image',
            'seo_robots',
            'favicon',
            'app_icon',
            'seo_canonical_url'
          ]
        }
      }
    });
    settingsObj = settings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {} as Record<string, string | null>);
  } catch (e) {
    console.error("Failed to generate metadata:", e);
  }

  const title = settingsObj.seo_meta_title || settingsObj.site_name || "Rebon Motor Company (RMC) | Powering the Future of Mobility";
  const description = settingsObj.seo_meta_description || settingsObj.site_description || "";
  const favicon = settingsObj.favicon || "/favicon.ico";
  const appIcon = settingsObj.app_icon || "/favicon.ico";
  const robots = settingsObj.seo_robots || "index, follow";
  const keywords = settingsObj.seo_keywords || "";
  const canonicalUrl = settingsObj.seo_canonical_url || undefined;
  
  return {
    title,
    description,
    keywords,
    robots,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    icons: {
      icon: favicon,
      apple: appIcon,
    },
    openGraph: {
      title,
      description,
      images: settingsObj.seo_og_image ? [{ url: settingsObj.seo_og_image }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settingsObj.seo_twitter_image ? [settingsObj.seo_twitter_image] : undefined,
    }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settingsObj: Record<string, string | null> = {};
  let dbProducts: any[] = [];
  try {
    const settings = await prisma.setting.findMany();
    settingsObj = settings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {} as Record<string, string | null>);
    const rawDbProducts = await prisma.product.findMany({ where: { status: 'PUBLISHED' }, orderBy: { sortOrder: 'asc' } });
    dbProducts = rawDbProducts.map(p => ({
      ...p,
      price: p.price ? p.price.toString() : null
    }));
  } catch (e) {
    console.error("Failed to fetch global settings:", e);
  }

  const siteNameFirst = settingsObj.site_name ? settingsObj.site_name.split(' ')[0] : 'REBON';
  const siteNameRest = settingsObj.site_name ? settingsObj.site_name.split(' ').slice(1).join(' ') : 'MOTOR';
  const tagline = settingsObj.company_tagline || "POWERING THE FUTURE OF MOBILITY";

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Google Analytics Script */}
        {settingsObj.analytics_google && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settingsObj.analytics_google}`}></script>
            <script dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settingsObj.analytics_google}');
              `
            }} />
          </>
        )}
        
        {/* Google Tag Manager Container */}
        {settingsObj.analytics_gtm && (
          <script dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${settingsObj.analytics_gtm}');
            `
          }} />
        )}

        {/* Facebook Meta Pixel */}
        {settingsObj.analytics_pixel && (
          <script dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settingsObj.analytics_pixel}');
              fbq('track', 'PageView');
            `
          }} />
        )}

        {/* Microsoft Clarity Script */}
        {settingsObj.analytics_clarity && (
          <script dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${settingsObj.analytics_clarity}");
            `
          }} />
        )}

        {/* Structured Schema Markup (JSON-LD) */}
        {settingsObj.seo_schema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: settingsObj.seo_schema
          }} />
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Google Tag Manager (noscript fallback) */}
        {settingsObj.analytics_gtm && (
          <noscript dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${settingsObj.analytics_gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }} />
        )}
        <div suppressHydrationWarning dangerouslySetInnerHTML={{
          __html: `
            <div id="global-preloader" class="fixed inset-0 z-[9999] bg-neutral-950 flex flex-col items-center justify-center text-white p-6 transition-opacity duration-500 pointer-events-none">
              <div class="text-center max-w-sm space-y-6">
                ${
                  settingsObj.logo_loading
                    ? `<img src="${settingsObj.logo_loading}" alt="Loading..." class="h-16 w-auto object-contain mx-auto animate-pulse" />`
                    : `<div class="text-4xl font-black font-display tracking-tight text-white flex justify-center animate-pulse">
                         <span>${siteNameFirst}</span><span class="text-[#D72626] ml-2">${siteNameRest}</span>
                       </div>`
                }
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
                  ${tagline}
                </div>
              </div>
            </div>
            <script>
              (function() {
                var progress = 0;
                var interval = setInterval(function() {
                  var bar = document.getElementById('loader-progress');
                  var pct = document.getElementById('loader-percentage');
                  var preloader = document.getElementById('global-preloader');
                  
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
        <ClientLayout settings={settingsObj} products={dbProducts}>
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
