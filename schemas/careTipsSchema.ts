import { z } from "zod";

export const SHORT_NOTE_MAX_LENGTH = 40;

// AI-generated care tips; shared by the server (structured output) and the client (response validation).
// Strict structured output does not support maxLength, so the short-note limit is a refinement:
// it is left out of the JSON schema sent to OpenAI but checked whenever the schema parses data.
export const CareTipsSchema = z
  .object({
    botanicalName: z.string(),
    wateringFrequency: z.string(),
    wateringShort: z.string(),
    sunlightNeeds: z.string(),
    sunlightShort: z.string(),
    soilType: z.string(),
    temperatureRange: z.string(),
    careTips: z.array(z.string()),
  })
  .superRefine((tips, ctx) => {
    for (const key of ["wateringShort", "sunlightShort"] as const) {
      if (tips[key].length > SHORT_NOTE_MAX_LENGTH) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `Must be at most ${SHORT_NOTE_MAX_LENGTH} characters`,
        });
      }
    }
  });

export type TCareTips = z.infer<typeof CareTipsSchema>;
