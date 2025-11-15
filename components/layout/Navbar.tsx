"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="border-b border-border/20 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="section-container flex items-center justify-between py-3">
        <Link href="/" className="font-semibold tracking-tight hover:opacity-70 transition-opacity">
          <span className="text-foreground">Only</span>
          <span className="text-primary">Yums</span>
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
