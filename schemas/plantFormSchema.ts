import { z } from "zod";
import { uiStrings } from "@/lib/uiStrings";

const { addPlantForm } = uiStrings;

export const PlantFormSchema = z.object({
  name: z.string().min(3, { message: addPlantForm.name.tooShort }),
  type: z.string().min(5, { message: addPlantForm.type.required }),
  size: z.string(),
  amount: z.string(),
  price: z.string(),
  dest: z.string().min(5, { message: addPlantForm.dest.tooShort }).optional(),
  dateAdded: z.string().optional(),
});
