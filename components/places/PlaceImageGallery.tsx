import type { PlaceImage } from "@/lib/types";

interface PlaceImageGalleryProps {
  images: PlaceImage[];
  coverImageUrl: string | null;
}

export function PlaceImageGallery({ images, coverImageUrl }: PlaceImageGalleryProps) {
  const ordered = [...images].sort((a, b) => a.sort_order - b.sort_order);

  if (!ordered.length && !coverImageUrl) {
    return null;
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div
        className="md:col-span-2 h-56 md:h-72 rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : undefined }}
      />
      <div className="grid gap-3">
        {ordered.slice(0, 3).map((img) => (
          <div
            key={img.id}
            className="h-24 rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${img.image_url})` }}
          />
        ))}
      </div>
    </div>
  );
}
