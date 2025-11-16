import type { Post, PostMedia } from "@/lib/types";
import Image from "next/image";

interface FeedCardProps {
  post: Post;
  media: PostMedia[];
}

export function FeedCard({ post, media }: FeedCardProps) {
  const primaryMedia = media[0];

  return (
    <article className="bg-background">
      {primaryMedia && (
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={primaryMedia.media_url}
            alt={post.caption || "Food post"}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button type="button" className="text-xl hover:opacity-70 transition-opacity">
              ♥
            </button>
            <button type="button" className="text-xl hover:opacity-70 transition-opacity">
              💬
            </button>
          </div>
          <button type="button" className="text-xl hover:opacity-70 transition-opacity">
            ↗
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold">{post.like_count} likes</p>
          {post.caption && <p className="text-sm leading-relaxed">{post.caption}</p>}
          <time className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</time>
        </div>
      </div>
    </article>
  );
}
