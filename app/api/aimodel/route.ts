import { extractJsonPayload, inferUiFromText, sanitizeMessages } from "@/lib/ai-helpers";
import aj from "@/lib/arcjet";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";

const PROMPT = `You are an expert AI Travel Consultant. Your goal is to plan a personalized, accessible itinerary for the user.
Follow this strict conversation flow to gather necessary details. ASK ONLY ONE QUESTION AT A TIME. Wait for the user's response before proceeding to the next step.

### Conversation Steps & UI States:
1. **Starting Location**: Ask where they are starting from. (UI: 'location')
2. **Destination**: Ask for the destination city or country. (UI: 'destination')
3. **Group Size**: Ask who they are traveling with (Solo, Couple, Family, Friends). (UI: 'groupSize')
4. **Budget**: Ask for their budget preference (Low, Medium, High). (UI: 'budget')
5. **Duration**: Ask for the trip duration (number of days). (UI: 'duration')
6. **Interests & Accessibility**: Ask about travel style (e.g., Adventure, Relaxing, Cultural, Foodie) and any accessibility or dietary needs. (UI: 'interests')
7. **Confirmation/Final**: Confirm details or ask for any special requirements. Once fully satisfied, generate the final plan. (UI: 'final')

### Guidelines:
- **Tone**: Professional, friendly, and enthusiastic.
- **One Question Only**: Never ask multiple questions in a single response (unless the user has already provided all trip details).
- **All Details Provided**: If the user's message already contains all essential travel details (starting location/origin, destination, duration, group size, budget, and travel style/interests), warmly acknowledge their choices, summarize the parameters in "resp", and set "ui": "final".
- **Validation**: If an answer is unclear, politely ask for clarification.
- **Output Format**: You must ALWAYS return a JSON object. Do not output markdown or plain text.
- **NO TOOLS**: Do NOT call any tools, functions, or external actions. Do NOT output function calling structures like {"name": ..., "arguments": ...}. Return ONLY the direct flat JSON object.

### JSON Output Schema:
{
  "resp": "Your conversational response here",
  "ui": "Current UI state (location | destination | groupSize | budget | duration | interests | final)"
}`;

const FINAL_PROMPT = `You are a professional travel planner. Generate a highly accurate, realistic, and detailed Travel Plan based on the provided details (origin, destination, duration, budget, group/people size, and any accessibility or dietary preferences).

### Critical Accuracy Requirements:
1. **Real & Accurate Geo Coordinates**: The geographic coordinates (latitude and longitude) for all hotels and itinerary activities MUST be highly accurate and correspond to their true physical locations. These will be plotted directly on Google Maps. Do not hallucinate or use random/centered coordinates for a city.
2. **Logically Sequenced Routing**: For each day's itinerary, organize activities sequentially (Morning -> Afternoon -> Evening). Group activities geographically to minimize travel time and driving distance (avoid zig-zagging or crisscrossing the city).
3. **Realistic Travel Times**: Provide practical travel time estimates in "time_travel_each_location". For example, write "15 mins drive from hotel", "20 mins walk from [Previous Attraction]", or "10 mins taxi".
4. **Accurate Budget Alignment**:
   - Suggest hotels and activities that strictly match the requested budget tier:
     * 'Low' budget: Clean, budget-friendly options, hostels, guesthouses, and free/low-cost activities.
     * 'Medium' budget: Standard 3-star or 4-star hotels, moderate pricing, and popular standard attractions.
     * 'High' budget: Premium/luxury 5-star hotels, resorts, and premium curated activities.
   - Specify "price_per_night" and "ticket_pricing" in realistic numbers, using INR for all destinations (e.g. "₹2,500"). If entry to an attraction is free, state "Free entry".
5. **MakeMyTrip Hotel Booking**: Suggest hotels that are real, well-known, and bookable on MakeMyTrip. The hotel names and addresses must match how they appear on MakeMyTrip to allow successful searches.
6. **Detailed Day Plans & Accessibility**: Provide a comprehensive description of the day's theme/plan under "day_plan", including practical travel/insider tips (e.g., best attire, wheelchair/mobility notes, local customs, peak hour warnings). Include concise accessibility guidance in "accessibility_notes".
7. **JSON Format**: You MUST return a strictly valid, complete JSON object matching the schema below. Keep descriptions clear and concise. Do NOT include tool calls, explanations, or text outside the JSON object.

Output Schema (strict JSON format):
{
  "origin": "string",
  "destination": "string",
  "duration": "string",
  "budget": "string",
  "people_size": "string",
  "accessibility_notes": "string",
  "hotels": [
    {
      "hotel_name": "string",
      "hotel_address": "string",
      "price_per_night": "string",
      "hotel_image_url": "string",
      "geo_coordinates": {
        "latitude": "number",
        "longitude": "number"
      },
      "rating": "number",
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": "number",
      "day_plan": "string",
      "best_time_to_visit_day": "string",
      "activities": [
        {
          "place_name": "string",
          "place_details": "string",
          "place_image_url": "string",
          "geo_coordinates": {
            "latitude": "number",
            "longitude": "number"
          },
          "place_address": "string",
          "ticket_pricing": "string",
          "time_travel_each_location": "string",
          "best_time_to_visit": "string"
        }
      ]
    }
  ]
}`;

interface ProviderErrorShape {
  message?: string;
  error?: { failed_generation?: string };
  response?: { data?: { error?: { failed_generation?: string } } };
}

type GroqChatPayload = ChatCompletionCreateParamsNonStreaming & {
  reasoning_effort?: "low" | "medium" | "high";
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API;
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey && !geminiKey) {
    return NextResponse.json(
      { error: "No AI provider key configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as {
      messages?: Array<{ role?: unknown; content?: unknown }>;
      isFinal?: boolean;
    };

    if (!Array.isArray(body?.messages)) {
      return NextResponse.json(
        { error: "A valid messages array is required." },
        { status: 400 }
      );
    }

    const messages = body.messages.slice(-30);
    const isFinal = Boolean(body.isFinal);

    let userId = "";
    let hasPremiumAccess = false;
    try {
      const authObj = await auth();
      userId = authObj.userId ?? "";
      if (authObj.has) {
        hasPremiumAccess = authObj.has({ plan: "monthly" });
      }
    } catch (authErr) {
      console.warn("Clerk auth check warning:", authErr);
    }

    try {
      const decision = await aj.protect(req, {
        userId: userId || "anonymous",
        requested: isFinal ? 5 : 0,
      });
      const reason = decision.reason as { remaining?: number } | undefined;
      if (!hasPremiumAccess && (decision.isDenied() || (reason && (reason.remaining ?? 1) <= 0))) {
        return NextResponse.json({ resp: "No Free Credits Left", ui: "limit" });
      }
    } catch (ajErr) {
      console.warn("Arcjet protect check warning:", ajErr);
    }

    const isGroq = Boolean(process.env.GROQ_API_KEY);
    const client = apiKey
      ? new OpenAI({
          baseURL: isGroq ? "https://api.groq.com/openai/v1" : "https://openrouter.ai/api/v1",
          apiKey,
          timeout: 120000,
        })
      : null;

    const primaryModel = process.env.GROQ_MODEL || (isGroq ? "openai/gpt-oss-20b" : "openai/gpt-4o-mini");
    const fallbackModel = process.env.GROQ_FALLBACK_MODEL || (isGroq ? "openai/gpt-oss-20b" : "openai/gpt-4o-mini");

    const sanitizedHistory = sanitizeMessages(messages);
    const requestMessages: ChatCompletionCreateParamsNonStreaming["messages"] = [
      {
        role: "system",
        content: isFinal ? FINAL_PROMPT : PROMPT,
      },
      ...sanitizedHistory.map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: m.content,
      })),
    ];

    const callModel = async (modelName: string) => {
      if (!client) {
        throw new Error("Primary AI client not configured.");
      }
      try {
        const payload: GroqChatPayload = {
          model: modelName,
          response_format: { type: "json_object" },
          messages: requestMessages,
          temperature: 0.2,
          max_completion_tokens: isFinal ? 8192 : 2048,
        };

        if (isGroq && modelName.includes("gpt-oss")) {
          payload.reasoning_effort = "low";
        }

        const res = await client.chat.completions.create(payload);
        const content = res?.choices?.[0]?.message?.content ?? "";
        const extracted = extractJsonPayload(content);
        if (extracted) return extracted;
        if (!isFinal && typeof content === "string" && content.trim().length > 0) {
          const trimmed = content.trim();
          return { resp: trimmed, ui: inferUiFromText(trimmed) };
        }
        throw new Error("Could not parse JSON response from model");
      } catch (err: unknown) {
        const typedErr = err as ProviderErrorShape;
        const failedGen =
          typedErr?.error?.failed_generation ||
          typedErr?.response?.data?.error?.failed_generation;
        if (failedGen) {
          const recovered = extractJsonPayload(failedGen);
          if (recovered && (recovered.resp || recovered.itinerary || recovered.hotels)) {
            return recovered;
          }
          if (!isFinal && typeof failedGen === "string" && failedGen.trim().length > 0) {
            const trimmed = failedGen.trim();
            return { resp: trimmed, ui: inferUiFromText(trimmed) };
          }
        }
        throw err;
      }
    };

    const callGemini = async () => {
      if (!geminiKey) throw new Error("GEMINI_API_KEY is missing.");

      const systemPrompt = isFinal ? FINAL_PROMPT : PROMPT;
      const contents = sanitizedHistory.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      if (contents.length === 0) {
        contents.push({ role: "user", parts: [{ text: "Plan my trip." }] });
      }

      const payload = {
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: isFinal ? 8192 : 2048,
          responseMimeType: "application/json",
        },
      };

      const geminiModels = ["gemini-2.5-flash", "gemini-1.5-flash"];
      let lastErr: unknown = null;

      for (const gModel of geminiModels) {
        try {
          const res = await axios.post<{
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          }>(
            `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${geminiKey}`,
            payload,
            { headers: { "Content-Type": "application/json" }, timeout: 60000 }
          );
          const rawText = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const extracted = extractJsonPayload(rawText);
            if (extracted) {
              return extracted;
            }
            if (!isFinal && typeof rawText === "string" && rawText.trim().length > 0) {
              const trimmed = rawText.trim();
              return { resp: trimmed, ui: inferUiFromText(trimmed) };
            }
          }
        } catch (gErr: unknown) {
          lastErr = gErr;
          console.warn(`Gemini model ${gModel} fallback attempt failed.`);
        }
      }

      throw lastErr || new Error("All Gemini fallback attempts failed.");
    };

    let resultJson;
    if (client) {
      try {
        resultJson = await callModel(primaryModel);
      } catch (primaryErr: unknown) {
        console.warn(`Primary model (${primaryModel}) failed.`);

        let fallbackSuccess = false;
        if (fallbackModel && fallbackModel !== primaryModel) {
          try {
            resultJson = await callModel(fallbackModel);
            fallbackSuccess = true;
          } catch {
            console.warn(`Secondary model (${fallbackModel}) also failed.`);
          }
        }

        if (!fallbackSuccess) {
          if (geminiKey) {
            resultJson = await callGemini();
          } else {
            throw primaryErr;
          }
        }
      }
    } else {
      resultJson = await callGemini();
    }

    return NextResponse.json(resultJson);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Error in POST /api/aimodel:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
