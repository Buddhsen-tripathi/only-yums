"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="border-b border-border/20 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="section-container flex items-center justify-between py-2">
        <Link href="/" className="hover:opacity-80 transition-opacity inline-flex items-center">
          <Image src="/logo.png" alt="OnlyYums" width={80} height={24} className="h-6 w-auto" priority />
          <span className="sr-only">OnlyYums</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-8 text-xs sm:text-xs font-medium">
          <Link href="/cities" className="text-muted-foreground hover:text-foreground transition-colors">
            CITIES
          </Link>
          <Link href="/feed" className="text-muted-foreground hover:text-foreground transition-colors">
            FEED
          </Link>
          <SignedIn>
            <Link href="/feed/create" className="text-muted-foreground hover:text-foreground transition-colors">
              CREATE
            </Link>
            <Link href="/dashboard" className="hidden sm:inline text-muted-foreground hover:text-foreground transition-colors">
              DASHBOARD
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" className="text-muted-foreground hover:text-foreground transition-colors">
              SIGN IN
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-6 w-6" } }} />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
