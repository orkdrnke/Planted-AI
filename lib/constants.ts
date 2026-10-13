export const PLANT_TYPES = {
  VEGETABLE: "Vegetable plants",
  FLOWERING: "Flowering",
  ORNAMENTAL: "Ornamental",
  INDOOR: "Indoor plants",
  BERRY: "Berry plants",
} as const;

export const DEST = {
  in: "inside",
  out: "outside",
};

export type PlantType = (typeof PLANT_TYPES)[keyof typeof PLANT_TYPES];
