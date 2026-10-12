import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import { listingQuerySchema } from "../schemas/listingQuery.schema.js";

export const aiQuerySchema = listingQuerySchema.omit({
  page: true,
  limit: true,
});

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });

const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: "quiet 3 bedroom house for rent near a market",
  config: {
    systemInstruction: `You turn a sentence about renting or buying property into a JSON object.
Use only these fields:
- purpose: 'buy' or 'rent'
- propertyType: 'house', 'flat', or 'plot'
- maxPrice: a number in rupees
- minBedrooms: a number
- maxNoise: 1 to 5 (1 is quietest). 'quiet' means 2.
- maxMarketDistance: 'walkable', 'short-drive', or 'far'. 'near a market' means 'walkable'.
- schoolsNearBy: true or false
If the sentence asks for something these fields can't express, leave it out. Never guess.
Output only the JSON object. No explanation.`,
    responseMimeType: "application/json",
    maxOutputTokens: 2048,
  },
});

console.log("finish reason:", response.candidates?.[0]?.finishReason);
console.log("usage:", response.usageMetadata);
console.log(response.text);
