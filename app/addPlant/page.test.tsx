// @vitest-environment jsdom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddPlantForm from "./page";
import { usePlantStore } from "@/lib/store/plantsStore";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

// The store's background AI request is not under test here
const generateCareTips = vi.fn(async () => {});

beforeAll(() => {
  // Radix Select uses browser APIs that jsdom does not implement
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
});

describe("/addPlant form", () => {
  beforeEach(() => {
    usePlantStore.setState({ plants: [], newPlantId: null, generateCareTips });
  });

  afterEach(() => {
    cleanup();
    replace.mockClear();
    generateCareTips.mockClear();
  });

  it("adds the plant, marks it as new and lands on the dashboard", async () => {
    const user = userEvent.setup();
    render(<AddPlantForm />);

    await user.type(screen.getByLabelText("Plant name"), "Monstera");
    // The type Select trigger is the form's only combobox
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Indoor plants" }));
    await user.type(screen.getByLabelText("Destination"), "inside");
    await user.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/myGarden"));
    const { plants, newPlantId } = usePlantStore.getState();
    expect(plants).toHaveLength(1);
    expect(plants[0]).toMatchObject({
      name: "Monstera",
      type: "Indoor plants",
      dest: "inside",
    });
    expect(newPlantId).toBe(plants[0].id);
    expect(generateCareTips).toHaveBeenCalledWith(plants[0].id);
  });

  it("stays on the form and adds nothing when the input is invalid", async () => {
    const user = userEvent.setup();
    render(<AddPlantForm />);

    await user.type(screen.getByLabelText("Plant name"), "Mo");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Name must be at least 3 characters")).toBeTruthy();
    expect(replace).not.toHaveBeenCalled();
    expect(usePlantStore.getState().plants).toHaveLength(0);
  });
});
