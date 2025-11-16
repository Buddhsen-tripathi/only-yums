import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdminClient } from "@/lib/supabase";
import { postCreateSchema, postMediaSchema } from "@/lib/validators";
import { getOrCreateDbUserId } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const supabase = supabaseAdminClient();

    const json = await req.json();
    const { caption, visibility, cityId, placeId, media } = json;

    const parseResult = postCreateSchema.safeParse({ caption, visibility, cityId, placeId });
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parseResult.error.flatten() }, { status: 400 });
    }

    if (!media || !Array.isArray(media) || media.length === 0) {
      return NextResponse.json({ error: "At least one media item is required" }, { status: 400 });
    }

    const mediaParseResults = media.map((m: Record<string, unknown> | unknown) => postMediaSchema.safeParse(m as Record<string, unknown>));
    if (mediaParseResults.some((r) => !r.success)) {
      return NextResponse.json({ error: "Invalid media items" }, { status: 400 });
    }

    const dbUserId = await getOrCreateDbUserId(supabase, user);
    if (!dbUserId) {
      return NextResponse.json({ error: "Unable to sync user" }, { status: 500 });
    }

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: dbUserId,
        city_id: cityId || null,
        place_id: placeId || null,
        caption: caption || null,
        visibility,
      })
      .select("id")
      .single();

    if (postError || !post) {
      console.error("Error creating post", postError);
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }

    const mediaInserts = media.map((m: Record<string, unknown>, idx: number) => ({
      post_id: post.id,
      media_url: m.mediaUrl as string,
      media_type: (m.mediaType as string | undefined) || "image",
      width: (m.width as number | null | undefined) || null,
      height: (m.height as number | null | undefined) || null,
      sort_order: idx,
    }));

    const { error: mediaError } = await supabase.from("post_media").insert(mediaInserts);

    if (mediaError) {
      console.error("Error inserting media", mediaError);
      return NextResponse.json({ error: "Failed to attach media" }, { status: 500 });
    }

    return NextResponse.json({ postId: post.id, success: true });
  } catch (error) {
    console.error("Unexpected error creating post", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = supabaseAdminClient();
    const url = new URL(req.url);
    const cityId = url.searchParams.get("cityId");
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    let query = supabase
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
        { count: "exact" },
      )
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    if (cityId) {
      query = query.eq("city_id", cityId as string);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: posts, error: postsError, count } = await query;

    if (postsError) {
      console.error("Error fetching posts", postsError);
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }

    return NextResponse.json({ posts: posts ?? [], total: count ?? 0 });
  } catch (error) {
    console.error("Unexpected error fetching posts", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
