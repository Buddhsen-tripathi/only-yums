import { notFound } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase";
import { fetchCityData } from "@/lib/city-data";
import { CityHero } from "@/components/cities/CityHero";
import { CuisineLeaderboards } from "@/components/cities/CuisineLeaderboards";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const supabase = supabaseServerClient();
  const { slug } = await params;

  try {
    const { city, cuisines, places, leaderboards } = await fetchCityData(supabase, slug);

    if (!city) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <CityHero city={city} />

        <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Cuisines</h2>
            <p className="text-sm text-muted-foreground">Vote for your top 3 in each category</p>
          </div>
          <CuisineLeaderboards cuisines={cuisines} leaderboards={leaderboards} places={places} cityId={city.id} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading city page:", error);
    notFound();
  }
}
