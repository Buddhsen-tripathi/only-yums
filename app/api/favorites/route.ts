import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase";
import { favoriteToggleSchema } from "@/lib/validators";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireUser();
  const supabase = supabaseServerClient();

  const json = await req.json();
  const parseResult = favoriteToggleSchema.safeParse(json);

  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { placeId } = parseResult.data;

  // Ensure we have a corresponding users row in Supabase.
  const { data: existingUser, error: userSelectError } = await supabase
    .from("users")
    .select("id, role")
    .eq("clerk_user_id", user.clerkUserId)
    .maybeSingle();

  if (userSelectError) {
    console.error("Error loading user row", userSelectError);
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }

  let dbUserId = existingUser?.id as string | undefined;

  if (!dbUserId) {
    const { data: insertedUser, error: insertError } = await supabase
      .from("users")
      .insert({
        clerk_user_id: user.clerkUserId,
        display_name: user.displayName,
        role: user.role,
      })
      .select("id")
      .single();

    if (insertError || !insertedUser) {
      console.error("Error inserting user row", insertError);
      return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
    }

    dbUserId = insertedUser.id;
  }

  const { data: existingFavorite, error: favoriteSelectError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", dbUserId)
    .eq("place_id", placeId)
    .maybeSingle();

  if (favoriteSelectError && favoriteSelectError.code !== "PGRST116") {
    console.error("Error checking favorite", favoriteSelectError);
    return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
  }

  if (existingFavorite) {
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existingFavorite.id);

    if (deleteError) {
      console.error("Error removing favorite", deleteError);
      return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
    }

    return NextResponse.json({ favorited: false });
  }

  const { error: insertFavoriteError } = await supabase
    .from("favorites")
    .insert({ user_id: dbUserId, place_id: placeId });

  if (insertFavoriteError) {
    console.error("Error adding favorite", insertFavoriteError);
    return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
  }

  return NextResponse.json({ favorited: true });
}
