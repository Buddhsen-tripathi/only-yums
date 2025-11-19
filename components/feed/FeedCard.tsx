import type { Post, PostMedia } from "@/lib/types";
import Image from "next/image";

interface FeedCardProps {
  post: Post;
  media: PostMedia[];
}

export function FeedCard({ post, media }: FeedCardProps) {
  const primaryMedia = media[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
      {primaryMedia && (
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={primaryMedia.media_url}
            alt={post.caption || "Food post"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-black backdrop-blur-sm">
              <span>♥</span> {post.like_count}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex-1 space-y-2">
          {post.caption && (
            <p className="text-sm leading-relaxed text-foreground/90 line-clamp-2">
              {post.caption}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <time className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
            {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </time>
          <button type="button" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
