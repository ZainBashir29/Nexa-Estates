import express from "express";
import { getListings } from "../controllers/listing.controllers.js";

const router = express.Router();

router.get("/", getListings);

export default router;