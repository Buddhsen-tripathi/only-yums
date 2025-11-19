
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32 -mt-14">
      <div className="section-container relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Curated experiences for food lovers
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-foreground">
            Discover the best food, <br className="hidden md:block" />
            <span className="text-primary italic">curated</span> by humans.
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            OnlyYums finds the spots worth visiting.<br/> No algorithm, no noise but just the restaurants and cafes our members genuinely love.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            <Link href="/cities" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
              Explore Cities
            </Link>
            <Link href="/sign-in" className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg rounded-full border-2 hover:bg-secondary/80 transition-all duration-300">
              Join the Community
            </Link>
          </div>
        </div>

        {/* Decorative floating food images/elements could go here or in the background */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-90">
          <div className="aspect-[4/5] rounded-2xl bg-[url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')] bg-cover bg-center shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500"></div>
          <div className="aspect-[4/5] rounded-2xl bg-[url('https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg')] bg-cover bg-center shadow-2xl translate-y-8 rotate-[2deg] hover:rotate-0 transition-transform duration-500"></div>
          <div className="aspect-[4/5] rounded-2xl bg-[url('https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg')] bg-cover bg-center shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500"></div>
          <div className="aspect-[4/5] rounded-2xl bg-[url('https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg')] bg-cover bg-center shadow-2xl translate-y-8 rotate-[2deg] hover:rotate-0 transition-transform duration-500"></div>
        </div>
      </div>

      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
      </div>
    </section>
  );
}
