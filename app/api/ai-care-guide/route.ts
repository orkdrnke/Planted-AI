import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generatePlantCareTips } from "@/lib/aiHelpers";

const CareGuideRequestSchema = z.object({
  name: z.string().trim().min(1),
  type: z.string().optional(),
  dest: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = CareGuideRequestSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: input.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const tips = await generatePlantCareTips(input.data);
    if (!tips) {
      return NextResponse.json(
        { error: "AI returned an invalid response" },
        { status: 502 }
      );
    }
    return NextResponse.json(tips);
  } catch (error) {
    console.error("AI care guide error:", error);
    return NextResponse.json(
      { error: "Failed to generate care guide" },
      { status: 500 }
    );
  }
}
