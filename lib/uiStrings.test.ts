import { describe, expect, it } from "vitest";
import { uiStrings } from "./uiStrings";

describe("uiStrings", () => {
  it("names the plant in the removal dialog title", () => {
    expect(uiStrings.removeDialog.title("Монстера")).toBe("Видалити «Монстера»?");
  });

  it("formats the collection status counts", () => {
    expect(uiStrings.status.total(4)).toBe("Рослин: 4");
    expect(uiStrings.status.ready(2)).toBe("Готово: 2");
    expect(uiStrings.status.generating(1)).toBe("Генерується: 1");
    expect(uiStrings.status.failed(0)).toBe("Помилка: 0");
  });

  it("uses one fixed failure sentence on the plant page", () => {
    expect(uiStrings.plantPage.failed).toBe("Не вдалося створити поради з догляду.");
  });

  it("labels the watering and light cells per care-tip state", () => {
    expect(uiStrings.cell.generating).toBe("Очікується");
    expect(uiStrings.cell.failed).toBe("Недоступно");
  });
});
