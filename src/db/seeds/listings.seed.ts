import { listings } from "../../data/listings.js";
import connectDB from "../config.js";
import { ListingModel } from "../../models/listing.model.js";

connectDB().then(
    async () => {
        for (const listing of listings) {
            await ListingModel.findOneAndUpdate({
                title: listing.title
            }, {
                $set: listing
            }, {
                upsert: true    
            })
        }

        console.log("Listings seeded in database successfully");
        process.exit(0);
    }
).catch((error) => {
    console.error("Listings seeding failed", error);
    process.exit(1);
})