import Link from "next/link";
import type { City } from "@/lib/types";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/cities/${city.slug}`} className="group overflow-hidden rounded-lg">
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="aspect-square w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: city.cover_image_url ? `url(${city.cover_image_url})` : undefined }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="font-semibold">{city.name}</p>
          <p className="text-xs text-white/80">
            {city.state}
          </p>
        </div>
      </div>
    </Link>
  );
}
