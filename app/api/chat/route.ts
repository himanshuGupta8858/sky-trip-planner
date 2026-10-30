import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const groqKey = process.env.GROQ_API_KEY?.trim();

    if (!geminiKey && !groqKey) {
        return NextResponse.json({ error: "Neither GEMINI_API_KEY nor GROQ_API_KEY is found in environment variables." }, { status: 500 });
    }

    try {
        const body = await req.json();
        const messages = body.messages || [];
        const tripContext = body.tripContext || null;

        if (!tripContext) {
            return NextResponse.json({ error: "Trip context is required." }, { status: 400 });
        }

        const systemInstruction = `You are a helpful, professional, and friendly AI travel assistant for SkyTrip.
You have access to the details of the user's specific generated trip. Your goal is to help the user with any questions they have about this trip.

Here is the Trip Context:
${JSON.stringify(tripContext, null, 2)}

Instructions:
1. Use the Trip Context to answer questions about hotels, pricing, itinerary, day-by-day activities, places, and coordinates.
2. If the user asks about something not directly in the context but related to the trip (such as current weather, packing recommendations, estimated total costs, best local dining options, flight tips, or general advice), use your general knowledge about the destination "${tripContext.destination || 'the destination'}" to provide highly accurate, helpful, and localized answers.
3. Be concise and keep your answers brief, highly readable, and structured. Use line breaks and bullet points where appropriate. Keep responses under 3 paragraphs if possible.
4. Keep your tone enthusiastic, professional, and helpful.
`;

        // Try Groq first if available
        if (groqKey) {
            try {
                const client = new OpenAI({
                    baseURL: "https://api.groq.com/openai/v1",
                    apiKey: groqKey
                });
                const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
                const completion = await client.chat.completions.create({
                    model,
                    messages: [
                        { role: "system", content: systemInstruction },
                        ...messages
                    ],
                    temperature: 0.7,
                    max_completion_tokens: 1000
                });
                const reply = completion?.choices?.[0]?.message?.content || "";
                if (reply) return NextResponse.json({ reply });
            } catch (groqErr) {
                console.warn("Groq chat failed, trying Gemini fallback:", groqErr);
            }
        }

        const apiKey = geminiKey;
        if (!apiKey) {
            return NextResponse.json({ error: "No AI service (Groq or Gemini) succeeded." }, { status: 500 });
        }
        // Format messages for the Gemini API (roles: 'user' and 'model')
        const contents = messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents,
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        };

        const result = await axios.post(BASE_URL, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const reply = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            console.error("Empty reply from Gemini API:", JSON.stringify(result.data));
            return NextResponse.json({ 
                reply: "Sorry, I received an empty response from the Gemini API. Please try again." 
            });
        }

        return NextResponse.json({ reply });
    }
    catch (error: any) {
        const errorData = error?.response?.data || {};
        const errorMessage = errorData.error?.message || error.message || "Unknown error";
        const errorCode = errorData.error?.code || error?.response?.status || 500;
        
        console.error(`Gemini API error (Code: ${errorCode}):`, errorMessage);
        
        // Return a detailed, helpful error message directly in the chat reply so the user knows exactly why Gemini is failing
        return NextResponse.json({ 
            reply: `⚠️ **Gemini API Error (Status: ${errorCode})**: ${errorMessage}` 
        });
    }
}
