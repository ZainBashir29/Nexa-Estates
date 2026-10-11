import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ListingModel } from "../models/listing.model.js";
import type { Listing } from "../schemas/listing.schema.js";
import type { ListingQuery } from "../schemas/listingQuery.schema.js";
import type { Document } from "mongoose";
import { AreaModel } from "../models/area.model.js";
import type areaSchema from "../schemas/area.schema.js";

export function buildListingQuery(query: ListingQuery) {
    const filter: Record<string, unknown> = {};
    if (query.purpose) filter.purpose = query.purpose;
    if (query.propertyType) filter.propertyType = query.propertyType;
    if (query.maxPrice !== undefined) filter.priceRs = { $lte: query.maxPrice };
    if (query.minBedrooms !== undefined) filter.bedrooms = { $gte: query.minBedrooms };
    return filter;
}

// const getListings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try  {
//     const listings = await ListingModel.find().lean<Listing[]>();

//     if (listings.length === 0) {
//         res.status(404).json({ message: "Listings not found"});
//         return;
//     }

//     res.status(200).json(listings);
// } catch (error) {
//     next(error);
// }
// }

const getFilteredListings = async (_req: Request, res: Response): Promise<void> => {
    const query = res.locals.query as ListingQuery;

    const filter = buildListingQuery(query);

    const areaFilters: Record<string, unknown> = {};

    if (query.maxNoise !== undefined) {
        areaFilters.noise = { $lte: query.maxNoise };
    }

    if (query.maxMarketDistance) {
        const distances = query.maxMarketDistance === "walkable"
            ? ["walkable"]
            : query.maxMarketDistance === "short-drive"
                ? ["walkable", "short-drive"]
                : ["walkable", "short-drive", "far"];
        areaFilters.marketDistance = { $in: distances };
    }

    if (query.schoolsNearBy !== undefined) {
        areaFilters.schoolsNearBy = query.schoolsNearBy;
    }

    const areas = await AreaModel.find(areaFilters);
    const areaIds = areas.map((area) => area._id);

    filter.areaId = { $in: areaIds };

    const skip = (query.page - 1) * query.limit;
    const filteredListings = await ListingModel.find(filter)
        .skip(skip)
        .limit(query.limit);

    res.status(200).json(filteredListings);
}

export {
    // getListings,
    getFilteredListings,
}