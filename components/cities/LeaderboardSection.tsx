import type { LeaderboardEntry } from "@/lib/types";

interface LeaderboardSectionProps {
  cuisineName: string;
  emoji?: string | null;
  entries: LeaderboardEntry[];
}

export function LeaderboardSection({ cuisineName, emoji, entries }: LeaderboardSectionProps) {
  if (!entries.length) {
    return (
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <p className="text-sm font-semibold">
          {emoji ? `${emoji} ` : null}
          {cuisineName}
        </p>
        <p className="text-sm text-muted-foreground">No votes yet. Be the first to nominate your favorites.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-2xl border border-border/60 bg-card p-3 sm:p-4 hover:border-border/80 transition-colors cursor-pointer">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold truncate">
            {emoji} {cuisineName}
          </p>
          <p className="text-xs text-muted-foreground">{entries.length} ranked</p>
        </div>
        <span className="text-lg flex-shrink-0">→</span>
      </div>

      <div className="space-y-1">
        {entries.slice(0, 3).map((entry) => (
          <div key={entry.place_id} className="flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold flex-shrink-0">#{entry.rank}</span>
            <span className="flex-1 px-2 line-clamp-1 min-w-0">{entry.place_name}</span>
            <span className="text-muted-foreground flex-shrink-0">{entry.total_points}pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
