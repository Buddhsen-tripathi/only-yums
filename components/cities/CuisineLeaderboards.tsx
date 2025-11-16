"use client";

import { useState } from "react";
import type { CityCuisineDetails, LeaderboardEntry, Place } from "@/lib/types";
import { LeaderboardSection } from "./LeaderboardSection";
import { VotePanel } from "./VotePanel";

interface CuisineLeaderboardsProps {
  cuisines: CityCuisineDetails[];
  leaderboards: Record<string, LeaderboardEntry[]>;
  places: Place[];
  cityId: string;
  onVoteSuccess?: () => void;
}

export function CuisineLeaderboards({ cuisines, leaderboards, places, cityId, onVoteSuccess }: CuisineLeaderboardsProps) {
  const [expandedCuisineId, setExpandedCuisineId] = useState<string | null>(null);

  const trendingCuisines = cuisines.filter((c) => c.is_trending).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-8">
      {trendingCuisines.map((cityCuisine) => {
        const entries = leaderboards[cityCuisine.cuisine.id] ?? [];
        const isExpanded = expandedCuisineId === cityCuisine.cuisine.id;
        const cuisinePlaces = places.filter((p) =>
          entries.some((e) => e.place_id === p.id),
        );

        return (
          <div key={cityCuisine.cuisine.id} className="space-y-4">
            <button
              type="button"
              onClick={() => setExpandedCuisineId(isExpanded ? null : cityCuisine.cuisine.id)}
              className="w-full text-left"
            >
              <LeaderboardSection
                cuisineName={cityCuisine.cuisine.name}
                emoji={cityCuisine.cuisine.emoji}
                entries={entries}
              />
            </button>

            {isExpanded && cuisinePlaces.length > 0 && (
              <VotePanel
                cityId={cityId}
                cuisineId={cityCuisine.cuisine.id}
                cuisineName={cityCuisine.cuisine.name}
                places={cuisinePlaces}
                onSuccess={() => {
                  onVoteSuccess?.();
                  setExpandedCuisineId(null);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
