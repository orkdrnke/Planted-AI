import { create } from "zustand";
import { plants as mockPlants } from "@/lib/mockdata";
import { v4 as uuidv4 } from "uuid";
import { TPlantState } from "@/types/store";
import { devtools } from "zustand/middleware";
import { CareTipsSchema } from "@/schemas/careTipsSchema";

async function getErrorMessage(response: Response) {
  try {
    const body: unknown = await response.json();
    if (
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string"
    ) {
      return body.error;
    }
  } catch {
    // Non-JSON error body
  }
  return `Request failed with status ${response.status}`;
}

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

    generateCareTips: async (id) => {
      const plant = get().plants.find((p) => p.id === id);
      // Skip unknown plants and prevent duplicate requests
      if (!plant || plant.aiStatus === "generating") return;

      get().updatePlant(id, { aiStatus: "generating", aiError: undefined });

      const setError = (aiError: string) => {
        // The plant may have been removed while the request was pending
        if (!get().plants.some((p) => p.id === id)) return;
        get().updatePlant(id, { aiStatus: "error", aiError });
      };

      let response: Response;
      try {
        response = await fetch("/api/ai-care-guide", {
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
      } catch {
        setError("Network error. Please try again.");
        return;
      }

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      let body: unknown;
      try {
        body = await response.json();
      } catch {
        setError("AI returned an invalid response");
        return;
      }

      // Parsing strips unknown keys, so only AI fields are merged
      const tips = CareTipsSchema.safeParse(body);
      if (!tips.success) {
        setError("AI returned an invalid response");
        return;
      }

      if (!get().plants.some((p) => p.id === id)) return;
      get().updatePlant(id, { ...tips.data, aiStatus: "ready" });
    },

    addPlant: (plant) => {
      const newPlantId = uuidv4();
      const newPlant = { ...plant, id: newPlantId };

      set((state) => ({
        plants: [...state.plants, newPlant],
        newPlantId: newPlantId,
      }));

      // Fetch AI tips in background
      void get().generateCareTips(newPlantId);
    },
    removePlant: (id) =>
      set((state) => ({ plants: state.plants.filter((p) => p.id !== id) })),
    clearNewPlantId: () => set({ newPlantId: null }),
  }))
);
