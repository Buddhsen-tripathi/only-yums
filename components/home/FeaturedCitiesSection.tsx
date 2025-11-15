import type { City } from "@/lib/types";
import { CityGrid } from "@/components/cities/CityGrid";

interface FeaturedCitiesSectionProps {
  cities: City[];
}

export function FeaturedCitiesSection({ cities }: FeaturedCitiesSectionProps) {
  return (
    <section className="section-container space-y-12">
      <div className="space-y-3">
        <p className="text-xs font-medium text-primary uppercase tracking-widest">Explore</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Featured cities</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Start your journey in these curated destinations where every meal tells a story.
        </p>
      </div>
      <CityGrid cities={cities} />
    </section>
  );
}
