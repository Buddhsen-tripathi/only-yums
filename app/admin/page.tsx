import { requireUser } from "@/lib/auth";
import { supabaseAdminClient } from "@/lib/supabase";

export default async function AdminPage() {
  await requireUser();
  const supabase = supabaseAdminClient();

  const { data: cuisines, error: cuisinesError } = await supabase
    .from("cuisines")
    .select("id, name, slug, emoji, description, created_at")
    .order("name");

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, user_id, caption, visibility, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="section-container space-y-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage cuisines, places, and moderate content.</p>
      </header>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cuisines</h2>
          <p className="text-sm text-muted-foreground">Manage food categories across cities.</p>
        </div>

        {cuisinesError ? (
          <p className="text-sm text-destructive">Error loading cuisines</p>
        ) : (
          <div className="space-y-2">
            {(cuisines ?? []).map((cuisine) => (
              <div key={cuisine.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {cuisine.emoji ? `${cuisine.emoji} ` : null}
                    {cuisine.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{cuisine.slug}</p>
                </div>
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground">
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Posts</h2>
          <p className="text-sm text-muted-foreground">Review and moderate community content.</p>
        </div>

        {postsError ? (
          <p className="text-sm text-destructive">Error loading posts</p>
        ) : (
          <div className="space-y-2">
            {(posts ?? []).map((post) => (
              <div key={post.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold line-clamp-1">{post.caption || "(No caption)"}</p>
                  <p className="text-xs text-muted-foreground">{post.visibility}</p>
                </div>
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground">
                  Review
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
