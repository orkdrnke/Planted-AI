import { describe, expect, it } from "vitest";
import { uiStrings } from "./uiStrings";

describe("uiStrings", () => {
  it("names the plant in the removal dialog title", () => {
    expect(uiStrings.removeDialog.title("Monstera")).toBe('Remove "Monstera"?');
  });

  it("formats the collection status counts", () => {
    expect(uiStrings.status.total(4)).toBe("Plants: 4");
    expect(uiStrings.status.ready(2)).toBe("Ready: 2");
    expect(uiStrings.status.generating(1)).toBe("Generating: 1");
    expect(uiStrings.status.failed(0)).toBe("Failed: 0");
  });

  it("uses one fixed failure sentence on the plant page", () => {
    expect(uiStrings.plantPage.failed).toBe("Could not create care tips.");
  });

  it("labels the watering and light cells per care-tip state", () => {
    expect(uiStrings.cell.generating).toBe("Pending");
    expect(uiStrings.cell.failed).toBe("Unavailable");
  });

  it("keeps the default (English) strings free of Cyrillic", () => {
    const cyrillic = /[Ѐ-ӿ]/;
    const collect = (value: unknown): string[] =>
      typeof value === "string"
        ? [value]
        : typeof value === "function"
          ? []
          : Object.values(value as object).flatMap(collect);

    expect(collect(uiStrings).filter((text) => cyrillic.test(text))).toEqual([]);
  });
});
