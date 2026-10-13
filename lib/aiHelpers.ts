import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { CareTipsSchema, TCareTips } from "@/schemas/careTipsSchema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePlantCareTips(params: {
  name: string;
  type?: string;
  dest?: string;
}): Promise<TCareTips | null> {
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
      max_output_tokens: 600,
      text: {
        format: zodTextFormat(CareTipsSchema, "care_tips"),
      },
    });

    if (response.status !== "completed") {
      throw new Error(
        `Response not completed: ${response.status ?? "unknown"} (${
          response.incomplete_details?.reason ?? "no details"
        })`
      );
    }
    if (!response.output_parsed) throw new Error("No parsed output in response");

    return response.output_parsed;
  } catch (err) {
    console.error("AI parsing/validation error:", err);
    // The route turns null into a 502 response
    return null;
  }
}
