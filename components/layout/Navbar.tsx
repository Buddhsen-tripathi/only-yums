"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="section-container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            OY
          </span>
          <span className="text-xl font-semibold tracking-tight">OnlyYums</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/cities" className="hover:text-foreground">
            Cities
          </Link>
          <SignedIn>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" className="btn-secondary text-xs">
              Sign In
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
