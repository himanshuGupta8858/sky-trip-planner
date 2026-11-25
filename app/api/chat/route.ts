import { sanitizeMessages } from "@/lib/ai-helpers";
import type { TripInfo } from "@/types/trip";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

interface ChatRequestBody {
  messages?: Array<{ role?: unknown; content?: unknown }>;
  tripContext?: Partial<TripInfo> | null;
}

export async function POST(req: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const groqKey = process.env.GROQ_API_KEY?.trim();

  if (!geminiKey && !groqKey) {
    return NextResponse.json(
      { error: "Neither GEMINI_API_KEY nor GROQ_API_KEY is configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as ChatRequestBody;
    const rawMessages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
    const tripContext = body.tripContext ?? null;

    if (!tripContext) {
      return NextResponse.json({ error: "Trip context is required." }, { status: 400 });
    }

    const sanitizedMessages = sanitizeMessages(rawMessages);

    const systemInstruction = `You are a helpful, professional, and friendly AI travel assistant for SkyTrip.
You have access to the details of the user's specific generated trip. Your goal is to help the user with any questions they have about this trip.

Here is the Trip Context:
${JSON.stringify(tripContext, null, 2)}

Instructions:
1. Use the Trip Context to answer questions about hotels, pricing, itinerary, day-by-day activities, places, and coordinates.
2. If the user asks about something not directly in the context but related to the trip (such as current weather, packing recommendations, estimated total costs, best local dining options, flight tips, accessibility advice, or general guidance), use your general knowledge about "${tripContext.destination || "the destination"}" to provide accurate, helpful, and localized answers.
3. Be concise and keep your answers brief, readable, and structured. Use line breaks and bullet points where appropriate.
4. Keep your tone enthusiastic, professional, and helpful.
`;

    if (groqKey) {
      try {
        const client = new OpenAI({
          baseURL: "https://api.groq.com/openai/v1",
          apiKey: groqKey,
        });
        const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
        const completion = await client.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemInstruction },
            ...sanitizedMessages.map((m) => ({
              role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
              content: m.content,
            })),
          ],
          temperature: 0.7,
          max_completion_tokens: 1000,
        });
        const reply = completion?.choices?.[0]?.message?.content || "";
        if (reply) return NextResponse.json({ reply });
      } catch (groqErr) {
        console.warn("Groq chat failed, trying Gemini fallback:", groqErr);
      }
    }

    if (!geminiKey) {
      return NextResponse.json(
        { error: "No AI service (Groq or Gemini) succeeded." },
        { status: 500 }
      );
    }

    const contents = sanitizedMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    };

    const result = await axios.post<{
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    }>(baseUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const reply = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({
        reply: "Sorry, I received an empty response from the AI service. Please try again.",
      });
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ error?: { message?: string; code?: number } }>;
    const errorMessage =
      axiosErr?.response?.data?.error?.message ||
      (error instanceof Error ? error.message : "Unknown error");
    const errorCode = axiosErr?.response?.data?.error?.code || axiosErr?.response?.status || 500;

    console.error(`AI Chat API error (Code: ${errorCode}):`, errorMessage);

    return NextResponse.json({
      reply: `⚠️ **AI Service Error (Status: ${errorCode})**: ${errorMessage}`,
    });
  }
}
