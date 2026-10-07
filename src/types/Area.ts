import { Document } from "mongoose";

export interface Area extends Document {
    name: string;
    noise: 1 | 2 | 3 | 4 | 5 | null;
    traffic: 1 | 2 | 3 | 4 | 5 | null;
    marketDistance: "walkable" | "short-drive" | "far" | null;
    cityCentreMinutes: number | null;
    schoolsNearBy: boolean | null;
    notes: string | null;
}