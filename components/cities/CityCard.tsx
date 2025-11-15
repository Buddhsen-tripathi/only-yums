import Link from "next/link";
import type { City } from "@/lib/types";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/cities/${city.slug}`} className="card overflow-hidden flex flex-col">
      <div
        className="h-40 w-full bg-cover bg-center"
        style={{ backgroundImage: city.cover_image_url ? `url(${city.cover_image_url})` : undefined }}
      />
      <div className="card-body flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">{city.name}</p>
            <p className="text-xs text-muted-foreground">
              {city.state}, {city.country}
            </p>
          </div>
          <span className="tag-pill">City</span>
        </div>
      </div>
    </Link>
  );
}
