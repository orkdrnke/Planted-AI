import { NextRequest, NextResponse } from "next/server";
import { generatePlantCareTips } from "@/lib/aiHelpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tips = await generatePlantCareTips(body);
    return NextResponse.json(tips);
  } catch (error) {
    console.error("AI care guide error:", error);
    return NextResponse.json(
      { error: "Failed to generate care guide" },
      { status: 500 }
    );
  }
}
