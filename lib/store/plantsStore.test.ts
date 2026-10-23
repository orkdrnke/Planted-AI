import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

const careTips = {
  botanicalName: "Monstera deliciosa",
  wateringFrequency: "Once a week",
  wateringShort: "Weekly",
  sunlightNeeds: "Bright indirect light",
  sunlightShort: "Bright, indirect",
  soilType: "Well-draining",
  temperatureRange: "18-27°C",
  careTips: ["Wipe the leaves"],
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const getPlant = (id: string) =>
  usePlantStore.getState().plants.find((p) => p.id === id);

describe("generateCareTips", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    usePlantStore.setState({ plants: [plant, otherPlant] });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("sends plant info and merges care tips on success", async () => {
    fetchMock.mockResolvedValue(jsonResponse(careTips));

    await usePlantStore.getState().generateCareTips("p1");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/ai-care-guide");
    expect(JSON.parse(init?.body as string)).toEqual({
      name: "Monstera",
      type: "Indoor plants",
      dest: "inside",
    });
    expect(getPlant("p1")).toEqual({
      ...plant,
      ...careTips,
      aiStatus: "ready",
      aiError: undefined,
    });
  });

  it("sets generating status while the request is pending", async () => {
    fetchMock.mockResolvedValue(jsonResponse(careTips));

    const pending = usePlantStore.getState().generateCareTips("p1");
    expect(getPlant("p1")?.aiStatus).toBe("generating");

    await pending;
    expect(getPlant("p1")?.aiStatus).toBe("ready");
  });

  it("merges only AI fields and keeps user-entered data", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ...careTips, name: "Overwritten", price: "$0" })
    );

    await usePlantStore.getState().generateCareTips("p1");

    expect(getPlant("p1")).toMatchObject({
      name: "Monstera",
      price: "$20.00",
      notes: "Near the window",
    });
  });

  it("sets error status with the server message on a non-OK response", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: "AI returned an invalid response" }, 502)
    );

    await usePlantStore.getState().generateCareTips("p1");

    expect(getPlant("p1")).toMatchObject({
      aiStatus: "error",
      aiError: "AI returned an invalid response",
    });
  });

  it("sets a fallback error message for a non-JSON error response", async () => {
    fetchMock.mockResolvedValue(new Response("Bad gateway", { status: 502 }));

    await usePlantStore.getState().generateCareTips("p1");

    expect(getPlant("p1")).toMatchObject({
      aiStatus: "error",
      aiError: "Request failed with status 502",
    });
  });

  it("sets error status on a network error", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await usePlantStore.getState().generateCareTips("p1");

    expect(getPlant("p1")).toMatchObject({
      aiStatus: "error",
      aiError: "Network error. Please try again.",
    });
  });

  it("sets error status when the response does not match the schema", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ wateringFrequency: 1 }));

    await usePlantStore.getState().generateCareTips("p1");

    expect(getPlant("p1")?.aiStatus).toBe("error");
    expect(getPlant("p1")?.wateringFrequency).toBeUndefined();
  });

  it("sets error status when a short note is missing", async () => {
    const withoutShort: Record<string, unknown> = { ...careTips };
    delete withoutShort.wateringShort;
    fetchMock.mockResolvedValue(jsonResponse(withoutShort));

    await usePlantStore.getState().generateCareTips("p1");

    expect(getPlant("p1")?.aiStatus).toBe("error");
    expect(getPlant("p1")?.wateringFrequency).toBeUndefined();
  });

  it("sets error status when a short note is longer than 40 characters", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ...careTips, sunlightShort: "x".repeat(41) })
    );

    await usePlantStore.getState().generateCareTips("p1");

    expect(getPlant("p1")?.aiStatus).toBe("error");
    expect(getPlant("p1")?.sunlightShort).toBeUndefined();
  });

  it("clears a previous error on retry", async () => {
    usePlantStore
      .getState()
      .updatePlant("p1", { aiStatus: "error", aiError: "Old error" });
    fetchMock.mockResolvedValue(jsonResponse(careTips));

    await usePlantStore.getState().generateCareTips("p1");

    expect(getPlant("p1")).toMatchObject({ aiStatus: "ready" });
    expect(getPlant("p1")?.aiError).toBeUndefined();
  });

  it("ignores the result if the plant was removed during the request", async () => {
    let resolveFetch: (res: Response) => void = () => {};
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      })
    );

    const pending = usePlantStore.getState().generateCareTips("p1");
    usePlantStore.getState().removePlant("p1");
    resolveFetch(jsonResponse(careTips));
    await pending;

    expect(usePlantStore.getState().plants).toEqual([otherPlant]);
  });

  it("does not start a second request while generating", async () => {
    usePlantStore.getState().updatePlant("p1", { aiStatus: "generating" });

    await usePlantStore.getState().generateCareTips("p1");

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does nothing for an unknown id", async () => {
    await usePlantStore.getState().generateCareTips("missing");

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("removePlant", () => {
  it("removes only the chosen plant and keeps the others with their tips", () => {
    const withTips: TPlant = { ...otherPlant, ...careTips, aiStatus: "ready" };
    usePlantStore.setState({ plants: [plant, withTips] });

    usePlantStore.getState().removePlant("p1");

    expect(usePlantStore.getState().plants).toEqual([withTips]);
  });
});

describe("addPlant", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    usePlantStore.setState({ plants: [], newPlantId: null });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("adds the plant immediately and starts AI generation", async () => {
    fetchMock.mockResolvedValue(jsonResponse(careTips));
    const input: Omit<TPlant, "id"> = {
      name: "Monstera",
      type: "Indoor plants",
      price: "$20.00",
      size: "50",
      amount: "1",
    };

    usePlantStore.getState().addPlant(input);

    const { plants, newPlantId } = usePlantStore.getState();
    expect(plants).toHaveLength(1);
    expect(plants[0]).toMatchObject({ ...input, id: newPlantId });
    expect(plants[0].aiStatus).toBe("generating");

    await vi.waitFor(() =>
      expect(usePlantStore.getState().plants[0].aiStatus).toBe("ready")
    );
  });
});
