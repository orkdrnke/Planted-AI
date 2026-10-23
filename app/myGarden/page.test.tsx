// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import MyGardenPage from "./page";
import { usePlantStore } from "@/lib/store/plantsStore";
import { TPlant } from "@/types/plant";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const basePlant: TPlant = {
  id: "p1",
  name: "Monstera",
  type: "Indoor",
  price: "$250.00",
  size: "40",
  amount: "2",
  dest: "Living room",
};

const readyPlant: TPlant = {
  ...basePlant,
  aiStatus: "ready",
  wateringFrequency: "Once a week",
  wateringShort: "Once a week",
  sunlightNeeds: "Bright indirect light",
  sunlightShort: "Indirect light",
};

const plants: TPlant[] = [
  readyPlant,
  { ...basePlant, id: "p2", name: "Aloe", aiStatus: "generating" },
  { ...basePlant, id: "p3", name: "Cactus", aiStatus: "error" },
];

const statusText = () =>
  screen.getByRole("region", { name: "Collection status" }).textContent;
const plantLinks = () =>
  screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("/myGarden/"));

describe("/myGarden dashboard", () => {
  beforeEach(() => {
    usePlantStore.setState({ plants, newPlantId: null });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows the collection status above one link per plant", () => {
    render(<MyGardenPage />);

    expect(statusText()).toContain("Plants: 3");
    expect(statusText()).toContain("Ready: 1");
    expect(statusText()).toContain("Generating: 1");
    expect(statusText()).toContain("Failed: 1");
    expect(plantLinks().map((link) => link.getAttribute("href"))).toEqual([
      "/myGarden/p1",
      "/myGarden/p2",
      "/myGarden/p3",
    ]);
  });

  it("shows no price, size, amount or total", () => {
    const { container } = render(<MyGardenPage />);

    expect(container.textContent).not.toContain("$250.00");
    expect(container.textContent).not.toMatch(/total price/i);
    expect(screen.queryByText("Price")).toBeNull();
  });

  it("keeps an add action and offers no retry or remove", () => {
    render(<MyGardenPage />);

    expect(
      screen.getByRole("link", { name: "Add plant" }).getAttribute("href")
    ).toBe("/addPlant");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("lists two plants with the same name", () => {
    usePlantStore.setState({
      plants: [readyPlant, { ...readyPlant, id: "p9" }],
    });

    render(<MyGardenPage />);

    expect(plantLinks()).toHaveLength(2);
  });

  it("keeps the status in step with the rows after add, finished generation and removal", () => {
    render(<MyGardenPage />);

    act(() => {
      usePlantStore.setState((state) => ({
        plants: [...state.plants, { ...basePlant, id: "p4", aiStatus: "generating" }],
      }));
    });
    expect(plantLinks()).toHaveLength(4);
    expect(statusText()).toContain("Plants: 4");
    expect(statusText()).toContain("Generating: 2");

    act(() => {
      usePlantStore.getState().updatePlant("p4", {
        aiStatus: "ready",
        wateringShort: "Daily",
        sunlightShort: "Shade",
      });
    });
    expect(statusText()).toContain("Ready: 2");
    expect(statusText()).toContain("Generating: 1");

    act(() => {
      usePlantStore.getState().removePlant("p1");
    });
    expect(plantLinks()).toHaveLength(3);
    expect(statusText()).toContain("Plants: 3");
    expect(statusText()).toContain("Ready: 1");
  });

  it("shows the empty state with zero counts and no list headings", () => {
    usePlantStore.setState({ plants: [] });

    render(<MyGardenPage />);

    expect(screen.getByText("Your garden has no plants yet")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Add your first plant" }).getAttribute("href")
    ).toBe("/addPlant");
    expect(statusText()).toContain("Plants: 0");
    expect(screen.queryByText("Name")).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("highlights the just-added plant and clears it after about 2 seconds", () => {
    vi.useFakeTimers();
    usePlantStore.setState({ newPlantId: "p2" });

    render(<MyGardenPage />);

    const [first, second] = plantLinks();
    expect(second.className).toContain("animate-highlight");
    expect(first.className).not.toContain("animate-highlight");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(usePlantStore.getState().newPlantId).toBeNull();
  });
});
