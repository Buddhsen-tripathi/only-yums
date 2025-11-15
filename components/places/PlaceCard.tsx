import Link from "next/link";
import type { Place } from "@/lib/types";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.id}`} className="card overflow-hidden flex flex-col">
      <div
        className="h-40 w-full bg-cover bg-center"
        style={{ backgroundImage: place.cover_image_url ? `url(${place.cover_image_url})` : undefined }}
      />
      <div className="card-body flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">{place.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {place.short_description}
            </p>
          </div>
          {place.price_level && (
            <span className="tag-pill text-[11px]">{place.price_level}</span>
          )}
        </div>
        {place.avg_rating != null && (
          <p className="text-xs text-muted-foreground">⭐ {place.avg_rating.toFixed(1)} avg rating</p>
        )}
      </div>
    </Link>
  );
}
