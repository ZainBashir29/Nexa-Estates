import express from "express";
import { getFilteredListings } from "../controllers/listing.controllers.js";
import { validateQuery } from "../middlewares/validateQuery.middleware.js";
import { listingQuerySchema } from "../schemas/listingQuery.schema.js";

const router = express.Router();

// router.get("/", validateQuery(listingQuerySchema), getListings);

router.get("/", validateQuery(listingQuerySchema), getFilteredListings);

export default router;