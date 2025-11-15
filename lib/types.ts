export type PriceLevel = "$" | "$$" | "$$$" | "$$$$";

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Place {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  address: string;
  website_url: string | null;
  price_level: PriceLevel;
  avg_rating: number | null;
  cover_image_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaceImage {
  id: string;
  place_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export type UserRole = "user" | "admin";

export interface DbUser {
  id: string;
  clerk_user_id: string;
  display_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
}

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  user_id: string;
  city_id: string;
  place_name: string;
  details: string;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
}
