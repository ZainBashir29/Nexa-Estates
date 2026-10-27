import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  getFilteredListings,
  getSearchedListings,
} from "../controllers/listing.controllers.js";
import { validateQuery } from "../middlewares/validateQuery.middleware.js";
import {
  listingQuerySchema,
  naturalLanguageListingQuerySchema,
} from "../schemas/listingQuery.schema.js";

const router = express.Router();
const searchRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// router.get("/", validateQuery(listingQuerySchema), getListings);

router.get("/", validateQuery(listingQuerySchema), getFilteredListings);
router.get(
  "/search",
  searchRateLimit,
  validateQuery(naturalLanguageListingQuerySchema),
  getSearchedListings,
);

export default router;
