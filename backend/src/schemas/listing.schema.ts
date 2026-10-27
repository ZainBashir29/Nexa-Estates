import mongoose from "mongoose";
import { z } from "zod";

const listingSchema = z.object({
    title: z.string().trim(),
    purpose: z.enum(["buy", "rent"]),
    propertyType: z.enum(["house", "flat", "plot"]),
    priceRs: z.number().positive(),
    bedrooms: z.number().int().min(0),
    sizeMarla: z.number().positive(),
    areaId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), "Invalid Area Id"),
    description: z.string(),
}).refine(listing => listing.propertyType !== "plot" || listing.bedrooms === 0, {
    message: "Plots can't have bedroooms",
    path: ["bedrooms"],
})

export type Listing = z.infer<typeof listingSchema>;

export default listingSchema;