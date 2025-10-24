export type TPlant = {
  id: string;
  name: string;
  type: string;
  dateAdded?: string;
  price: string;
  size: string;
  amount: string;
  dest?: string;

  // AI-generated info
  wateringFrequency?: string;
  sunlightNeeds?: string;
  soilType?: string;
  temperatureRange?: string;
  careTips?: string[];
  nextFertilize?: string;

  // Other
  notes?: string;
  imageUrl?: string;
  lastWatered?: string;
};
