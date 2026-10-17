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

// Product text must be Ukrainian; the brand name is the only Latin text allowed
const latinText = (container: HTMLElement) =>
  (container.textContent ?? "").replaceAll("Planted AI", "").match(/[A-Za-z]{2,}/g);

describe("existing screens are in Ukrainian", () => {
  it("header", () => {
    const { container } = render(<Header />);

    expect(latinText(container)).toBeNull();
    expect(screen.getByRole("link", { name: "Мій сад" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Додати рослину" })).toBeTruthy();
  });

  it("landing page", () => {
    const { container } = render(<Home />);

    expect(latinText(container)).toBeNull();
  });

  it("add-plant form", () => {
    const { container } = render(<AddPlantForm />);

    expect(latinText(container)).toBeNull();
    expect(screen.getByText("Додати нову рослину")).toBeTruthy();
    expect(screen.getByLabelText("Назва рослини")).toBeTruthy();
  });

  it("add-plant form shows Ukrainian validation messages", async () => {
    const { container } = render(<AddPlantForm />);

    await userEvent.click(screen.getByRole("button", { name: "Додати" }));

    expect(await screen.findByText("Назва має містити щонайменше 3 символи")).toBeTruthy();
    expect(latinText(container)).toBeNull();
  });
});

describe("plantTypeLabel", () => {
  it("shows stored plant types in Ukrainian and passes unknown values through", () => {
    expect(uiStrings.plantTypeLabel("Indoor plants")).toBe("Кімнатні рослини");
    expect(uiStrings.plantTypeLabel("Кактус")).toBe("Кактус");
  });
});
