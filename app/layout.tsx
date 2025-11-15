import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "OnlyYums",
  description: "Discover the best food places across top US cities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-background text-foreground">
          <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">{children}</main>

            <footer className="border-t bg-white/80">
              <div className="section-container flex items-center justify-between py-6 text-xs text-muted-foreground">
                <span>© {new Date().getFullYear()} OnlyYums</span>
                <span>Discover the best bites in every city.</span>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
