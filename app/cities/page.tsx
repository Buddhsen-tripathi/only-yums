import { supabaseServerClient } from "@/lib/supabase";
import type { City } from "@/lib/types";
import { CityGrid } from "@/components/cities/CityGrid";

export const dynamic = "force-dynamic";

export default async function CitiesPage() {
  const supabase = supabaseServerClient();
  
  let cities: City[] = [];

  try {
    const { data, error } = await supabase
      .from("cities")
      .select("id, name, slug, state, country, cover_image_url, created_at, updated_at")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading cities", error);
    } else {
      cities = (data ?? []) as City[];
    }
  } catch (error) {
    console.error("Error loading cities page:", error);
  }

  return (
    <div className="section-container space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Cities</h1>
        <p className="text-sm text-muted-foreground">
          Browse curated food spots across top US cities.
        </p>
      </header>

      <CityGrid cities={cities} />
    </div>
  );
}
