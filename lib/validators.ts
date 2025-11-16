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

const voteEntrySchema = z.object({
  placeId: z.string().uuid(),
  rank: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export const voteSubmitSchema = z
  .object({
    cityId: z.string().uuid(),
    cuisineId: z.string().uuid(),
    votes: z.array(voteEntrySchema).min(1).max(3),
  })
  .superRefine((val, ctx) => {
    const rankSet = new Set<number>();
    const placeSet = new Set<string>();

    for (const vote of val.votes) {
      if (rankSet.has(vote.rank)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each rank can only be used once",
          path: ["votes"],
        });
        break;
      }

      if (placeSet.has(vote.placeId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each place can only appear once",
          path: ["votes"],
        });
        break;
      }

      rankSet.add(vote.rank);
      placeSet.add(vote.placeId);
    }
  });

export const postCreateSchema = z.object({
  caption: z.string().min(0).max(500).optional(),
  visibility: z.enum(["public", "friends"]).default("public"),
  cityId: z.string().uuid().optional(),
  placeId: z.string().uuid().optional(),
});

export const postMediaSchema = z.object({
  mediaUrl: z.string().url(),
  mediaType: z.enum(["image", "video"]).default("image"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
