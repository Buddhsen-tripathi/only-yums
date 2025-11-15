import { supabaseServerClient } from "@/lib/supabase";
import { requireUser } from "@/lib/auth";
import type { Place, Submission } from "@/lib/types";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = supabaseServerClient();

  // Ensure Supabase user row exists
  const { data: dbUser, error: dbUserError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", user.clerkUserId)
    .maybeSingle();

  if (dbUserError) {
    console.error("Error loading dashboard user", dbUserError);
  }

  let dbUserId = dbUser?.id as string | undefined;

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

    if (insertError) {
      console.error("Error inserting dashboard user", insertError);
    } else {
      dbUserId = insertedUser?.id;
    }
  }

  let favoritePlaces: Place[] = [];
  let submissions: Submission[] = [];

  if (dbUserId) {
    const { data: favoritesData } = await supabase
      .from("favorites")
      .select("place_id")
      .eq("user_id", dbUserId);

    const placeIds = (favoritesData ?? []).map((f) => f.place_id as string);

    if (placeIds.length) {
      const { data: placesData } = await supabase
        .from("places")
        .select(
          "id, city_id, name, slug, short_description, full_description, address, website_url, price_level, avg_rating, cover_image_url, is_featured, created_at, updated_at",
        )
        .in("id", placeIds);

      favoritePlaces = (placesData ?? []) as Place[];
    }

    const { data: submissionsData } = await supabase
      .from("submissions")
      .select("id, user_id, city_id, place_name, details, status, created_at, updated_at")
      .eq("user_id", dbUserId)
      .order("created_at", { ascending: false });

    submissions = (submissionsData ?? []) as Submission[];
  }

  return (
    <div className="section-container space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">Hey, {user.displayName}</h1>
        <p className="text-sm text-muted-foreground">
          View your saved spots and track the places you&apos;ve suggested to OnlyYums.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card flex flex-col">
          <div className="card-header">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Favorites
              </h2>
              <p className="text-xs text-muted-foreground">
                Your saved spots across all cities.
              </p>
            </div>
          </div>
          <div className="card-body space-y-3">
            {favoritePlaces.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You haven&apos;t saved any places yet. Explore cities and tap the star to save your favorites.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {favoritePlaces.map((place) => (
                  <li key={place.id} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{place.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {place.short_description}
                      </p>
                    </div>
                    <span className="tag-pill text-[11px]">{place.price_level}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="card flex flex-col">
          <div className="card-header">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Submissions
              </h2>
              <p className="text-xs text-muted-foreground">
                Spots you&apos;ve suggested for OnlyYums.
              </p>
            </div>
          </div>
          <div className="card-body space-y-3">
            {submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You haven&apos;t submitted any places yet. Soon you&apos;ll be able to suggest your favorite hidden gems.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {submissions.map((submission) => (
                  <li key={submission.id} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{submission.place_name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {submission.details}
                      </p>
                    </div>
                    <span className="tag-pill text-[11px] uppercase">
                      {submission.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
