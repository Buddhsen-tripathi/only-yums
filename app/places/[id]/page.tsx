import { notFound } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase";
import type { City, Place, PlaceImage } from "@/lib/types";
import { PlaceHeader } from "@/components/places/PlaceHeader";
import { PlaceImageGallery } from "@/components/places/PlaceImageGallery";

interface PlacePageProps {
  params: { id: string };
}

export default async function PlacePage({ params }: PlacePageProps) {
  const supabase = supabaseServerClient();

  let place: Place | null = null;
  let city: City | null = null;
  let images: PlaceImage[] = [];

  try {
    const { data: placeData, error: placeError } = await supabase
      .from("places")
      .select(
        "id, city_id, name, slug, short_description, full_description, address, website_url, price_level, avg_rating, cover_image_url, is_featured, created_at, updated_at",
      )
      .eq("id", params.id)
      .maybeSingle();

    if (placeError) {
      console.error("Error loading place:", placeError);
    }

    if (!placeData) {
      notFound();
    }

    place = placeData as Place;

    const { data: cityData, error: cityError } = await supabase
      .from("cities")
      .select("id, name, slug, state, country, cover_image_url, created_at, updated_at")
      .eq("id", place.city_id)
      .maybeSingle();

    if (cityError) {
      console.error("Error loading city:", cityError);
    }

    if (!cityData) {
      notFound();
    }

    city = cityData as City;

    const { data: imagesData, error: imagesError } = await supabase
      .from("place_images")
      .select("id, place_id, image_url, caption, sort_order")
      .eq("place_id", place.id);

    if (imagesError) {
      console.error("Error loading place images:", imagesError);
    } else {
      images = (imagesData ?? []) as PlaceImage[];
    }
  } catch (error) {
    console.error("Error loading place page:", error);
    notFound();
  }

  return (
    <div className="section-container space-y-8">
      <PlaceHeader place={place} city={city} />
      <PlaceImageGallery images={images} coverImageUrl={place.cover_image_url} />
      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <p className="text-muted-foreground whitespace-pre-line">{place.full_description}</p>
      </section>
    </div>
  );
}
