import type { Place, City } from "@/lib/types";

interface PlaceHeaderProps {
  place: Place;
  city: City;
}

export function PlaceHeader({ place, city }: PlaceHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{city.name}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{place.name}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="tag-pill">{place.price_level}</span>
        {place.avg_rating != null && <span>⭐ {place.avg_rating.toFixed(1)} avg rating</span>}
        <span>{place.address}</span>
        {place.website_url && (
          <a
            href={place.website_url}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Website
          </a>
        )}
      </div>
    </section>
  );
}
