import type { SupabaseClient } from "@supabase/supabase-js";
import type { DbUser, Post, PostMedia, Vote } from "@/lib/types";

export async function fetchProfileData(supabase: SupabaseClient, userId: string) {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, clerk_user_id, display_name, username, avatar_url, bio, role, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (userError || !user) {
    return { user: null, votes: [], posts: [], followers: 0, following: 0 };
  }

  const { data: votes } = await supabase
    .from("votes")
    .select("id, user_id, city_id, cuisine_id, place_id, rank, points, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const { data: posts } = await supabase
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
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("followee_id", userId);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  return {
    user: user as DbUser,
    votes: (votes ?? []) as Vote[],
    posts: (posts ?? []) as (Post & { post_media: PostMedia[] })[],
    followers: followersCount ?? 0,
    following: followingCount ?? 0,
  };
}
