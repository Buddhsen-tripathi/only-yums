import type { Place } from "@/lib/types";
import { PlaceGrid } from "@/components/places/PlaceGrid";

interface TrendingSectionProps {
  places: Place[];
}

export function TrendingSection({ places }: TrendingSectionProps) {
  return (
    <section className="section-container space-y-12 pb-20">
      <div className="space-y-3">
        <p className="text-xs font-medium text-primary uppercase tracking-widest">What&apos;s hot</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Trending now</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          The spots everyone&apos;s talking about. Discover what&apos;s capturing hearts and taste buds.
        </p>
      </div>
      <PlaceGrid places={places} />
    </section>
  );
}
