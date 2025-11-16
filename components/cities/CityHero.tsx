import type { City } from "@/lib/types";

interface CityHeroProps {
  city: City;
}

export function CityHero({ city }: CityHeroProps) {
  return (
    <section className="space-y-4">
      <div
        className="h-48 w-full rounded-3xl bg-cover bg-center shadow-inner"
        style={{ backgroundImage: city.cover_image_url ? `url(${city.cover_image_url})` : undefined }}
      />
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {city.state}, {city.country}
        </p>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">{city.name} playlists</h1>
          <p className="text-sm text-muted-foreground">Curated spots the community keeps voting to the top.</p>
        </div>
      </div>
    </section>
  );
}
