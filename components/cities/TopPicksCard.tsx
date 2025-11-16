import Link from "next/link";
import type { TopPicks } from "@/lib/types";

interface TopPicksCardProps {
  topPicks: TopPicks;
  itemCount: number;
}

export function TopPicksCard({ topPicks, itemCount }: TopPicksCardProps) {
  return (
    <Link href={`/top-picks/${topPicks.id}`}>
      <div className="group space-y-3 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-border hover:shadow-md">
        <div className="space-y-1">
          <p className="text-sm font-semibold line-clamp-2">{topPicks.title}</p>
          {topPicks.description && <p className="text-xs text-muted-foreground line-clamp-2">{topPicks.description}</p>}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{itemCount} picks</span>
          <span>→</span>
        </div>
      </div>
    </Link>
  );
}
