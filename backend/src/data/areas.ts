import type { Area } from "../schemas/area.schema.js";
import areaSchema from "../schemas/area.schema.js";

export const areas: Area[] = [
  {
    name: "Tariq Road",
    noise: 4,
    traffic: 5,
    marketDistance: "walkable",
    cityCentreMinutes: 7,
    schoolsNearBy: true,
    notes: null,
  },
  {
    name: "Ghang Road",
    noise: 3,
    traffic: 4,
    marketDistance: "walkable",
    cityCentreMinutes: 7,
    schoolsNearBy: true,
    notes:
      "main road is traffic-heavy but inner roads are quite peacuful with a beautiful garden near",
  },
  {
    name: "VIP Town Sheikhupura",
    noise: 1,
    traffic: 1,
    marketDistance: "walkable",
    cityCentreMinutes: 14,
    schoolsNearBy: true,
    notes: "it is a well-organized housing society",
  },
  {
    name: "Housing Colony",
    noise: 3,
    traffic: 3,
    marketDistance: "walkable",
    cityCentreMinutes: 14,
    schoolsNearBy: false,
    notes: "near the edge of city",
  },
  {
    name: "Ayesha Park Colony",
    noise: 3,
    traffic: 3,
    marketDistance: "walkable",
    cityCentreMinutes: 5,
    schoolsNearBy: true,
    notes: null,
  },
  {
    name: "Khalid Road",
    noise: 5,
    traffic: 5,
    marketDistance: "walkable",
    cityCentreMinutes: 7,
    schoolsNearBy: true,
    notes: null,
  },
  {
    name: "Bhiki Road",
    noise: 3,
    traffic: 4,
    marketDistance: "short-drive",
    cityCentreMinutes: 9,
    schoolsNearBy: true,
    notes: null,
  },
  {
    name: "Officer Colony",
    noise: 1,
    traffic: 1,
    marketDistance: "short-drive",
    cityCentreMinutes: 9,
    schoolsNearBy: true,
    notes: "near the fields, the neighborhood feels peacuful kind of isolated",
  },
  {
    name: "Nabi Pura",
    noise: 2,
    traffic: 3,
    marketDistance: "walkable",
    cityCentreMinutes: 6,
    schoolsNearBy: true,
    notes: null,
  },
  {
    name: "Gloria Colony",
    noise: 3,
    traffic: 3,
    marketDistance: "walkable",
    cityCentreMinutes: 8,
    schoolsNearBy: true,
    notes: "railway tracks are near, so traffic and noise levels can fluctuate",
  },
];

// for (const area of areas) {
//   const raw = areaSchema.safeParse(area);
//   if (raw.success) console.log(area.name, "is valid");
//   if (!raw.success) console.log(area.name, raw.error.issues);
// }

export const areaNames = areas.map((area) => area.name);

console.log(areaNames);
