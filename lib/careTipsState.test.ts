import { describe, expect, it } from "vitest";
import { getCareTipsState, getCollectionStatus } from "./careTipsState";
import { TPlant } from "@/types/plant";

const basePlant: TPlant = {
  id: "p1",
  name: "Monstera",
  type: "Indoor plants",
  price: "$20.00",
  size: "50",
  amount: "1",
};

const withTips: TPlant = {
  ...basePlant,
  wateringFrequency: "Once a week",
  wateringShort: "Weekly",
  sunlightNeeds: "Bright indirect light",
  sunlightShort: "Bright, indirect",
  careTips: ["Wipe the leaves"],
};

describe("getCareTipsState", () => {
  it("is ready when tips are stored", () => {
    expect(getCareTipsState({ ...withTips, aiStatus: "ready" })).toBe("ready");
  });

  it("is ready when tips are stored and a regeneration is under way", () => {
    expect(getCareTipsState({ ...withTips, aiStatus: "generating" })).toBe("ready");
  });

  it("is ready when tips are stored and the latest regeneration failed", () => {
    expect(getCareTipsState({ ...withTips, aiStatus: "error" })).toBe("ready");
  });

  it("is generating when there are no tips and generation is under way", () => {
    expect(getCareTipsState({ ...basePlant, aiStatus: "generating" })).toBe(
      "generating"
    );
  });

  it("is failed when generation failed and there are no tips", () => {
    expect(getCareTipsState({ ...basePlant, aiStatus: "error" })).toBe("failed");
  });

  it("is failed when there are no tips and no generation", () => {
    expect(getCareTipsState(basePlant)).toBe("failed");
  });

  it("counts any single stored AI field as stored tips", () => {
    expect(getCareTipsState({ ...basePlant, botanicalName: "Monstera deliciosa" })).toBe(
      "ready"
    );
  });

  it("does not count an empty care tips list as stored tips", () => {
    expect(getCareTipsState({ ...basePlant, careTips: [] })).toBe("failed");
  });
});

describe("getCollectionStatus", () => {
  it("reports zero for an empty collection", () => {
    expect(getCollectionStatus([])).toEqual({
      total: 0,
      ready: 0,
      generating: 0,
      failed: 0,
    });
  });

  it("counts each plant in exactly one state", () => {
    const plants: TPlant[] = [
      { ...withTips, id: "a", aiStatus: "ready" },
      { ...withTips, id: "b", aiStatus: "error" },
      { ...basePlant, id: "c", aiStatus: "generating" },
      { ...basePlant, id: "d", aiStatus: "error" },
      { ...basePlant, id: "e" },
    ];

    expect(getCollectionStatus(plants)).toEqual({
      total: 5,
      ready: 2,
      generating: 1,
      failed: 2,
    });
  });

  it("state counts always add up to the total", () => {
    const statuses = [undefined, "generating", "ready", "error"] as const;
    const plants: TPlant[] = [];
    for (let i = 0; i < 40; i++) {
      const source = i % 3 === 0 ? withTips : basePlant;
      plants.push({ ...source, id: String(i), aiStatus: statuses[i % statuses.length] });

      const { total, ready, generating, failed } = getCollectionStatus(plants);
      expect(total).toBe(plants.length);
      expect(ready + generating + failed).toBe(total);
    }
  });
});
