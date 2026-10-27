import { Document, Types } from "mongoose";

export interface Listing extends Document {
    id: string;
    title: string;
    purpose: "sale" | "rent";
    propertyType: "house" | "flat" | "plot";
    priceRs: number;
    bedrooms: number | null;
    sizeMarla: number;
    areaId: Types.ObjectId;
    description: string;
}
