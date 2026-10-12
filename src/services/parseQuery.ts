import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import { listingQuerySchema } from "../schemas/listingQuery.schema.js";

const SYSTEM_PROMPT = `You turn a sentence about renting or buying property into a JSON object.
Use only these fields:
- purpose: 'buy' or 'rent'
- propertyType: 'house', 'flat', or 'plot'
- maxPrice: a number in rupees
- minBedrooms: a number
- maxNoise: 1 to 5 (1 is quietest). 'quiet' means 2.
- maxMarketDistance: 'walkable', 'short-drive', or 'far'. 'near a market' means 'walkable'.
- schoolsNearBy: true or false
If the sentence asks for something these fields can't express, leave it out. Never guess.
Output only the JSON object. No explanation.`;

export const aiQuerySchema = listingQuerySchema.omit({
  page: true,
  limit: true,
});

export async function parseQuery(text: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: text,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      maxOutputTokens: 2048,
    },
  });

  if (response.candidates?.[0]?.finishReason !== "STOP") {
    return { ok: false, error: "model did not finish" };
  }

  try {
    const responseText = response.text;

    if (!responseText) {
      return { ok: false, error: "empty response" };
    }

    const parsedResponse = JSON.parse(responseText);

    const result = aiQuerySchema.safeParse(parsedResponse);
    if (!result.success) {
      return {
        ok: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      };
    }

    return { ok: true, query: result.data };
  } catch (error) {
    return { ok: false, error: "not valid JSON" };
  }

  //   console.log("finish reason:", response.candidates?.[0]?.finishReason);
  //   console.log("usage:", response.usageMetadata);
  //   console.log(response.text);
}

console.log(await parseQuery("cheap 2 bedroom flat for sale"));
