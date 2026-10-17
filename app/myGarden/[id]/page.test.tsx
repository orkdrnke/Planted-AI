// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlantDetailPage from "./page";
import { usePlantStore } from "@/lib/store/plantsStore";
import { TPlant } from "@/types/plant";

const { params, push } = vi.hoisted(() => ({ params: { id: "p1" }, push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useParams: () => params,
  useRouter: () => ({ push }),
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
  botanicalName: "Monstera deliciosa",
  wateringFrequency: "Water once a week, letting the topsoil dry out.",
  wateringShort: "Раз на тиждень",
  sunlightNeeds: "Bright indirect light.",
  sunlightShort: "Розсіяне",
  temperatureRange: "18-27°C",
  soilType: "Well-draining peat mix.",
  careTips: ["Wipe the leaves.", "Rotate the pot monthly!"],
};

const FAILURE = "Не вдалося створити поради з догляду.";
const generateCareTips = vi.fn(async () => {});

function renderWith(plant: TPlant) {
  usePlantStore.setState({ plants: [plant], generateCareTips });
  return render(<PlantDetailPage />);
}

describe("/myGarden/[id] plant page", () => {
  beforeEach(() => {
    params.id = "p1";
  });

  afterEach(() => {
    cleanup();
    generateCareTips.mockClear();
    push.mockClear();
  });

  it("shows full care tips and every entered detail for a ready plant", () => {
    const { container } = renderWith(readyPlant);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Монстера");
    expect(screen.getByText("Готово")).toBeTruthy();
    expect(container.textContent).toContain("Monstera deliciosa");
    expect(container.textContent).toContain(readyPlant.wateringFrequency);
    expect(container.textContent).toContain(readyPlant.sunlightNeeds);
    expect(container.textContent).toContain(readyPlant.temperatureRange);
    expect(container.textContent).toContain(readyPlant.soilType);
    // Each tip keeps its last character
    expect(container.textContent).toContain("Wipe the leaves.");
    expect(container.textContent).toContain("Rotate the pot monthly!");
    expect(container.textContent).toContain("$250.00");
    expect(container.textContent).toContain("40 см");
    expect(container.textContent).toContain("Кімната");
    expect(screen.getByRole("button", { name: "Згенерувати знову" })).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("links back to the dashboard", () => {
    renderWith(readyPlant);

    expect(screen.getByRole("link", { name: /До саду/ }).getAttribute("href")).toBe(
      "/myGarden"
    );
  });

  it("keeps stored tips and disables regenerate while a regeneration is under way", () => {
    const { container } = renderWith({ ...readyPlant, aiStatus: "generating" });

    expect(screen.getByText("Готово")).toBeTruthy();
    expect(container.textContent).toContain("Wipe the leaves.");
    const button = screen.getByRole("button", { name: "Згенерувати знову" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows stored tips and no failure message when a regeneration failed", () => {
    const { container } = renderWith({
      ...readyPlant,
      aiStatus: "error",
      aiError: "AI returned an invalid response",
    });

    expect(screen.getByText("Готово")).toBeTruthy();
    expect(container.textContent).toContain("Wipe the leaves.");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(container.textContent).not.toContain("AI returned an invalid response");
  });

  it("shows a status banner and pending sections while tips are generating", () => {
    renderWith({ ...basePlant, aiStatus: "generating" });

    expect(screen.getByRole("status").textContent).toContain("Поради з догляду готуються…");
    expect(screen.getByText("Генерується")).toBeTruthy();
    expect(screen.getAllByText("Очікується").length).toBeGreaterThanOrEqual(5);
  });

  it.each([
    ["failed generation", { aiStatus: "error", aiError: "secret internal details" }],
    ["never started", {}],
  ] as const)(
    "shows one fixed failure sentence with retry for a %s, keeping details",
    (_, ai) => {
      const { container } = renderWith({ ...basePlant, ...ai });

      expect(screen.getByRole("alert").textContent).toContain(FAILURE);
      expect(screen.getByText("Помилка")).toBeTruthy();
      expect(container.textContent).not.toContain("secret internal details");
      expect(container.textContent).toContain("$250.00");
      expect(container.textContent).toContain("Кімнатна");
      expect(screen.getAllByText("Недоступно").length).toBeGreaterThanOrEqual(5);
    }
  );

  it("asks for new care tips for this plant on retry", async () => {
    renderWith({ ...basePlant, aiStatus: "error" });

    await userEvent.click(screen.getByRole("button", { name: "Спробувати ще" }));

    expect(generateCareTips).toHaveBeenCalledWith("p1");
  });

  it("shows the not-found message with a way back for an unknown id", () => {
    params.id = "missing";
    renderWith(readyPlant);

    expect(screen.getByText(/Рослину не знайдено/)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Повернутися до саду" }).getAttribute("href")
    ).toBe("/myGarden");
    expect(screen.queryByText("Монстера")).toBeNull();
  });

  it("shows the last watered date with correct wording", () => {
    const { container } = renderWith({ ...readyPlant, lastWatered: "2026-10-01" });

    expect(container.textContent).toContain("Востаннє поливали:");
    expect(container.textContent).not.toMatch(/watred/i);
  });

  describe("removal", () => {
    const otherPlant: TPlant = { ...readyPlant, id: "p2", name: "Фікус" };

    function renderCollection() {
      usePlantStore.setState({ plants: [readyPlant, otherPlant], generateCareTips });
      return render(<PlantDetailPage />);
    }

    const openDialog = async () => {
      await userEvent.click(screen.getByRole("button", { name: "Видалити рослину" }));
      return screen.getByRole("dialog");
    };

    it("asks for confirmation naming the plant", async () => {
      renderCollection();

      const dialog = await openDialog();

      expect(dialog.textContent).toContain("Видалити «Монстера»?");
      expect(dialog.textContent).toContain("Цю дію не можна скасувати.");
    });

    it("keeps the plant and returns focus when cancelled", async () => {
      renderCollection();
      await openDialog();

      await userEvent.click(screen.getByRole("button", { name: "Скасувати" }));

      expect(screen.queryByRole("dialog")).toBeNull();
      expect(usePlantStore.getState().plants).toHaveLength(2);
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Видалити рослину" })
      );
      expect(push).not.toHaveBeenCalled();
    });

    it("keeps the plant when closed with Escape", async () => {
      renderCollection();
      await openDialog();

      await userEvent.keyboard("{Escape}");

      expect(screen.queryByRole("dialog")).toBeNull();
      expect(usePlantStore.getState().plants).toHaveLength(2);
    });

    it("removes only this plant and returns to the dashboard on confirm", async () => {
      renderCollection();
      const dialog = await openDialog();

      await userEvent.click(within(dialog).getByRole("button", { name: "Видалити" }));

      expect(usePlantStore.getState().plants).toEqual([otherPlant]);
      expect(push).toHaveBeenCalledWith("/myGarden");
      expect(screen.queryByText(/Рослину не знайдено/)).toBeNull();
    });

    it("shows the plant name with markup as plain text in the dialog title", async () => {
      usePlantStore.setState({
        plants: [{ ...readyPlant, name: "<i>x</i>" }],
        generateCareTips,
      });
      render(<PlantDetailPage />);

      const dialog = await openDialog();

      expect(dialog.textContent).toContain("Видалити «<i>x</i>»?");
      expect(dialog.querySelector("i")).toBeNull();
    });
  });

  it("renders markup in the name as plain text", () => {
    const name = "<b>bold</b>";
    renderWith({ ...readyPlant, name });

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain(name);
    expect(heading.querySelector("b")).toBeNull();
  });
});
