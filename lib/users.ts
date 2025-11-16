import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppUser } from "@/lib/auth";

export async function getOrCreateDbUserId(supabase: SupabaseClient, user: AppUser): Promise<string | null> {
  const { data: dbUser, error: dbUserError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", user.clerkUserId)
    .maybeSingle();

  if (dbUserError) {
    console.error("Error loading user row", dbUserError);
    return null;
  }

  if (dbUser?.id) {
    return dbUser.id as string;
  }

  const { data: insertedUser, error: insertError } = await supabase
    .from("users")
    .insert({
      clerk_user_id: user.clerkUserId,
      display_name: user.displayName,
      role: user.role,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Error inserting user row", insertError);
    return null;
  }

  return insertedUser?.id ?? null;
}
