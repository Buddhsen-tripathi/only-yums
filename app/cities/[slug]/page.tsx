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
      <div className="section-container space-y-12">
        <CityHero city={city} />

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Trending cuisines</h2>
            <p className="text-sm text-muted-foreground">Vote for your favorites and help rank the best spots.</p>
          </div>
          <CuisineLeaderboards cuisines={cuisines} leaderboards={leaderboards} places={places} cityId={city.id} />
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error loading city page:", error);
    notFound();
  }
}
