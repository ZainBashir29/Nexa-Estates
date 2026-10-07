import { areas } from "../../data/areas.js";
import connectDB from "../config.js";
import { AreaModel } from "../../models/area.model.js";

connectDB().then(
    async () => {
        for (const area of areas) {
            await AreaModel.findOneAndUpdate({
                name: area.name
            }, {
                $set: area
            }, {
                upsert: true    
            })
        }

        console.log("Areas seeded in database successfully");
        process.exit(0);
    }
).catch((error) => {
    console.error("Areas seeding failed", error);
    process.exit(1);
})