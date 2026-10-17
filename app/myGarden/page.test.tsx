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
  name: "Монстера",
  type: "Кімнатна",
  price: "$250.00",
  size: "40",
  amount: "2",
  dest: "Кімната",
};

const readyPlant: TPlant = {
  ...basePlant,
  aiStatus: "ready",
  wateringFrequency: "Once a week",
  wateringShort: "Раз на тиждень",
  sunlightNeeds: "Bright indirect light",
  sunlightShort: "Розсіяне",
};

const plants: TPlant[] = [
  readyPlant,
  { ...basePlant, id: "p2", name: "Алое", aiStatus: "generating" },
  { ...basePlant, id: "p3", name: "Кактус", aiStatus: "error" },
];

const statusText = () =>
  screen.getByRole("region", { name: "Стан колекції" }).textContent;
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

    expect(statusText()).toContain("Рослин: 3");
    expect(statusText()).toContain("Готово: 1");
    expect(statusText()).toContain("Генерується: 1");
    expect(statusText()).toContain("Помилка: 1");
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
      screen.getByRole("link", { name: "Додати рослину" }).getAttribute("href")
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
    expect(statusText()).toContain("Рослин: 4");
    expect(statusText()).toContain("Генерується: 2");

    act(() => {
      usePlantStore.getState().updatePlant("p4", {
        aiStatus: "ready",
        wateringShort: "Щодня",
        sunlightShort: "Тінь",
      });
    });
    expect(statusText()).toContain("Готово: 2");
    expect(statusText()).toContain("Генерується: 1");

    act(() => {
      usePlantStore.getState().removePlant("p1");
    });
    expect(plantLinks()).toHaveLength(3);
    expect(statusText()).toContain("Рослин: 3");
    expect(statusText()).toContain("Готово: 1");
  });

  it("shows the empty state with zero counts and no list headings", () => {
    usePlantStore.setState({ plants: [] });

    render(<MyGardenPage />);

    expect(screen.getByText("У вашому саду ще немає рослин")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Додати першу рослину" }).getAttribute("href")
    ).toBe("/addPlant");
    expect(statusText()).toContain("Рослин: 0");
    expect(screen.queryByText("Назва")).toBeNull();
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
