import { z } from "zod";

const areaSchema = z.object({
    name: z.string().trim(),
    noise: z.number().int().min(1).max(5).nullable(),
    traffic: z.number().int().min(1).max(5).nullable(),
    marketDistance: z.enum(["walkable", "short-drive", "far"]).nullable(),
    cityCentreMinutes: z.number().nonnegative().nullable(),
    schoolsNearBy: z.boolean().nullable(),
    notes: z.string().nullable(),
})

export default areaSchema;

export type Area = z.infer<typeof areaSchema>;
