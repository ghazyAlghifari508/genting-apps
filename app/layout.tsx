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
};

export const viewport: Viewport = {
  themeColor: "#7067CF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const dynamic = "force-dynamic";

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className="font-sans overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative z-10 w-full min-h-screen transition-colors duration-300">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
