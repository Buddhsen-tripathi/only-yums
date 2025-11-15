import Link from "next/link";
import { supabaseServerClient } from "@/lib/supabase";
import type { City, Place } from "@/lib/types";
import { CityGrid } from "@/components/cities/CityGrid";
import { PlaceGrid } from "@/components/places/PlaceGrid";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
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

  return (
    <div className="space-y-16">
      <section className="section-container flex flex-col gap-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Curated, not crowded
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              The hottest food spots, without the endless scroll.
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              OnlyYums curates the most-loved restaurants, cafes, and late-night
              gems across top US cities so you can make every meal feel like a
              main event.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/cities" className="btn-primary">
              Explore cities
            </Link>
            <Link href="/sign-in" className="btn-secondary">
              Sign in to save favorites
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for food-obsessed locals, travelers, and late-night seekers.
          </p>
        </div>

        <div className="flex-1">
          <div className="card overflow-hidden">
            <div className="card-body grid grid-cols-2 gap-2 p-3 sm:p-4">
              <div className="space-y-2">
                <div className="h-32 rounded-2xl bg-[url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')] bg-cover bg-center" />
                <div className="h-32 rounded-2xl bg-[url('https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg')] bg-cover bg-center" />
              </div>
              <div className="space-y-2">
                <div className="h-40 rounded-2xl bg-[url('https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg')] bg-cover bg-center" />
                <div className="flex items-center gap-2 rounded-2xl bg-muted p-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium">Tonight in New York</p>
                    <p className="text-[11px] text-muted-foreground">
                      27 must-try spots trending with OnlyYums members.
                    </p>
                  </div>
                  <span className="tag-pill">NYC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Featured cities
            </h2>
            <p className="text-sm text-muted-foreground">
              Start with the cities our members are buzzing about.
            </p>
          </div>
          <Link href="/cities" className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline">
            View all
          </Link>
        </div>
        <CityGrid cities={cities} />
      </section>

      <section className="section-container space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Trending this week
            </h2>
            <p className="text-sm text-muted-foreground">
              Handpicked spots that OnlyYums members can&apos;t stop talking about.
            </p>
          </div>
          <Link href="/cities" className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline">
            Browse by city
          </Link>
        </div>
        <PlaceGrid places={featuredPlaces} />
      </section>
    </div>
  );
}
