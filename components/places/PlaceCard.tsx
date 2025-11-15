import Link from "next/link";
import type { Place } from "@/lib/types";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.id}`} className="group overflow-hidden rounded-lg">
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="aspect-square w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: place.cover_image_url ? `url(${place.cover_image_url})` : undefined }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="font-semibold line-clamp-1">{place.name}</p>
          <p className="text-xs text-white/80 line-clamp-1 mt-1">
            {place.short_description}
          </p>
          <div className="flex items-center justify-between mt-2">
            {place.avg_rating != null && (
              <p className="text-xs">⭐ {place.avg_rating.toFixed(1)}</p>
            )}
            {place.price_level && (
              <span className="text-xs font-medium">{place.price_level}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
