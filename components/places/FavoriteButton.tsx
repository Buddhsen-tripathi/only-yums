"use client";

import { useState, useTransition } from "react";

interface FavoriteButtonProps {
  placeId: string;
  initialFavorited: boolean;
}

export function FavoriteButton({ placeId, initialFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => {
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placeId }),
        });

        if (!res.ok) return;

        const json = (await res.json()) as { favorited?: boolean };
        if (typeof json.favorited === "boolean") {
          setIsFavorited(json.favorited);
        }
      } catch (error) {
        console.error("Error toggling favorite", error);
      }
    });

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
        isFavorited
          ? "border-transparent bg-accent text-accent-foreground"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span>{isFavorited ? "★" : "☆"}</span>
      <span>{isFavorited ? "Saved" : "Save"}</span>
    </button>
  );
}
