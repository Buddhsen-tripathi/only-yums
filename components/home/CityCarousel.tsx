import Link from "next/link";
import type { City } from "@/lib/types";

interface CityCarouselProps {
  cities: City[];
}

export function CityCarousel({ cities }: CityCarouselProps) {
  if (!cities.length) {
    return <p className="text-sm text-muted-foreground">No cities available yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map((city) => (
        <Link key={city.id} href={`/cities/${city.slug}`} className="group">
          <div className="space-y-3">
            <div
              className="aspect-video w-full rounded-2xl bg-cover bg-center shadow-md transition-transform group-hover:scale-105"
              style={{ backgroundImage: city.cover_image_url ? `url(${city.cover_image_url})` : undefined }}
            />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">{city.name}</h3>
              <p className="text-xs text-muted-foreground">
                {city.state}, {city.country}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
