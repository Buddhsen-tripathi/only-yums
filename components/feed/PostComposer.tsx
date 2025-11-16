"use client";

import { useState, useTransition } from "react";
import Image from "next/image";

interface PostComposerProps {
  onSuccess?: () => void;
}

interface MediaItem {
  file: File;
  preview: string;
}

export function PostComposer({ onSuccess }: PostComposerProps) {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [visibility, setVisibility] = useState<"public" | "friends">("public");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files ?? []);
    setError(null);

    if (media.length + files.length > 5) {
      setError("Maximum 5 images per post");
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setMedia((prev) => [
          ...prev,
          {
            file,
            preview: event.target?.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (media.length === 0) {
      setError("Add at least one photo");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("visibility", visibility);

        media.forEach((item, idx) => {
          formData.append(`media[${idx}]`, item.file);
        });

        const res = await fetch("/api/posts/create", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(data.error || "Failed to create post");
          return;
        }

        setCaption("");
        setMedia([]);
        setError(null);
        onSuccess?.();
      } catch (err) {
        setError("Network error");
        console.error(err);
      }
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Share your food moment</h3>
        <p className="text-xs text-muted-foreground">Upload photos and tell the community what you`&apos;`re eating.</p>
      </div>

      <div className="space-y-4">
        {media.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {media.map((item, idx) => (
              <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image src={item.preview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeMedia(idx)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 px-4 py-8 text-sm text-muted-foreground hover:bg-muted/30">
          <span>📷 Add photos</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleMediaChange}
            disabled={isPending || media.length >= 5}
            className="hidden"
          />
        </label>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={"What are you eating? (optional)"}
          maxLength={500}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder-muted-foreground"
          rows={3}
        />

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Visibility:</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "public" | "friends")}
            className="rounded border border-border bg-background px-2 py-1 text-xs"
          >
            <option value="public">Public</option>
            <option value="friends">Friends only</option>
          </select>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || media.length === 0}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
