import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdminClient } from "@/lib/supabase";
import { getOrCreateDbUserId } from "@/lib/users";
import { z } from "zod";

const followSchema = z.object({
  followeeId: z.string().uuid(),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const supabase = supabaseAdminClient();

    const json = await req.json();
    const parseResult = followSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { followeeId } = parseResult.data;

    const dbUserId = await getOrCreateDbUserId(supabase, user);
    if (!dbUserId) {
      return NextResponse.json({ error: "Unable to sync user" }, { status: 500 });
    }

    if (dbUserId === followeeId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const { data: existing, error: selectError } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", dbUserId)
      .eq("followee_id", followeeId)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking follow", selectError);
      return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 });
    }

    if (existing) {
      const { error: deleteError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", dbUserId)
        .eq("followee_id", followeeId);

      if (deleteError) {
        console.error("Error removing follow", deleteError);
        return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 });
      }

      return NextResponse.json({ following: false });
    }

    const { error: insertError } = await supabase.from("follows").insert({
      follower_id: dbUserId,
      followee_id: followeeId,
    });

    if (insertError) {
      console.error("Error adding follow", insertError);
      return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 });
    }

    return NextResponse.json({ following: true });
  } catch (error) {
    console.error("Unexpected error toggling follow", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
