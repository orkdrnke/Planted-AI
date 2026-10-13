import { beforeEach, describe, expect, it } from "vitest";
import { usePlantStore } from "./plantsStore";
import { TPlant } from "@/types/plant";

const plant: TPlant = {
  id: "p1",
  name: "Monstera",
  type: "Indoor plants",
  price: "$20.00",
  size: "50",
  amount: "1",
  dest: "inside",
  notes: "Near the window",
};

const otherPlant: TPlant = { ...plant, id: "p2", name: "Tulips" };

describe("updatePlant", () => {
  beforeEach(() => {
    usePlantStore.setState({ plants: [plant, otherPlant] });
  });

  it("merges data into the matching plant and keeps other fields", () => {
    usePlantStore
      .getState()
      .updatePlant("p1", { wateringFrequency: "Once a week" });

    expect(usePlantStore.getState().plants[0]).toEqual({
      ...plant,
      wateringFrequency: "Once a week",
    });
  });

  it("does not change other plants", () => {
    usePlantStore.getState().updatePlant("p1", { soilType: "Peat" });

    expect(usePlantStore.getState().plants[1]).toEqual(otherPlant);
  });

  it("does nothing for an unknown id", () => {
    usePlantStore.getState().updatePlant("missing", { soilType: "Peat" });

    expect(usePlantStore.getState().plants).toEqual([plant, otherPlant]);
  });
});
