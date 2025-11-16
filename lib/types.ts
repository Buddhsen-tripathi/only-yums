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

export interface Cuisine {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CityCuisine {
  city_id: string;
  cuisine_id: string;
  is_trending: boolean;
  sort_order: number;
  created_at: string;
}

export interface PlaceCuisine {
  place_id: string;
  cuisine_id: string;
  created_at: string;
}

export interface CityCuisineDetails {
  cuisine: Cuisine;
  is_trending: boolean;
  sort_order: number;
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

export interface Vote {
  id: string;
  user_id: string;
  city_id: string;
  cuisine_id: string;
  place_id: string;
  rank: 1 | 2 | 3;
  points: 1 | 2 | 3;
  created_at: string;
}

export interface LeaderboardEntry {
  place_id: string;
  place_name: string;
  place_slug: string;
  price_level: PriceLevel;
  cover_image_url: string | null;
  short_description: string;
  total_points: number;
  rank: number;
}

export interface Post {
  id: string;
  user_id: string;
  city_id: string | null;
  place_id: string | null;
  caption: string | null;
  visibility: "public" | "friends";
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostMedia {
  id: string;
  post_id: string;
  media_url: string;
  media_type: "image" | "video";
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: "like" | "yum";
  created_at: string;
}

export interface Follow {
  follower_id: string;
  followee_id: string;
  created_at: string;
}

export interface TopPicks {
  id: string;
  user_id: string;
  city_id: string;
  cuisine_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface TopPicksItem {
  id: string;
  top_picks_id: string;
  place_id: string;
  rank: 1 | 2 | 3;
  created_at: string;
}
