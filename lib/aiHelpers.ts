import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

// Zod schema for the structured care tips
const CareTips = z.object({
  name: z.string(),
  botanicalName: z.string(),
  wateringFrequency: z.string(),
  sunlightNeeds: z.string(),
  soilType: z.string(),
  temperatureRange: z.string(),
  careTips: z.array(z.string()),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePlantCareTips(params: {
  name: string;
  type?: string;
  dest?: string;
}) {
  const { name, type, dest } = params;

  const prompt = `
    You are a gardening assistant. Given the plant info below, return a JSON-like text matching the "care_tips" schema.
    Plant name: "${name}"
    Type: "${type ?? "unspecified"}"
    dest: "${dest ?? "unspecified"}"
`;

  try {
    // responses.parse() validates the output against the Zod schema
    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.1,
      max_output_tokens: 200,
      text: {
        format: zodTextFormat(CareTips, "care_tips"),
      },
    });

    if (!response.output_parsed) throw new Error("No parsed output in response");

    return response.output_parsed;
  } catch (err) {
    console.error("AI parsing/validation error:", err);
    // return empty safe fallback (or throw depending on your app flow)
    return null;
  }
}
