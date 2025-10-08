import { create } from "zustand";
import type { TPlant } from "@/app/addPlant/page";
import { plants as mockPlants } from "@/lib/mockdata";
import { v4 as uuidv4 } from "uuid";

type PlantState = {
  plants: TPlant[];
  newPlantId: string | null;
  addPlant: (plant: TPlant) => void;
  removePlant: (id: string) => void;
  clearNewPlantId: () => void;
};

export const usePlantStore = create<PlantState>((set) => ({
  plants: mockPlants,
  newPlantId: null,
  addPlant: (plant) =>
    set((state) => {
      const newPlantId = uuidv4();
      return {
        plants: [...state.plants, { ...plant, id: newPlantId }],
        newPlantId: newPlantId,
      };
    }),
  removePlant: (id) =>
    set((state) => ({ plants: state.plants.filter((p) => p.id !== id) })),
  clearNewPlantId: () => set({ newPlantId: null }),
}));
