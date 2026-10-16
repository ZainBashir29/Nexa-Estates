import type { Request, Response } from "express";
import { ListingModel } from "../models/listing.model.js";
import { AreaModel } from "../models/area.model.js";
import type {
  ListingFilters,
  ListingQuery,
  NaturalLanguageListingQuery,
} from "../schemas/listingQuery.schema.js";
import { parseQuery } from "../services/parseQuery.js";

export function buildListingQuery(query: ListingFilters) {
  const filter: Record<string, unknown> = {};
  if (query.purpose) filter.purpose = query.purpose;
  if (query.propertyType) filter.propertyType = query.propertyType;
  if (query.maxPrice !== undefined) filter.priceRs = { $lte: query.maxPrice };
  if (query.minBedrooms !== undefined)
    filter.bedrooms = { $gte: query.minBedrooms };
  return filter;
}

function buildAreaQuery(query: ListingFilters) {
  const areaFilters: Record<string, unknown> = {};

  if (query.maxNoise !== undefined) {
    areaFilters.noise = { $lte: query.maxNoise };
  }

  if (query.maxMarketDistance) {
    const distances =
      query.maxMarketDistance === "walkable"
        ? ["walkable"]
        : query.maxMarketDistance === "short-drive"
          ? ["walkable", "short-drive"]
          : ["walkable", "short-drive", "far"];
    areaFilters.marketDistance = { $in: distances };
  }

  if (query.schoolsNearBy !== undefined) {
    areaFilters.schoolsNearBy = query.schoolsNearBy;
  }

  if (query.areaName) {
    areaFilters.name = query.areaName;
  }

  return areaFilters;
}

async function findListings(query: ListingQuery) {
  const filter = buildListingQuery(query);
  const areas = await AreaModel.find(buildAreaQuery(query));
  filter.areaId = { $in: areas.map((area) => area._id) };

  return ListingModel.find(filter)
    .skip((query.page - 1) * query.limit)
    .limit(query.limit);
}

const getFilteredListings = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const query = res.locals.query as ListingQuery;
  const listings = await findListings(query);
  res.status(200).json(listings);
};

const getSearchedListings = async (_req: Request, res: Response) => {
  const { q, page, limit } = res.locals.query as NaturalLanguageListingQuery;
  let parsed: Awaited<ReturnType<typeof parseQuery>>;

  try {
    parsed = await parseQuery(q);
  } catch (error) {
    console.error("Natural-language listing search failed:", error);
    res.status(503).json({
      message: "Couldn't understand that, try the filters.",
    });
    return;
  }

  if (parsed.ok === false) {
    console.error("Natural-language listing query parsing failed:", parsed);
    res.status(503).json({
      message: "Couldn't understand that, try the filters.",
    });
    return;
  }

  if (Object.keys(parsed.query).length === 0) {
    res.status(422).json({
      message: "No filters found in that sentence.",
      interpretedAs: parsed.query,
    });
    return;
  }

  const query: ListingQuery = { ...parsed.query, page, limit };
  const listings = await findListings(query);
  res.status(200).json({ interpretedAs: parsed.query, results: listings });
};

export { getFilteredListings, getSearchedListings };
