"use client";

import { useCallback, useEffect, useState } from "react";
import type { Post, PostMedia } from "@/lib/types";
import { FeedCard } from "./FeedCard";

interface FeedGridProps {
  cityId?: string;
  initialPosts?: (Post & { post_media: PostMedia[] })[];
}

export function FeedGrid({ cityId, initialPosts = [] }: FeedGridProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialPosts.length);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "12",
        offset: offset.toString(),
      });

      if (cityId) {
        params.append("cityId", cityId);
      }

      const res = await fetch(`/api/posts?${params}`);
      if (!res.ok) return;

      const data = (await res.json()) as { posts: (Post & { post_media: PostMedia[] })[]; total: number };

      if (data.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
        setOffset((prev) => prev + data.posts.length);
      }
    } catch (error) {
      console.error("Error loading more posts", error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, hasMore, isLoading, cityId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const sentinel = document.getElementById("feed-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  if (!posts.length) {
    return <p className="text-center text-sm text-muted-foreground py-12">No posts yet. Be the first to share!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {posts.map((post) => (
        <FeedCard key={post.id} post={post} media={post.post_media} />
      ))}

      <div id="feed-sentinel" className="flex justify-center py-8">
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!hasMore && <p className="text-sm text-muted-foreground">No more posts</p>}
      </div>
    </div>
  );
}
