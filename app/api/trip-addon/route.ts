import { extractJsonPayload } from "@/lib/ai-helpers";
import aj from "@/lib/arcjet";
import { calculateTimezoneOffset, detectLocationDetails } from "@/lib/travel-utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";

type GroqPayload = ChatCompletionCreateParamsNonStreaming & {
  reasoning_effort?: "low" | "medium" | "high";
};

export async function POST(req: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const groqKey = process.env.GROQ_API_KEY?.trim();

  let origin = "";
  let destination = "";

  try {
    const body = (await req.json()) as { origin?: unknown; destination?: unknown };
    origin = typeof body.origin === "string" ? body.origin.trim() : "";
    destination = typeof body.destination === "string" ? body.destination.trim() : "";

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and Destination are required." },
        { status: 400 }
      );
    }

    try {
      const user = await currentUser();
      const userId = user?.primaryEmailAddress?.emailAddress ?? "";
      const decision = await aj.protect(req, { userId, requested: 1 });
      const { has } = await auth();
      const hasPremiumAccess = has ? has({ plan: "monthly" }) : false;

      if (!hasPremiumAccess && decision.isDenied()) {
        return NextResponse.json(
          { error: "Too Many Requests. Please try again later or upgrade to Premium." },
          { status: 429 }
        );
      }
    } catch {
      // Allow graceful handling when auth/Arcjet context is unavailable
    }

    const systemInstruction = `You are a helpful, professional, and friendly AI travel assistant for SkyTrip.
Your task is to analyze the trip's origin and destination, and return country metadata, correct standard timezone IDs (e.g., 'Asia/Kolkata', 'America/New_York', 'Europe/Paris', 'Asia/Tokyo'), currency info, customized travel tips, and upcoming local events/festivals.

IMPORTANT GUIDELINES:
1. "isDomestic": true if origin and destination are in the same country. Otherwise false.
2. "timezoneOffsetDifference": approximate hours difference between origin and destination timezone (positive if destination is ahead, negative if behind).
3. "recommendations": Provide 3-4 highly specific, helpful, and localized tips for this trip (including accessibility/transit tips).
4. "flag": Use the correct country flag emoji (e.g., '🇮🇳' for India, '🇯🇵' for Japan, '🇺🇸' for USA).
5. "events": Provide a list of 3-4 major local cultural events, seasonal highlights, public holidays, or festivals happening in the destination country/city.

You MUST respond strictly in the following JSON format:
{
  "origin": {
    "city": "string",
    "country": "string",
    "currencyCode": "string (e.g. INR)",
    "currencySymbol": "string (e.g. ₹)",
    "timezone": "string (e.g. Asia/Kolkata)",
    "timezoneName": "string (e.g. IST)",
    "flag": "string"
  },
  "destination": {
    "city": "string",
    "country": "string",
    "currencyCode": "string (e.g. JPY)",
    "currencySymbol": "string (e.g. ¥)",
    "timezone": "string (e.g. Asia/Tokyo)",
    "timezoneName": "string (e.g. JST)",
    "flag": "string"
  },
  "isDomestic": boolean,
  "timezoneOffsetDifference": number,
  "recommendations": [
    {
      "category": "string",
      "title": "string",
      "description": "string"
    }
  ],
  "events": [
    {
      "name": "string",
      "date": "string",
      "description": "string",
      "type": "string"
    }
  ]
}`;

    if (groqKey) {
      try {
        const client = new OpenAI({
          baseURL: "https://api.groq.com/openai/v1",
          apiKey: groqKey,
          timeout: 45000,
        });
        const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
        const payload: GroqPayload = {
          model,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemInstruction },
            {
              role: "user",
              content: `Analyze the trip from "${origin}" to "${destination}" and generate the JSON payload.`,
            },
          ],
          temperature: 0.2,
          max_completion_tokens: 1500,
        };
        if (model.includes("gpt-oss")) {
          payload.reasoning_effort = "low";
        }

        try {
          const completion = await client.chat.completions.create(payload);
          const content = completion?.choices?.[0]?.message?.content?.trim() || "{}";
          const target = extractJsonPayload(content);
          if (target) return NextResponse.json(target);
        } catch (gCallErr: unknown) {
          const typedErr = gCallErr as {
            error?: { failed_generation?: string };
            response?: { data?: { error?: { failed_generation?: string } } };
          };
          const failedGen =
            typedErr?.error?.failed_generation ||
            typedErr?.response?.data?.error?.failed_generation;
          if (failedGen) {
            const target = extractJsonPayload(failedGen);
            if (target?.origin && target?.destination) {
              return NextResponse.json(target);
            }
          }
          throw gCallErr;
        }
      } catch (groqErr: unknown) {
        const msg = groqErr instanceof Error ? groqErr.message : String(groqErr);
        console.warn("Groq trip-addon failed, trying Gemini fallback:", msg);
      }
    }

    if (!geminiKey) {
      throw new Error("No AI API key found (GEMINI_API_KEY or GROQ_API_KEY).");
    }

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze the trip from "${origin}" to "${destination}" and generate the JSON payload.`,
            },
          ],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1500,
        responseMimeType: "application/json",
      },
    };

    const geminiModels = ["gemini-2.5-flash", "gemini-1.5-flash"];
    let lastGeminiErr: unknown = null;

    for (const gModel of geminiModels) {
      try {
        const result = await axios.post<{
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        }>(
          `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${geminiKey}`,
          payload,
          { headers: { "Content-Type": "application/json" }, timeout: 45000 }
        );

        const replyText = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          const parsed = extractJsonPayload(replyText);
          if (parsed) return NextResponse.json(parsed);
        }
      } catch (gErr: unknown) {
        lastGeminiErr = gErr;
        console.warn(`Gemini trip-addon attempt with ${gModel} failed.`);
      }
    }

    throw lastGeminiErr || new Error("Gemini fallback failed to return data");
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn("Trip-addon API call failed (using graceful offline fallback):", errMsg);

    const originDet = detectLocationDetails(origin, true);
    const destDet = detectLocationDetails(destination, false);
    const isDomestic = originDet.country === destDet.country;
    const timezoneOffsetDifference = calculateTimezoneOffset(
      originDet.timezone,
      destDet.timezone
    );

    const fallbackPayload = {
      origin: originDet,
      destination: destDet,
      isDomestic,
      timezoneOffsetDifference,
      recommendations: [
        {
          category: "Currency & Payments",
          title: "Local Payments",
          description: `Plan to carry a mixture of card and cash. In ${destDet.country}, local cards are widely used, while small cash helps at local markets.`,
        },
        {
          category: "Connectivity",
          title: "Mobile Internet",
          description: `Get a local eSIM or roaming plan beforehand to ensure reliable maps and translation coverage in ${destDet.city}.`,
        },
        {
          category: "Cultural Protocol",
          title: "Local Etiquette",
          description: `Be respectful of local traditions in ${destDet.country}. Check tipping practices and quiet hours before visiting residential or sacred areas.`,
        },
      ],
      events: [
        {
          name: "Local Cultural Market",
          date: "Weekend",
          description: "Explore vibrant street markets featuring regional cuisine and artisanal crafts.",
          type: "Market",
        },
        {
          name: "Seasonal Heritage Walk",
          date: "Daily",
          description: `Discover central parks, historic avenues, and seasonal highlights across ${destDet.city}.`,
          type: "Seasonal",
        },
      ],
    };

    return NextResponse.json(fallbackPayload);
  }
}
