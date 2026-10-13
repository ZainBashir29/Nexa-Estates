import { parseQuery } from "../services/parseQuery.js";

const sentences = [
  "cheap 2 bedroom flat for sale",
  "somewhere peaceful",
  "good for a family with a nice view",
];

for (const sentence of sentences) {
  console.log(sentence, " -> ", await parseQuery(sentence));
}
