// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { CareTipStateLabel } from "./careTipStateLabel";
import { CollectionStatus } from "./collectionStatus";
import { EmptyState } from "./emptyState";
import { PlantListItem } from "./plantListItem";
import { TPlant } from "@/types/plant";

afterEach(cleanup);

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
  wateringFrequency: "Water once a week, letting the topsoil dry out",
  wateringShort: "Раз на тиждень",
  sunlightNeeds: "Bright indirect light, away from direct sun",
  sunlightShort: "Розсіяне",
  careTips: ["Wipe the leaves"],
};

describe("CareTipStateLabel", () => {
  it.each([
    ["ready", "Готово"],
    ["generating", "Генерується"],
    ["failed", "Помилка"],
  ] as const)("shows the %s state as text", (state, text) => {
    render(<CareTipStateLabel state={state} />);

    expect(screen.getByText(text)).toBeTruthy();
  });

  it("hides the decorative icon from assistive technology", () => {
    const { container } = render(<CareTipStateLabel state="generating" />);

    const icon = container.querySelector("svg");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("CollectionStatus", () => {
  it("shows the total and each state count as text", () => {
    const plants: TPlant[] = [
      { ...readyPlant, id: "a" },
      { ...readyPlant, id: "b", aiStatus: "error" },
      { ...basePlant, id: "c", aiStatus: "generating" },
      { ...basePlant, id: "d" },
    ];

    const { container } = render(<CollectionStatus plants={plants} />);

    expect(container.textContent).toContain("Рослин: 4");
    expect(container.textContent).toContain("Готово: 2");
    expect(container.textContent).toContain("Генерується: 1");
    expect(container.textContent).toContain("Помилка: 1");
  });

  it("is a labelled region whose counts stay readable text", () => {
    const { container } = render(<CollectionStatus plants={[readyPlant]} />);

    const region = screen.getByRole("region", { name: "Стан колекції" });
    expect(region.textContent).toContain("Рослин: 1");
    // ARIA 1.2 prohibits naming a paragraph, and a name would hide the counts
    expect(container.querySelector("p[aria-label]")).toBeNull();
  });

  it("reports zero for an empty collection", () => {
    const { container } = render(<CollectionStatus plants={[]} />);

    expect(container.textContent).toContain("Рослин: 0");
    expect(container.textContent).toContain("Готово: 0");
    expect(container.textContent).toContain("Генерується: 0");
    expect(container.textContent).toContain("Помилка: 0");
  });
});

describe("EmptyState", () => {
  it("shows the message and a prominent action to add the first plant", () => {
    render(<EmptyState />);

    expect(screen.getByText("У вашому саду ще немає рослин")).toBeTruthy();
    const action = screen.getByRole("link", { name: "Додати першу рослину" });
    expect(action.getAttribute("href")).toBe("/addPlant");
  });
});

describe("PlantListItem", () => {
  it("is a single link to the plant page with no nested interactive elements", () => {
    const { container } = render(<PlantListItem plant={readyPlant} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("/myGarden/p1");
    expect(links[0].querySelectorAll("a, button, input, select, textarea")).toHaveLength(0);
    expect(container.querySelectorAll("[tabindex]")).toHaveLength(0);
  });

  it("shows name, state label, type, location and short notes, but not price, size or amount", () => {
    render(<PlantListItem plant={readyPlant} />);
    const link = screen.getByRole("link");

    expect(within(link).getByText("Монстера")).toBeTruthy();
    expect(within(link).getByText("Готово")).toBeTruthy();
    expect(within(link).getByText("Кімнатна")).toBeTruthy();
    expect(within(link).getByText("Кімната")).toBeTruthy();
    expect(within(link).getByText("Раз на тиждень")).toBeTruthy();
    expect(within(link).getByText("Розсіяне")).toBeTruthy();
    expect(link.textContent).not.toContain("$250.00");
    expect(link.textContent).not.toContain("40");
    expect(link.textContent).not.toMatch(/\b2\b/);
  });

  it("shows the pending label in the watering and light cells while generating", () => {
    render(<PlantListItem plant={{ ...basePlant, aiStatus: "generating" }} />);

    expect(screen.getByText("Генерується")).toBeTruthy();
    expect(screen.getAllByText("Очікується")).toHaveLength(2);
  });

  it("shows the unavailable label for a failed plant, with no retry", () => {
    render(<PlantListItem plant={{ ...basePlant, aiStatus: "error" }} />);

    expect(screen.getByText("Помилка")).toBeTruthy();
    expect(screen.getAllByText("Недоступно")).toHaveLength(2);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("counts a plant with stored tips and a failed regeneration as ready", () => {
    render(<PlantListItem plant={{ ...readyPlant, aiStatus: "error" }} />);

    expect(screen.getByText("Готово")).toBeTruthy();
    expect(screen.getByText("Раз на тиждень")).toBeTruthy();
  });

  it("shows a dash when no location was entered", () => {
    render(<PlantListItem plant={{ ...readyPlant, dest: undefined }} />);

    expect(screen.getByText("—")).toBeTruthy();
  });

  it("falls back to the full text for ready tips without short notes", () => {
    render(
      <PlantListItem
        plant={{ ...readyPlant, wateringShort: undefined, sunlightShort: undefined }}
      />
    );

    expect(screen.getByText(readyPlant.wateringFrequency!)).toBeTruthy();
    expect(screen.getByText(readyPlant.sunlightNeeds!)).toBeTruthy();
  });

  it("truncates a long name visually but keeps the full name in the link", () => {
    const name = "Дуже довга назва рослини, яка не вміщується в рядок";
    render(<PlantListItem plant={{ ...readyPlant, name }} />);

    const nameElement = screen.getByText(name);
    expect(nameElement.className).toContain("truncate");
    expect(screen.getByRole("link").textContent).toContain(name);
  });

  it("never truncates the short watering and light notes", () => {
    render(<PlantListItem plant={readyPlant} />);

    for (const note of ["Раз на тиждень", "Розсіяне"]) {
      const cell = screen.getByText(note);
      expect(cell.className).not.toMatch(/truncate/);
    }
  });

  it("may truncate the full-text fallback on wide screens", () => {
    render(
      <PlantListItem
        plant={{ ...readyPlant, wateringShort: undefined, sunlightShort: undefined }}
      />
    );

    expect(screen.getByText(readyPlant.wateringFrequency!).className).toContain("md:truncate");
    expect(screen.getByText(readyPlant.sunlightNeeds!).className).toContain("md:truncate");
  });

  it("keeps a long unbroken type or location inside the card at every width", () => {
    const dest = "Підвіконнявсхіднійкімнатібіляробочогостолу";
    render(<PlantListItem plant={{ ...readyPlant, dest }} />);

    for (const text of [dest, "Кімнатна"]) {
      const cell = screen.getByText(text);
      expect(cell.className.split(" ")).toEqual(
        expect.arrayContaining(["min-w-0", "truncate"])
      );
    }
  });

  it("renders markup in the name as plain text", () => {
    const name = "<img src=x onerror=alert(1)>";
    const { container } = render(<PlantListItem plant={{ ...readyPlant, name }} />);

    expect(screen.getByText(name)).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
  });

  it("highlights a just-added plant", () => {
    render(<PlantListItem plant={readyPlant} highlighted />);

    expect(screen.getByRole("link").className).toContain("animate-highlight");
  });

  it("does not highlight other plants", () => {
    render(<PlantListItem plant={readyPlant} />);

    expect(screen.getByRole("link").className).not.toContain("animate-highlight");
  });
});
