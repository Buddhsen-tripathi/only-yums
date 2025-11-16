import { supabaseServerClient, supabaseAdminClient } from "@/lib/supabase";
import type { City, Post, PostMedia } from "@/lib/types";
import { HeroSection } from "@/components/home/HeroSection";
import { Divider } from "@/components/home/Divider";
import { CityCarousel } from "@/components/home/CityCarousel";
import { FeedGrid } from "@/components/feed/FeedGrid";

export const dynamic = "force-dynamic";

async function fetchLandingData() {
  const supabase = supabaseServerClient();
  const adminSupabase = supabaseAdminClient();

  let cities: City[] = [];
  let posts: (Post & { post_media: PostMedia[] })[] = [];

  try {
    const [{ data: citiesData, error: citiesError }, { data: postsData, error: postsError }] = await Promise.all([
      supabase
        .from("cities")
        .select("id, name, slug, state, country, cover_image_url, created_at, updated_at")
        .limit(6),
      adminSupabase
        .from("posts")
        .select(
          `
          id,
          user_id,
          city_id,
          place_id,
          caption,
          visibility,
          like_count,
          comment_count,
          created_at,
          updated_at,
          post_media (
            id,
            media_url,
            media_type,
            width,
            height,
            sort_order
          )
        `,
        )
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .limit(9),
    ]);

    if (citiesError) {
      console.error("Error loading cities:", citiesError);
    } else {
      cities = (citiesData ?? []) as City[];
    }

    if (postsError) {
      console.error("Error loading posts:", postsError);
    } else {
      posts = (postsData ?? []) as (Post & { post_media: PostMedia[] })[];
    }
  } catch (error) {
    console.error("Error loading landing page data:", error);
  }

  return { cities, posts };
}

export default async function LandingPage() {
  const { cities, posts } = await fetchLandingData();

  return (
    <div className="space-y-24">
      <HeroSection />
      <Divider />

      <section className="section-container space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Explore cities</h2>
          <p className="text-sm text-muted-foreground">Discover the best food spots in your favorite cities.</p>
        </div>
        <CityCarousel cities={cities} />
      </section>

      <Divider />

      <section className="section-container space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Latest from community</h2>
          <p className="text-sm text-muted-foreground">See what food lovers are sharing right now.</p>
        </div>
        <FeedGrid initialPosts={posts} />
      </section>
    </div>
  );
}
