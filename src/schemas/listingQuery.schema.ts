import { z } from "zod";
import { areaNames } from "../data/areas.js";

export const listingQuerySchema = z
  .object({
    purpose: z.enum(["buy", "rent"]).optional(),
    propertyType: z.enum(["house", "flat", "plot"]).optional(),
    maxPrice: z.coerce.number().positive().optional(),
    minBedrooms: z.coerce.number().int().min(0).optional(),
    maxNoise: z.coerce.number().int().min(1).max(5).optional(),
    maxMarketDistance: z.enum(["walkable", "short-drive", "far"]).optional(),
    schoolsNearBy: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    areaName: z.enum(areaNames).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict();

export type ListingQuery = z.infer<typeof listingQuerySchema>;

export const naturalLanguageListingQuerySchema = z
  .object({
    q: z
      .string()
      .trim()
      .min(1, "Search query must not be empty")
      .max(200, "Search query must be at most 200 characters"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict();

export type NaturalLanguageListingQuery = z.infer<
  typeof naturalLanguageListingQuerySchema
>;

export type ListingFilters = Pick<
  ListingQuery,
  | "purpose"
  | "propertyType"
  | "maxPrice"
  | "minBedrooms"
  | "maxNoise"
  | "maxMarketDistance"
  | "schoolsNearBy"
  | "areaName"
>;
