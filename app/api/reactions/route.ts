import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdminClient } from "@/lib/supabase";
import { getOrCreateDbUserId } from "@/lib/users";
import { z } from "zod";

const reactionSchema = z.object({
  postId: z.string().uuid(),
  reactionType: z.enum(["like", "yum"]),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const supabase = supabaseAdminClient();

    const json = await req.json();
    const parseResult = reactionSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { postId, reactionType } = parseResult.data;

    const dbUserId = await getOrCreateDbUserId(supabase, user);
    if (!dbUserId) {
      return NextResponse.json({ error: "Unable to sync user" }, { status: 500 });
    }

    const { data: existing, error: selectError } = await supabase
      .from("post_reactions")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", dbUserId)
      .eq("reaction_type", reactionType)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking reaction", selectError);
      return NextResponse.json({ error: "Failed to toggle reaction" }, { status: 500 });
    }

    if (existing) {
      const { error: deleteError } = await supabase
        .from("post_reactions")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        console.error("Error removing reaction", deleteError);
        return NextResponse.json({ error: "Failed to toggle reaction" }, { status: 500 });
      }

      await supabase
        .from("posts")
        .update({ like_count: supabase.rpc("decrement_like_count", { post_id: postId }) })
        .eq("id", postId);

      return NextResponse.json({ reacted: false });
    }

    const { error: insertError } = await supabase.from("post_reactions").insert({
      post_id: postId,
      user_id: dbUserId,
      reaction_type: reactionType,
    });

    if (insertError) {
      console.error("Error adding reaction", insertError);
      return NextResponse.json({ error: "Failed to toggle reaction" }, { status: 500 });
    }

    return NextResponse.json({ reacted: true });
  } catch (error) {
    console.error("Unexpected error toggling reaction", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
