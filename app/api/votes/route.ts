import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdminClient } from "@/lib/supabase";
import { voteSubmitSchema } from "@/lib/validators";
import { getOrCreateDbUserId } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const supabase = supabaseAdminClient();

    const json = await req.json();
    const parseResult = voteSubmitSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parseResult.error.flatten() }, { status: 400 });
    }

    const { cityId, cuisineId, votes } = parseResult.data;

    const dbUserId = await getOrCreateDbUserId(supabase, user);
    if (!dbUserId) {
      return NextResponse.json({ error: "Unable to sync user" }, { status: 500 });
    }

    const placeIds = votes.map((vote) => vote.placeId);

    const { data: placeMappings, error: placeMappingsError } = await supabase
      .from("place_cuisines")
      .select("place_id, cuisine_id, places!inner(city_id)")
      .in("place_id", placeIds);

    if (placeMappingsError) {
      console.error("Error validating places", placeMappingsError);
      return NextResponse.json({ error: "Failed to validate places" }, { status: 500 });
    }

    const isValidSet = placeIds.every((placeId) =>
      placeMappings?.some(
        (mapping) =>
          mapping.place_id === placeId &&
          mapping.cuisine_id === cuisineId &&
          (mapping as { places?: { city_id?: string } }).places?.city_id === cityId,
      ),
    );

    if (!isValidSet) {
      return NextResponse.json({ error: "One or more places are not valid for this city/cuisine" }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("user_id", dbUserId)
      .eq("city_id", cityId)
      .eq("cuisine_id", cuisineId);

    if (deleteError) {
      console.error("Error clearing previous votes", deleteError);
      return NextResponse.json({ error: "Failed to record votes" }, { status: 500 });
    }

    const insertPayload = votes.map((vote) => ({
      user_id: dbUserId,
      city_id: cityId,
      cuisine_id: cuisineId,
      place_id: vote.placeId,
      rank: vote.rank,
    }));

    const { error: insertError } = await supabase.from("votes").insert(insertPayload);

    if (insertError) {
      console.error("Error inserting votes", insertError);
      return NextResponse.json({ error: "Failed to record votes" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error submitting votes", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
