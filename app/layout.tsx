import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "GENTING - Cegah Stunting Sejak Dini",
  description: "Platform pencegahan stunting dengan AI, gamifikasi, dan telemedicine untuk mendampingi 1000 Hari Pertama Kehidupan",
  keywords: ["stunting", "kehamilan", "nutrisi", "kesehatan ibu", "bayi", "1000 HPK"],
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/logo-new.png",
    apple: "/logo-new.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F6856",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const dynamic = "force-dynamic";

import { Providers } from "@/components/providers/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className="font-sans overflow-x-hidden">
        <Providers>
          <main className="relative z-10 w-full min-h-screen transition-colors duration-300">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
