import React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OnlyYums - Discover Curated Food Spots Across Top US Cities",
  description:
    "OnlyYums finds the best restaurants, cafes, and food spots worth visiting. Curated recommendations from our members—no algorithm, no noise. Explore cities and discover hidden gems.",
  keywords: [
    "restaurants",
    "food discovery",
    "curated dining",
    "food recommendations",
    "best restaurants",
    "food spots",
    "dining guide",
    "local restaurants",
    "food lovers",
  ],
  authors: [{ name: "OnlyYums" }],
  creator: "OnlyYums",
  publisher: "OnlyYums",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://onlyyums.com",
    siteName: "OnlyYums",
    title: "OnlyYums - Discover Curated Food Spots",
    description:
      "Find the best restaurants and food spots across top US cities. Curated by our community of food lovers.",
    images: [
      {
        url: "https://onlyyums.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "OnlyYums - Curated Food Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnlyYums - Discover Curated Food Spots",
    description:
      "Find the best restaurants and food spots across top US cities. Curated by our community of food lovers.",
    creator: "@onlyyums",
    images: ["https://onlyyums.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
  alternates: {
    canonical: "https://onlyyums.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className="min-h-screen bg-background text-foreground font-sans antialiased">
          <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
