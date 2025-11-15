import { supabaseServerClient } from "@/lib/supabase";
import type { City, Place } from "@/lib/types";
import { HeroSection } from "@/components/home/HeroSection";
import { Divider } from "@/components/home/Divider";
import { FeaturedCitiesSection } from "@/components/home/FeaturedCitiesSection";
import { TrendingSection } from "@/components/home/TrendingSection";

export const dynamic = "force-dynamic";

async function fetchLandingData() {
  const supabase = supabaseServerClient();
  let cities: City[] = [];
  let featuredPlaces: Place[] = [];

  try {
    const [{ data: citiesData, error: citiesError }, { data: placesData, error: placesError }] = await Promise.all([
      supabase
        .from("cities")
        .select("id, name, slug, state, country, cover_image_url, created_at, updated_at")
        .limit(3),
      supabase
        .from("places")
        .select(
          "id, city_id, name, slug, short_description, full_description, address, website_url, price_level, avg_rating, cover_image_url, is_featured, created_at, updated_at",
        )
        .eq("is_featured", true)
        .order("avg_rating", { ascending: false })
        .limit(6),
    ]);

    if (citiesError) {
      console.error("Error loading cities:", citiesError);
    } else {
      cities = (citiesData ?? []) as City[];
    }

    if (placesError) {
      console.error("Error loading featured places:", placesError);
    } else {
      featuredPlaces = (placesData ?? []) as Place[];
    }
  } catch (error) {
    console.error("Error loading landing page data:", error);
  }

  return { cities, featuredPlaces };
}

export default async function LandingPage() {
  const { cities, featuredPlaces } = await fetchLandingData();

  return (
    <div className="space-y-24">
      <HeroSection />
      <Divider />
      <FeaturedCitiesSection cities={cities} />
      <TrendingSection places={featuredPlaces} />
    </div>
  );
}
