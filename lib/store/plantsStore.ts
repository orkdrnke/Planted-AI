import { create } from "zustand";
import { plants as mockPlants } from "@/lib/mockdata";
import { v4 as uuidv4 } from "uuid";
import { TPlantState } from "@/types/store";

export const usePlantStore = create<TPlantState>((set) => ({
  plants: mockPlants,
  newPlantId: null,
  addPlant: (plant) =>
    set((state) => {
      const newPlantId = uuidv4();

      console.log("Adding plant with ID:", newPlantId);
      console.log("Plant details:", plant);
      return {
        plants: [...state.plants, { ...plant, id: newPlantId }],
        newPlantId: newPlantId,
      };
    }),
  updatePlant: (id, data) =>
    set((state) => ({
      plants: state.plants.map((plant) =>
        plant.id === id ? { ...plant, ...data } : plant
      ),
    })),
  removePlant: (id) =>
    set((state) => ({ plants: state.plants.filter((p) => p.id !== id) })),
  clearNewPlantId: () => set({ newPlantId: null }),
}));
