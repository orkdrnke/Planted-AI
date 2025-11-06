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

console.log("OpenAI API Key Loaded:", process.env.OPENAI_API_KEY);

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

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    temperature: 0.1,
    max_output_tokens: 200,
    text: {
      format: zodTextFormat(CareTips, "care_tips"),
    },
  });

  try {
    // try SDK-parsed variant (if SDK provides it after zodTextFormat)
    const parsedFromSdk = (response as any).output_parsed?.care_tips;
    if (parsedFromSdk) {
      return CareTips.parse(parsedFromSdk);
    }

    // fallback: attempt to find text content and JSON.parse it
    const textContent =
      response.output?.[0]?.content?.find((c: any) => c.type === "output_text")
        ?.text || response.output?.[0]?.content?.[0]?.text;

    if (!textContent) throw new Error("No text content in response");

    // The model should return a JSON-like string matching the schema
    const parsed = JSON.parse(textContent);
    return CareTips.parse(parsed);
  } catch (err) {
    console.error("AI parsing/validation error:", err);
    // return empty safe fallback (or throw depending on your app flow)
    return null;
  }
}
