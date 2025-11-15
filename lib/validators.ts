import { z } from "zod";

export const favoriteToggleSchema = z.object({
  placeId: z.string().uuid(),
});

export const submissionCreateSchema = z.object({
  cityId: z.string().uuid(),
  placeName: z.string().min(2).max(200),
  details: z.string().min(10).max(3000),
});

export const submissionUpdateStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

export const adminCreatePlaceSchema = z.object({
  cityId: z.string().uuid(),
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  shortDescription: z.string().min(10).max(280),
  fullDescription: z.string().min(20).max(4000),
  address: z.string().min(5).max(400),
  websiteUrl: z.string().url().nullable().optional(),
  priceLevel: z.enum(["$", "$$", "$$$", "$$$$"]),
  coverImageUrl: z.string().url().nullable().optional(),
  isFeatured: z.boolean().optional(),
});
