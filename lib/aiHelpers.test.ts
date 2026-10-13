import { afterEach, describe, expect, it, vi } from "vitest";
import { generatePlantCareTips } from "./aiHelpers";

const { parseMock } = vi.hoisted(() => ({ parseMock: vi.fn() }));

vi.mock("openai", () => ({
  default: class {
    responses = { parse: parseMock };
  },
}));

const careTips = {
  botanicalName: "Monstera deliciosa",
  wateringFrequency: "Once a week",
  sunlightNeeds: "Bright indirect light",
  soilType: "Well-draining",
  temperatureRange: "18-27°C",
  careTips: ["Wipe the leaves"],
};

describe("generatePlantCareTips", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("returns the parsed output", async () => {
    parseMock.mockResolvedValue({ status: "completed", output_parsed: careTips });

    const result = await generatePlantCareTips({ name: "Monstera" });

    expect(result).toEqual(careTips);
    expect(parseMock).toHaveBeenCalledWith(
      expect.objectContaining({ model: "gpt-4o-mini" })
    );
  });

  it("passes plant info to the prompt", async () => {
    parseMock.mockResolvedValue({ status: "completed", output_parsed: careTips });

    await generatePlantCareTips({
      name: "Monstera",
      type: "Indoor plants",
      dest: "inside",
    });

    const { input } = parseMock.mock.calls[0][0];
    expect(input).toContain("Monstera");
    expect(input).toContain("Indoor plants");
    expect(input).toContain("inside");
  });

  it("returns null when output_parsed is empty", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    parseMock.mockResolvedValue({ status: "completed", output_parsed: null });

    expect(await generatePlantCareTips({ name: "Monstera" })).toBeNull();
  });

  it("returns null when the response is incomplete", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    parseMock.mockResolvedValue({
      status: "incomplete",
      incomplete_details: { reason: "max_output_tokens" },
      output_parsed: careTips,
    });

    expect(await generatePlantCareTips({ name: "Monstera" })).toBeNull();
  });

  it("uses a token limit that fits the full care tips", async () => {
    parseMock.mockResolvedValue({ status: "completed", output_parsed: careTips });

    await generatePlantCareTips({ name: "Monstera" });

    expect(parseMock.mock.calls[0][0].max_output_tokens).toBeGreaterThanOrEqual(600);
  });

  it("returns null when the OpenAI call fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    parseMock.mockRejectedValue(new Error("network error"));

    expect(await generatePlantCareTips({ name: "Monstera" })).toBeNull();
  });
});
