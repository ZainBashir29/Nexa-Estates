import mongoose, { Schema } from "mongoose";
import type { Area } from "../schemas/areaSchema.ts";

const areaSchema = new Schema<Area>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    noise: {
        type: Number,
        enum: [1, 2, 3, 4, 5, null],
        default: null,
    },
    traffic: {
        type: Number,
        enum: [1, 2, 3, 4, 5, null],
        default: null,
    },
    marketDistance: {
        type: String,
        enum: ["walkable", "short-drive", "far", null],
        default: null,
    },
    cityCentreMinutes: {
        type: Number,
        default: null,
    },
    schoolsNearBy: {
        type: Boolean,
        default: null,
    },
    notes: {
        type: String,
        default: null,
    }
});

// const AreaModel = mongoose.models.Area as mongoose.Model<Area> || mongoose.model<Area>("Area", areaSchema);


export const AreaModel = mongoose.model<Area>("Area", areaSchema);

const doc = new AreaModel({name: "Test", noise: null, traffic: 3, marketDistance: "walkable", cityCentreMinutes: 20, schoolsNearBy: null});

doc.validate();