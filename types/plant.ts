export type TPlant = {
  id: string;
  name: string;
  type: string;
  dateAdded?: string;
  price: string;
  size: string;
  amount: string;
  dest?: string;

  // AI generation state
  aiStatus?: "generating" | "ready" | "error";
  aiError?: string;

  // AI-generated info
  botanicalName?: string;
  wateringFrequency?: string;
  wateringShort?: string;
  sunlightNeeds?: string;
  sunlightShort?: string;
  soilType?: string;
  temperatureRange?: string;
  careTips?: string[];
  nextFertilize?: string;

  // Other
  notes?: string;
  imageUrl?: string;
  lastWatered?: string;
};
