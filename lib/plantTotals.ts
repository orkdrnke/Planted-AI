import { TPlant } from "@/types/plant";

// Parses user-entered prices like "$2,500.00" or "250"; returns null if not a number
export function parsePrice(value: string): number | null {
  const normalized = value.replace(/[^0-9.]/g, "");
  if (!normalized) return null;
  const price = Number(normalized);
  return Number.isFinite(price) ? price : null;
}

// Parses amounts like "2"; returns null if not a non-negative number
export function parseAmount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const amount = Number(trimmed);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

// Sum of price × amount; plants with an invalid price or amount are skipped
export function calculateTotalCost(
  plants: Pick<TPlant, "price" | "amount">[]
): number {
  return plants.reduce((total, plant) => {
    const price = parsePrice(plant.price);
    const amount = parseAmount(plant.amount);
    if (price === null || amount === null) return total;
    return total + price * amount;
  }, 0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
