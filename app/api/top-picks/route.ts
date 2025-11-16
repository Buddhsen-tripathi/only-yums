import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseServerClient } from "@/lib/supabase";
import { getOrCreateDbUserId } from "@/lib/users";
import { z } from "zod";

const topPicksCreateSchema = z.object({
  cityId: z.string().uuid(),
  cuisineId: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
  items: z
    .array(
      z.object({
        placeId: z.string().uuid(),
        rank: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      }),
    )
    .min(1)
    .max(3),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const supabase = supabaseServerClient();

    const json = await req.json();
    const parseResult = topPicksCreateSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parseResult.error.flatten() }, { status: 400 });
    }

    const { cityId, cuisineId, title, description, isPublic, items } = parseResult.data;

    const dbUserId = await getOrCreateDbUserId(supabase, user);
    if (!dbUserId) {
      return NextResponse.json({ error: "Unable to sync user" }, { status: 500 });
    }

    const { data: topPicks, error: topPicksError } = await supabase
      .from("top_picks")
      .insert({
        user_id: dbUserId,
        city_id: cityId,
        cuisine_id: cuisineId,
        title,
        description: description || null,
        is_public: isPublic,
      })
      .select("id")
      .single();

    if (topPicksError || !topPicks) {
      console.error("Error creating top picks", topPicksError);
      return NextResponse.json({ error: "Failed to create top picks" }, { status: 500 });
    }

    const itemsInserts = items.map((item) => ({
      top_picks_id: topPicks.id,
      place_id: item.placeId,
      rank: item.rank,
    }));

    const { error: itemsError } = await supabase.from("top_picks_items").insert(itemsInserts);

    if (itemsError) {
      console.error("Error inserting top picks items", itemsError);
      return NextResponse.json({ error: "Failed to save selections" }, { status: 500 });
    }

    return NextResponse.json({ topPicksId: topPicks.id, success: true });
  } catch (error) {
    console.error("Unexpected error creating top picks", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = supabaseServerClient();
    const url = new URL(req.url);
    const topPicksId = url.searchParams.get("id");

    if (!topPicksId) {
      return NextResponse.json({ error: "Top picks ID required" }, { status: 400 });
    }

    const { data: topPicks, error: topPicksError } = await supabase
      .from("top_picks")
      .select(
        `
        id,
        user_id,
        city_id,
        cuisine_id,
        title,
        description,
        is_public,
        created_at,
        updated_at,
        top_picks_items (
          id,
          place_id,
          rank,
          places (
            id,
            name,
            slug,
            short_description,
            cover_image_url,
            price_level
          )
        )
      `,
      )
      .eq("id", topPicksId)
      .maybeSingle();

    if (topPicksError || !topPicks) {
      return NextResponse.json({ error: "Top picks not found" }, { status: 404 });
    }

    return NextResponse.json(topPicks);
  } catch (error) {
    console.error("Unexpected error fetching top picks", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
