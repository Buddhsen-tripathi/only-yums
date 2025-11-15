import Link from "next/link";

export function HeroSection() {
  return (
    <section className="section-container flex flex-col gap-16 pt-16 md:flex-row md:items-center md:gap-20">
      <div className="flex-1 space-y-8">
        <div className="space-y-6">
          <div className="inline-block">
            <p className="text-xs font-medium text-primary uppercase tracking-widest">Curated experiences</p>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            Discover the best food, <span className="text-primary">curated</span>.
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
            OnlyYums finds the spots worth visiting. No algorithm, no noise—just the restaurants and cafes our members genuinely love.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link href="/cities" className="btn-primary px-6 py-3 text-base">
            Explore Cities
          </Link>
          <Link href="/sign-in" className="btn-secondary px-6 py-3 text-base">
            Sign In
          </Link>
        </div>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-[url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')] bg-cover bg-center shadow-lg" />
            <div className="aspect-square rounded-2xl bg-[url('https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg')] bg-cover bg-center shadow-lg" />
          </div>
          <div className="space-y-4 pt-8">
            <div className="aspect-square rounded-2xl bg-[url('https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg')] bg-cover bg-center shadow-lg" />
            <div className="aspect-square rounded-2xl bg-[url('https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg')] bg-cover bg-center shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
