import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdminClient } from "@/lib/supabase";
import { getOrCreateDbUserId } from "@/lib/users";
import { uploadImageToR2 } from "@/lib/r2";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const supabase = supabaseAdminClient();

    const formData = await req.formData();
    const caption = formData.get("caption") as string | null;
    const visibility = (formData.get("visibility") as "public" | "friends") || "public";

    const mediaFiles = formData.getAll("media[]") as File[];

    if (!mediaFiles || mediaFiles.length === 0) {
      return NextResponse.json({ error: "At least one media file is required" }, { status: 400 });
    }

    if (mediaFiles.length > 5) {
      return NextResponse.json({ error: "Maximum 5 images per post" }, { status: 400 });
    }

    const dbUserId = await getOrCreateDbUserId(supabase, user);
    if (!dbUserId) {
      return NextResponse.json({ error: "Unable to sync user" }, { status: 500 });
    }

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: dbUserId,
        caption: caption || null,
        visibility,
      })
      .select("id")
      .single();

    if (postError || !post) {
      console.error("Error creating post", postError);
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }

    const mediaInserts = [];

    for (let idx = 0; idx < mediaFiles.length; idx++) {
      const file = mediaFiles[idx];
      const buffer = Buffer.from(await file.arrayBuffer());

      try {
        const mediaUrl = await uploadImageToR2({
          buffer,
          contentType: file.type,
          folder: `posts/${post.id}`,
        });

        mediaInserts.push({
          post_id: post.id,
          media_url: mediaUrl,
          media_type: "image",
          sort_order: idx,
        });
      } catch (uploadError) {
        console.error("Error uploading media", uploadError);
        return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
      }
    }

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
