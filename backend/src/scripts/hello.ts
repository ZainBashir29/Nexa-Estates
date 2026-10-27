import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });

const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "say hi"
});

console.log(response.text);