import mongoose, { Schema } from "mongoose";
import type { Listing } from "../schemas/listing.schema.js";

type ListingDocument = Omit<Listing, "areaId"> & {
    areaId: mongoose.Types.ObjectId;
};

const listingSchema = new Schema<ListingDocument>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    purpose: {
        type: String,
        required: true,
        enum: ["buy", "rent"],
    },
    propertyType: {
        type: String,
        required: true,
        enum: ["house", "flat", "plot"],
    },
    priceRs: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    sizeMarla: {
        type: Number,
        required: true,
    },
    areaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

export const ListingModel = mongoose.model<ListingDocument>("Listing", listingSchema);