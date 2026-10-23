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
  wateringFrequency: "Water once a week, letting the topsoil dry out",
  wateringShort: "Once a week",
  sunlightNeeds: "Bright indirect light, away from direct sun",
  sunlightShort: "Indirect light",
  careTips: ["Wipe the leaves"],
};

describe("CareTipStateLabel", () => {
  it.each([
    ["ready", "Ready"],
    ["generating", "Generating"],
    ["failed", "Failed"],
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

    expect(container.textContent).toContain("Plants: 4");
    expect(container.textContent).toContain("Ready: 2");
    expect(container.textContent).toContain("Generating: 1");
    expect(container.textContent).toContain("Failed: 1");
  });

  it("is a labelled region whose counts stay readable text", () => {
    const { container } = render(<CollectionStatus plants={[readyPlant]} />);

    const region = screen.getByRole("region", { name: "Collection status" });
    expect(region.textContent).toContain("Plants: 1");
    // ARIA 1.2 prohibits naming a paragraph, and a name would hide the counts
    expect(container.querySelector("p[aria-label]")).toBeNull();
  });

  it("reports zero for an empty collection", () => {
    const { container } = render(<CollectionStatus plants={[]} />);

    expect(container.textContent).toContain("Plants: 0");
    expect(container.textContent).toContain("Ready: 0");
    expect(container.textContent).toContain("Generating: 0");
    expect(container.textContent).toContain("Failed: 0");
  });
});

describe("EmptyState", () => {
  it("shows the message and a prominent action to add the first plant", () => {
    render(<EmptyState />);

    expect(screen.getByText("Your garden has no plants yet")).toBeTruthy();
    const action = screen.getByRole("link", { name: "Add your first plant" });
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

    expect(within(link).getByText("Monstera")).toBeTruthy();
    expect(within(link).getByText("Ready")).toBeTruthy();
    expect(within(link).getByText("Indoor")).toBeTruthy();
    expect(within(link).getByText("Living room")).toBeTruthy();
    expect(within(link).getByText("Once a week")).toBeTruthy();
    expect(within(link).getByText("Indirect light")).toBeTruthy();
    expect(link.textContent).not.toContain("$250.00");
    expect(link.textContent).not.toContain("40");
    expect(link.textContent).not.toMatch(/\b2\b/);
  });

  it("shows the pending label in the watering and light cells while generating", () => {
    render(<PlantListItem plant={{ ...basePlant, aiStatus: "generating" }} />);

    expect(screen.getByText("Generating")).toBeTruthy();
    expect(screen.getAllByText("Pending")).toHaveLength(2);
  });

  it("shows the unavailable label for a failed plant, with no retry", () => {
    render(<PlantListItem plant={{ ...basePlant, aiStatus: "error" }} />);

    expect(screen.getByText("Failed")).toBeTruthy();
    expect(screen.getAllByText("Unavailable")).toHaveLength(2);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("counts a plant with stored tips and a failed regeneration as ready", () => {
    render(<PlantListItem plant={{ ...readyPlant, aiStatus: "error" }} />);

    expect(screen.getByText("Ready")).toBeTruthy();
    expect(screen.getByText("Once a week")).toBeTruthy();
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
    const name = "A very long plant name that does not fit on a single line of the row";
    render(<PlantListItem plant={{ ...readyPlant, name }} />);

    const nameElement = screen.getByText(name);
    expect(nameElement.className).toContain("truncate");
    expect(screen.getByRole("link").textContent).toContain(name);
  });

  it("never truncates the short watering and light notes", () => {
    render(<PlantListItem plant={readyPlant} />);

    for (const note of ["Once a week", "Indirect light"]) {
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
    const dest = "Windowsillintheeasternroomnexttotheworkdesk";
    render(<PlantListItem plant={{ ...readyPlant, dest }} />);

    for (const text of [dest, "Indoor"]) {
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
