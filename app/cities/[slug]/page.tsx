import { notFound } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase";
import type { City, Place } from "@/lib/types";
import { PlaceGrid } from "@/components/places/PlaceGrid";

interface CityPageProps {
  params: { slug: string };
}

export default async function CityPage({ params }: CityPageProps) {
  const supabase = supabaseServerClient();

  const { data: cityData } = await supabase
    .from("cities")
    .select("id, name, slug, state, country, cover_image_url, created_at, updated_at")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!cityData) {
    notFound();
  }

  const city = cityData as City;

  const { data: placesData } = await supabase
    .from("places")
    .select(
      "id, city_id, name, slug, short_description, full_description, address, website_url, price_level, avg_rating, cover_image_url, is_featured, created_at, updated_at",
    )
    .eq("city_id", city.id)
    .order("is_featured", { ascending: false })
    .order("avg_rating", { ascending: false });

  const places = (placesData ?? []) as Place[];

  return (
    <div className="section-container space-y-8">
      <section className="space-y-4">
        <div
          className="h-40 w-full rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: city.cover_image_url ? `url(${city.cover_image_url})` : undefined }}
        />
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {city.state}, {city.country}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Best of {city.name}</h1>
          <p className="text-sm text-muted-foreground">
            Curated spots locals keep coming back to.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Spots in this city
          </h2>
        </div>
        <PlaceGrid places={places} />
      </section>
    </div>
  );
}
