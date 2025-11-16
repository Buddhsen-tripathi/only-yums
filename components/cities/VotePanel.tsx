"use client";

import { useState, useTransition } from "react";
import type { Place } from "@/lib/types";

interface VotePanelProps {
  cityId: string;
  cuisineId: string;
  cuisineName: string;
  places: Place[];
  onSuccess?: () => void;
}

interface VoteEntry {
  placeId: string;
  rank: 1 | 2 | 3;
}

export function VotePanel({ cityId, cuisineId, cuisineName, places, onSuccess }: VotePanelProps) {
  const [votes, setVotes] = useState<VoteEntry[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRankChange = (placeId: string, rank: 1 | 2 | 3) => {
    setError(null);
    setVotes((prev) => {
      const existing = prev.find((v) => v.placeId === placeId);
      if (existing) {
        return prev.map((v) => (v.placeId === placeId ? { ...v, rank } : v));
      }
      return [...prev, { placeId, rank }];
    });
  };

  const handleRemove = (placeId: string) => {
    setVotes((prev) => prev.filter((v) => v.placeId !== placeId));
  };

  const handleSubmit = () => {
    if (votes.length === 0) {
      setError("Select at least one restaurant");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cityId,
            cuisineId,
            votes,
          }),
        });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(data.error || "Failed to submit votes");
          return;
        }

        setVotes([]);
        setError(null);
        onSuccess?.();
      } catch (err) {
        setError("Network error");
        console.error(err);
      }
    });
  };

  const selectedPlaceIds = new Set(votes.map((v) => v.placeId));
  const availablePlaces = places.filter((p) => !selectedPlaceIds.has(p.id));

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-4 sm:p-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Vote for {cuisineName}</h3>
        <p className="text-xs text-muted-foreground">Rank top 3. #1=3pts, #2=2pts, #3=1pt</p>
      </div>

      <div className="space-y-3">
        {votes.map((vote) => {
          const place = places.find((p) => p.id === vote.placeId);
          if (!place) return null;
          return (
            <div key={vote.placeId} className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium">{place.name}</p>
                <p className="text-xs text-muted-foreground">{place.price_level}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={vote.rank}
                  onChange={(e) => handleRankChange(vote.placeId, parseInt(e.target.value) as 1 | 2 | 3)}
                  className="rounded border border-border bg-background px-2 py-1 text-xs font-semibold"
                >
                  <option value={1}>#{1} (3pts)</option>
                  <option value={2}>#{2} (2pts)</option>
                  <option value={3}>#{3} (1pt)</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemove(vote.placeId)}
                  className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {availablePlaces.length > 0 && votes.length < 3 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Add restaurant</label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                const nextRank = (votes.length + 1) as 1 | 2 | 3;
                handleRankChange(e.target.value, nextRank);
                e.target.value = "";
              }
            }}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a restaurant...</option>
            {availablePlaces.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name} • {place.price_level}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || votes.length === 0}
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {isPending ? "Submitting..." : `Submit ${votes.length} vote${votes.length !== 1 ? "s" : ""}`}
      </button>
    </div>
  );
}
