import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: {
    template: "%s | CollegeCompass",
    default: "CollegeCompass — College Discovery & Decision Platform",
  },
  description:
    "Explore, filter, compare, and predict college admissions with transparent structured data on fees, placements, rankings, and cutoffs across India.",
  keywords: [
    "Colleges in India",
    "Engineering Colleges",
    "College Comparison",
    "College Predictor",
    "College Fees",
    "Placements",
    "JEE Main",
    "MHT-CET",
  ],
  authors: [{ name: "CollegeCompass Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8f9fa] text-[#0f172a] antialiased selection:bg-slate-900 selection:text-white font-serif">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
