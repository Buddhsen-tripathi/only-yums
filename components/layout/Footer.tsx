import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/20 bg-background/50 backdrop-blur-xl">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="font-semibold tracking-tight">
              <span className="text-foreground">Only</span>
              <span className="text-primary">Yums</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover the best food, curated for you.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/cities" className="hover:text-foreground transition-colors">
                  Cities
                </Link>
              </li>
              <li>
                <Link href="/cities" className="hover:text-foreground transition-colors">
                  Places
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/sign-in" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>&copy; 2025 OnlyYums. All rights reserved.</p>
          <p>Crafted with care for food lovers.</p>
        </div>
      </div>
    </footer>
  );
}
