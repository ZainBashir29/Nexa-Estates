export const heldOutQueries: { text: string; expected: any }[] = [
  {
    text: "kiraye pe 2 bedroom ghar chahiye, shor se door",
    expected: {
      purpose: "rent",
      propertyType: "house",
      minBedrooms: 2,
      maxNoise: 1,
    },
  },
  {
    text: "Mujhe 50 lakh tak ka plot khareedna hai, market paas ho",
    expected: {
      purpose: "buy",
      propertyType: "plot",
      maxPrice: 5000000,
      maxMarketDistance: "walkable",
    },
  },
  {
    text: "Rent pe flat chahiye, 3 bedrooms hon aur schools qareeb hon",
    expected: {
      purpose: "rent",
      propertyType: "flat",
      minBedrooms: 3,
      schoolsNearBy: true,
    },
  },
  {
    text: "I want to buy a house and can spend up to 1.25 crore.",
    expected: {
      purpose: "buy",
      propertyType: "house",
      maxPrice: 12500000,
    },
  },
  {
    text: "I'm hoping to find somewhere that feels just right.",
    expected: {},
  },
  {
    text: "Rent a flat with one bedroom; market ki parwah nahi.",
    expected: {
      purpose: "rent",
      propertyType: "flat",
      minBedrooms: 1,
    },
  },
  {
    text: "I want to buy a 3-bedroom house in a quiet area, but I also want the neighborhood to be extremely noisy.",
    expected: {
      purpose: "buy",
      propertyType: "house",
      minBedrooms: 3,
    },
  },
  {
    text: "We need a flat to rent with at least two bedrooms and a market within a short drive.",
    expected: {
      purpose: "rent",
      propertyType: "flat",
      minBedrooms: 2,
      maxMarketDistance: "short-drive",
    },
  },
  {
    text: "Looking to buy a plot under 75 lakh; the market can be far away.",
    expected: {
      purpose: "buy",
      propertyType: "plot",
      maxPrice: 7500000,
      maxMarketDistance: "far",
    },
  },
  {
    text: "I need to rent a flat with at least one bedroom, and I do not want schools nearby.",
    expected: {
      purpose: "rent",
      propertyType: "flat",
      minBedrooms: 1,
      schoolsNearBy: false,
    },
  },
];
