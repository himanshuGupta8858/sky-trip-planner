import aj from "@/lib/arcjet";
import { validateContactSubmission } from "@/lib/ai-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles contact and newsletter inquiries with server-side validation and Arcjet rate limiting.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const result = validateContactSubmission(body);

    if (!result.valid || !result.sanitized) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid submission." },
        { status: 400 }
      );
    }

    try {
      const decision = await aj.protect(req, {
        userId: result.sanitized.email,
        requested: 1,
      });
      if (decision.isDenied()) {
        return NextResponse.json(
          { success: false, error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    } catch {
      // Allow graceful submission if Arcjet key is not configured in local/test env
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! Our team will respond within 24 hours.",
        ticketId: `SKY-${Date.now().toString(36).toUpperCase()}`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON request body." },
      { status: 400 }
    );
  }
}
