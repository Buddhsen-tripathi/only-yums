"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="border-b border-border/20 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="section-container flex items-center justify-between py-3">
        <Link href="/" className="hover:opacity-80 transition-opacity inline-flex items-center">
          <Image src="/logo.png" alt="OnlyYums" width={140} height={32} className="h-8 w-auto" priority />
          <span className="sr-only">OnlyYums</span>
        </Link>

        <nav className="flex items-center gap-8 text-xs font-medium">
          <Link href="/cities" className="text-muted-foreground hover:text-foreground transition-colors">
            CITIES
          </Link>
          <SignedIn>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              DASHBOARD
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" className="text-muted-foreground hover:text-foreground transition-colors">
              SIGN IN
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
