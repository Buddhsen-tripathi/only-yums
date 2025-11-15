import type { Place } from "@/lib/types";
import { PlaceCard } from "./PlaceCard";

interface PlaceGridProps {
  places: Place[];
}

export function PlaceGrid({ places }: PlaceGridProps) {
  if (!places.length) {
    return <p className="text-sm text-muted-foreground">No places added yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
