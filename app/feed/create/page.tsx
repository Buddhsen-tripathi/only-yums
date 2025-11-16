"use client";

import { useRouter } from "next/navigation";
import { PostComposer } from "@/components/feed/PostComposer";

export default function CreatePostPage() {
  const router = useRouter();

  return (
    <div className="section-container space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Create</p>
        <h1 className="text-3xl font-semibold tracking-tight">New Post</h1>
        <p className="text-sm text-muted-foreground">Share your favorite food moments with the community.</p>
      </header>

      <div className="max-w-2xl">
        <PostComposer
          onSuccess={() => {
            router.push("/feed");
          }}
        />
      </div>
    </div>
  );
}
