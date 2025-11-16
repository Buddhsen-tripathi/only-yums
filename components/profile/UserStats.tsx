interface UserStatsProps {
  displayName: string;
  votesCount: number;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export function UserStats({ displayName, votesCount, postsCount, followersCount, followingCount }: UserStatsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{displayName}</h1>
        <p className="text-sm text-muted-foreground">Food enthusiast & curator</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
          <p className="text-2xl font-semibold">{votesCount}</p>
          <p className="text-xs text-muted-foreground">Votes</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
          <p className="text-2xl font-semibold">{postsCount}</p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
          <p className="text-2xl font-semibold">{followersCount}</p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
          <p className="text-2xl font-semibold">{followingCount}</p>
          <p className="text-xs text-muted-foreground">Following</p>
        </div>
      </div>
    </div>
  );
}
