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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map((city) => (
        <Link key={city.id} href={`/cities/${city.slug}`} className="group relative block overflow-hidden rounded-3xl bg-muted/30">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: city.cover_image_url ? `url(${city.cover_image_url})` : undefined }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 transition-opacity group-hover:opacity-70" />
          </div>

          <div className="absolute bottom-0 left-0 p-6 text-white">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/80">
              {city.state}, {city.country}
            </p>
            <h3 className="font-serif text-2xl font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform duration-300">
              {city.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
