import { supabaseAdminClient } from "@/lib/supabase";
import type { Post, PostMedia } from "@/lib/types";
import { FeedGrid } from "@/components/feed/FeedGrid";

export const dynamic = "force-dynamic";

async function fetchInitialPosts() {
  const supabase = supabaseAdminClient();

  const { data: posts, error } = await supabase
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
    .limit(12);

  if (error) {
    console.error("Error fetching initial posts", error);
    return [];
  }

  return (posts ?? []) as (Post & { post_media: PostMedia[] })[];
}

export default async function FeedPage() {
  const initialPosts = await fetchInitialPosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl">
        <header className="sticky top-14 z-40 border-b border-border/20 bg-background/80 backdrop-blur-sm px-4 py-3">
          <h1 className="text-lg font-semibold">Feed</h1>
        </header>

        <FeedGrid initialPosts={initialPosts} />
      </div>
    </div>
  );
}
