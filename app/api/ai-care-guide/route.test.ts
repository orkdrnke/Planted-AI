import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { generatePlantCareTips } from "@/lib/aiHelpers";
import { POST } from "./route";

vi.mock("@/lib/aiHelpers", () => ({
  generatePlantCareTips: vi.fn(),
}));

const mockedGenerate = vi.mocked(generatePlantCareTips);

const careTips = {
  botanicalName: "Monstera deliciosa",
  wateringFrequency: "Once a week",
  sunlightNeeds: "Bright indirect light",
  soilType: "Well-draining",
  temperatureRange: "18-27°C",
  careTips: ["Wipe the leaves"],
};

function makeRequest(body: string) {
  return new NextRequest("http://localhost/api/ai-care-guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

describe("POST /api/ai-care-guide", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(makeRequest("{not json"));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid JSON body" });
    expect(mockedGenerate).not.toHaveBeenCalled();
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest("{}"));

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "Invalid request body" });
    expect(mockedGenerate).not.toHaveBeenCalled();
  });

  it("returns 400 when name is blank", async () => {
    const res = await POST(makeRequest(JSON.stringify({ name: "   " })));

    expect(res.status).toBe(400);
    expect(mockedGenerate).not.toHaveBeenCalled();
  });

  it("returns 200 with care tips for a valid body", async () => {
    mockedGenerate.mockResolvedValue(careTips);
    const input = { name: "Monstera", type: "Indoor plants", dest: "inside" };

    const res = await POST(makeRequest(JSON.stringify(input)));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(careTips);
    expect(mockedGenerate).toHaveBeenCalledWith(input);
  });

  it("returns 502 when the AI output could not be parsed", async () => {
    mockedGenerate.mockResolvedValue(null);

    const res = await POST(makeRequest(JSON.stringify({ name: "Monstera" })));

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({
      error: "AI returned an invalid response",
    });
  });

  it("returns 500 with a safe message when the helper throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockedGenerate.mockRejectedValue(new Error("secret internal details"));

    const res = await POST(makeRequest(JSON.stringify({ name: "Monstera" })));

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to generate care guide" });
  });
});
