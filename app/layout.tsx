import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { BackgroundLines } from "@/components/ui/background-lines";
import { BackgroundBeams } from "@/components/ui/background-beams";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "GENTING - Cegah Stunting Sejak Dini",
  description: "Platform pencegahan stunting dengan AI, gamifikasi, dan telemedicine untuk mendampingi 1000 Hari Pertama Kehidupan",
  keywords: ["stunting", "kehamilan", "nutrisi", "kesehatan ibu", "bayi", "1000 HPK"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GENTING",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#7067CF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${jakarta.variable} font-sans overflow-x-hidden`}>
        <BackgroundLines className="bg-floral/50">
          <main className="relative z-10 w-full min-h-screen">
            {children}
          </main>
          <BackgroundBeams className="opacity-50" />
        </BackgroundLines>

        <Toaster />

        {/* Forced SW Purge & Cache Clear for Dev */}
        <Script
          id="force-sw-purge"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  for (let name of names) caches.delete(name);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
