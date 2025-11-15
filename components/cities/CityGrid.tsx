import type { City } from "@/lib/types";
import { CityCard } from "./CityCard";

interface CityGridProps {
  cities: City[];
}

export function CityGrid({ cities }: CityGridProps) {
  if (!cities.length) {
    return <p className="text-sm text-muted-foreground">No cities found yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map((city) => (
        <CityCard key={city.id} city={city} />
      ))}
    </div>
  );
}
