import type { LeaderboardEntry, PriceLevel } from "@/lib/types";

export interface VoteWithPlaceRow {
  cuisine_id: string;
  place_id: string;
  points: number;
  places: {
    id: string;
    name: string;
    slug: string;
    short_description: string;
    cover_image_url: string | null;
    price_level: PriceLevel;
  } | null;
}

export function groupVotesByCuisine(rows: VoteWithPlaceRow[]): Record<string, LeaderboardEntry[]> {
  const cuisineMap: Record<string, Map<string, LeaderboardEntry>> = {};

  for (const row of rows ?? []) {
    if (!row.places) continue;
    const cuisineId = row.cuisine_id;
    const placeId = row.place_id;

    if (!cuisineMap[cuisineId]) {
      cuisineMap[cuisineId] = new Map();
    }

    const existing = cuisineMap[cuisineId].get(placeId);

    if (existing) {
      existing.total_points += row.points;
    } else {
      cuisineMap[cuisineId].set(placeId, {
        place_id: placeId,
        place_name: row.places.name,
        place_slug: row.places.slug,
        price_level: row.places.price_level,
        cover_image_url: row.places.cover_image_url,
        short_description: row.places.short_description,
        total_points: row.points,
        rank: 0,
      });
    }
  }

  const result: Record<string, LeaderboardEntry[]> = {};

  for (const [cuisineId, leaderboardMap] of Object.entries(cuisineMap)) {
    const entries = Array.from(leaderboardMap.values()).sort((a, b) => b.total_points - a.total_points || a.place_name.localeCompare(b.place_name));

    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    result[cuisineId] = entries;
  }

  return result;
}
