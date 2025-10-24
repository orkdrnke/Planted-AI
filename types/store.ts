import { TPlant } from "./plant";

export type TPlantState = {
  plants: TPlant[];
  newPlantId: string | null;
  addPlant: (plant: TPlant) => void;
  updatePlant: (id: string, data: Partial<TPlant>) => void;
  removePlant: (id: string) => void;
  clearNewPlantId: () => void;
};
