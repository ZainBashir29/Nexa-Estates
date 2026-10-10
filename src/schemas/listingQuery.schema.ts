import { z } from "zod";

export const listingQuerySchema = z.object({
    purpose: z.enum(["buy", "rent"]).optional(),
    propertyType: z.enum(["house", "flat", "plot"]).optional(),
    maxPrice: z.coerce.number().positive().optional(),
    minBedrooms: z.coerce.number().int().min(0).optional(),
    maxNoise: z.coerce.number().int().min(1).max(5).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
}).strict();

export type ListingQuery = z.infer<typeof listingQuerySchema>;