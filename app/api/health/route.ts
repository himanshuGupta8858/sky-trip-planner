import { NextResponse } from "next/server";

/**
 * Health check endpoint reporting service availability and configured AI/map providers.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "sky-trip-planner",
      timestamp: new Date().toISOString(),
      capabilities: {
        groq: Boolean(process.env.GROQ_API_KEY),
        gemini: Boolean(process.env.GEMINI_API_KEY),
        places: Boolean(process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY),
      },
    },
    { status: 200 }
  );
}
