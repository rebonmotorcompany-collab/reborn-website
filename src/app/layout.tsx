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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
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
