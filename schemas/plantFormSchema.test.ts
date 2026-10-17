import { describe, expect, it } from "vitest";
import { PlantFormSchema } from "./plantFormSchema";

const valid = {
  name: "Монстера",
  type: "Indoor plants",
  size: "40",
  amount: "2",
  price: "250",
  dest: "inside",
};

const messageFor = (data: unknown, field: string) => {
  const result = PlantFormSchema.safeParse(data);
  if (result.success) return undefined;
  return result.error.flatten().fieldErrors[field as keyof typeof valid]?.[0];
};

describe("PlantFormSchema", () => {
  it("accepts a valid plant, with or without a destination", () => {
    expect(PlantFormSchema.safeParse(valid).success).toBe(true);
    expect(PlantFormSchema.safeParse({ ...valid, dest: undefined }).success).toBe(true);
  });

  it("keeps the name rule (min 3) with a Ukrainian message", () => {
    expect(PlantFormSchema.safeParse({ ...valid, name: "abc" }).success).toBe(true);
    expect(messageFor({ ...valid, name: "ab" }, "name")).toBe(
      "Назва має містити щонайменше 3 символи"
    );
  });

  it("keeps the type rule (min 5) with a Ukrainian message", () => {
    expect(messageFor({ ...valid, type: "abcd" }, "type")).toBe("Оберіть тип рослини");
  });

  it("keeps the destination rule (min 5 when present) with a Ukrainian message", () => {
    expect(messageFor({ ...valid, dest: "abcd" }, "dest")).toBe(
      "Призначення має містити щонайменше 5 символів"
    );
  });
});
