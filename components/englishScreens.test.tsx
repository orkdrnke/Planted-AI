// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import AddPlantForm from "@/app/addPlant/page";
import Header from "./header";
import { uiStrings } from "@/lib/uiStrings";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

afterEach(cleanup);

// Product text is English (the default locale); no Cyrillic may be rendered
const cyrillicText = (container: HTMLElement) =>
  (container.textContent ?? "").match(/[Ѐ-ӿ]+/g);

describe("existing screens are in English", () => {
  it("header", () => {
    const { container } = render(<Header />);

    expect(cyrillicText(container)).toBeNull();
    expect(screen.getByRole("link", { name: "My Garden" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Add plant" })).toBeTruthy();
  });

  it("landing page", () => {
    const { container } = render(<Home />);

    expect(cyrillicText(container)).toBeNull();
  });

  it("add-plant form", () => {
    const { container } = render(<AddPlantForm />);

    expect(cyrillicText(container)).toBeNull();
    expect(screen.getByText("Add a new plant")).toBeTruthy();
    expect(screen.getByLabelText("Plant name")).toBeTruthy();
  });

  it("add-plant form shows English validation messages", async () => {
    const { container } = render(<AddPlantForm />);

    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Name must be at least 3 characters")).toBeTruthy();
    expect(cyrillicText(container)).toBeNull();
  });
});

describe("plantTypeLabel", () => {
  it("shows stored plant types as English labels and passes unknown values through", () => {
    expect(uiStrings.plantTypeLabel("Indoor plants")).toBe("Indoor plants");
    expect(uiStrings.plantTypeLabel("Cactus")).toBe("Cactus");
  });
});
