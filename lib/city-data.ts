import type { SupabaseClient } from "@supabase/supabase-js";
import type { City, CityCuisineDetails, Place } from "@/lib/types";
import { groupVotesByCuisine, type VoteWithPlaceRow } from "@/lib/leaderboard";

export async function fetchCityData(supabase: SupabaseClient, slug: string) {
  const { data: cityData, error: cityError } = await supabase
    .from("cities")
    .select("id, name, slug, state, country, cover_image_url, created_at, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (cityError || !cityData) {
    return { city: null, cuisines: [], places: [], leaderboards: {} };
  }

  const city = cityData as City;

  const { data: placesData } = await supabase
    .from("places")
    .select(
      "id, city_id, name, slug, short_description, full_description, address, website_url, price_level, avg_rating, cover_image_url, is_featured, created_at, updated_at",
    )
    .eq("city_id", city.id);

  const places = (placesData ?? []) as Place[];

  const { data: cityCuisinesData } = await supabase
    .from("city_cuisines")
    .select(
      `
      city_id,
      cuisine_id,
      is_trending,
      sort_order,
      created_at,
      cuisines:cuisine_id (
        id,
        name,
        slug,
        emoji,
        description,
        created_at,
        updated_at
      )
    `,
    )
    .eq("city_id", city.id);

  const cuisines: CityCuisineDetails[] = (cityCuisinesData ?? []).map((row) => ({
    cuisine: (Array.isArray(row.cuisines) ? row.cuisines[0] : row.cuisines) as CityCuisineDetails["cuisine"],
    is_trending: row.is_trending as boolean,
    sort_order: row.sort_order as number,
  }));

  const { data: votesData } = await supabase
    .from("votes")
    .select(
      `
      cuisine_id,
      place_id,
      points,
      places:place_id (
        id,
        name,
        slug,
        short_description,
        cover_image_url,
        price_level
      )
    `,
    )
    .eq("city_id", city.id);

  const leaderboards = groupVotesByCuisine(
    (votesData ?? []).map((row) => ({
      cuisine_id: row.cuisine_id as string,
      place_id: row.place_id as string,
      points: row.points as number,
      places: (Array.isArray(row.places) ? row.places[0] : row.places) as VoteWithPlaceRow["places"],
    })) as VoteWithPlaceRow[],
  );

  return { city, cuisines, places, leaderboards };
}
