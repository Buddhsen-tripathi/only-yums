import { notFound } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase";
import type { TopPicks } from "@/lib/types";

interface TopPicksPageProps {
  params: Promise<{ id: string }>;
}

export default async function TopPicksPage({ params }: TopPicksPageProps) {
  const supabase = supabaseServerClient();
  const { id } = await params;

  const { data: topPicks, error } = await supabase
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
      ),
      cities (
        name,
        slug
      ),
      cuisines (
        name,
        emoji
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !topPicks) {
    notFound();
  }

  const picks = topPicks as unknown as TopPicks & {
    top_picks_items: Array<{
      id: string;
      place_id: string;
      rank: 1 | 2 | 3;
      places: {
        id: string;
        name: string;
        slug: string;
        short_description: string;
        cover_image_url: string | null;
        price_level: string;
      };
    }>;
    cities: { name: string; slug: string };
    cuisines: { name: string; emoji: string | null };
  };

  const sortedItems = [...picks.top_picks_items].sort((a, b) => a.rank - b.rank);

  return (
    <div className="section-container space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {picks.cuisines.emoji} {picks.cuisines.name} in {picks.cities.name}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{picks.title}</h1>
          {picks.description && <p className="text-sm text-muted-foreground">{picks.description}</p>}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Shared by community</span>
          <span>•</span>
          <time>{new Date(picks.created_at).toLocaleDateString()}</time>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Top picks</h2>
        <ul className="space-y-4">
          {sortedItems.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card px-4 py-3">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">#{item.rank}</span>
                  <p className="text-base font-semibold">{item.places.name}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.places.short_description}</p>
              </div>
              <div className="text-right text-xs uppercase tracking-wide text-muted-foreground">
                <p>{item.places.price_level}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
        <p className="text-xs font-semibold">Share this selection</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            Copy link
          </button>
        </div>
      </section>
    </div>
  );
}
