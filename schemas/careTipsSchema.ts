import { z } from "zod";

// AI-generated care tips; shared by the server (structured output) and the client (response validation)
export const CareTipsSchema = z.object({
  botanicalName: z.string(),
  wateringFrequency: z.string(),
  sunlightNeeds: z.string(),
  soilType: z.string(),
  temperatureRange: z.string(),
  careTips: z.array(z.string()),
});

export type TCareTips = z.infer<typeof CareTipsSchema>;
