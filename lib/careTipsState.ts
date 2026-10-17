import { TPlant } from "@/types/plant";

export type TCareTipsState = "ready" | "generating" | "failed";

export type TCollectionStatus = {
  total: number;
  ready: number;
  generating: number;
  failed: number;
};

const AI_TEXT_FIELDS = [
  "botanicalName",
  "wateringFrequency",
  "wateringShort",
  "sunlightNeeds",
  "sunlightShort",
  "soilType",
  "temperatureRange",
] as const;

function hasStoredTips(plant: TPlant) {
  return (
    AI_TEXT_FIELDS.some((key) => Boolean(plant[key])) ||
    (plant.careTips?.length ?? 0) > 0
  );
}

// The only place the care-tip state rule lives (ADR-0002): stored tips win over
// any generation status; a plant without tips and without a generation under way is failed.
export function getCareTipsState(plant: TPlant): TCareTipsState {
  if (hasStoredTips(plant)) return "ready";
  if (plant.aiStatus === "generating") return "generating";
  return "failed";
}

export function getCollectionStatus(plants: TPlant[]): TCollectionStatus {
  const status: TCollectionStatus = {
    total: plants.length,
    ready: 0,
    generating: 0,
    failed: 0,
  };
  for (const plant of plants) {
    status[getCareTipsState(plant)] += 1;
  }
  return status;
}
