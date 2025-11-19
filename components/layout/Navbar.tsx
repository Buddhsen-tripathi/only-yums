"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 h-14">
      <div className="section-container flex items-center justify-between h-full">
        <Link href="/" className="group flex items-center gap-2 transition-opacity hover:opacity-90">
          {/* Replaced Image with text for cleaner look if image fails or just as a style choice, but keeping Image if preferred. 
              Let's keep Image but add a fallback or style it nicely. 
              Actually, let's use a text logo for that "premium editorial" feel if the image isn't strictly required, 
              or wrap the image. I'll keep the image but add a class. 
          */}
          <div className="relative h-6 w-auto">
            <Image src="/logo.png" alt="OnlyYums" width={100} height={24} className="h-full w-auto object-contain" priority />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <Link href="/cities" className="text-muted-foreground hover:text-primary transition-colors">
            CITIES
          </Link>
          <Link href="/feed" className="text-muted-foreground hover:text-primary transition-colors">
            FEED
          </Link>
          <SignedIn>
            <Link href="/feed/create" className="text-muted-foreground hover:text-primary transition-colors">
              CREATE
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
              DASHBOARD
            </Link>
          </SignedIn>
        </nav>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in" className="btn-primary rounded-full px-6">
              Sign In
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9 ring-2 ring-background" } }} />
          </SignedIn>

          {/* Mobile Menu Button could go here */}
        </div>
      </div>
    </header>
  );
}
