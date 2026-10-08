import type { NextFunction, Request, Response } from "express";
import { ListingModel } from "../models/listing.model.js";
import type { Listing } from "../schemas/listing.schema.js";

const getListings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try  {
    const listings = await ListingModel.find().lean<Listing[]>();

    if (listings.length === 0) {
        res.status(404).json({ message: "Listings not found"});
        return;
    }

    res.status(200).json(listings);
} catch (error) {
    next(error);
}
}

export {
    getListings,
}