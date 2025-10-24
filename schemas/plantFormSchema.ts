import { z } from "zod";

export const PlantFormSchema = z.object({
  name: z.string().min(3, { message: "too short" }),
  type: z.string().min(5, { message: "min 5 chars" }),
  size: z.string(),
  amount: z.string(),
  price: z.string(),
  dest: z.string().min(5, { message: "min 5 chars" }).optional(),
  dateAdded: z.string().optional(),
});
