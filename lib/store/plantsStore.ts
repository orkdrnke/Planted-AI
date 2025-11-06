import { create } from "zustand";
import { plants as mockPlants } from "@/lib/mockdata";
import { v4 as uuidv4 } from "uuid";
import { TPlantState } from "@/types/store";
import { TPlant } from "@/types/plant";
import { devtools } from "zustand/middleware";

export const usePlantStore = create<TPlantState>()(
  devtools((set, get) => ({
    plants: mockPlants,
    newPlantId: null,
    updatePlant: (id, data) =>
      set((state) => ({
        plants: state.plants.map((plant) =>
          plant.id === id ? { ...plant, ...data } : plant
        ),
      })),

    addPlant: (plant) => {
      const newPlantId = uuidv4();
      const newPlant = { ...plant, id: newPlantId };

      set((state) => ({
        plants: [...state.plants, newPlant],
        newPlantId: newPlantId,
      }));

      // Fetch AI tips in background
      (async () => {
        const response = await fetch("api/ai-care-guide", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: plant.name,
            type: plant.type,
            dest: plant.dest,
          }),
        });

        if (response.ok) {
          const tips: Partial<TPlant> = await response.json();
          if (tips) {
            get().updatePlant(newPlantId, tips);
          }
        }
      })();
    },
    removePlant: (id) =>
      set((state) => ({ plants: state.plants.filter((p) => p.id !== id) })),
    clearNewPlantId: () => set({ newPlantId: null }),
  }))
);
