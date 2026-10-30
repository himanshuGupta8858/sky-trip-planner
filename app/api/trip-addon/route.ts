import aj from "@/lib/arcjet";
import { auth, currentUser } from '@clerk/nextjs/server';
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const groqKey = process.env.GROQ_API_KEY?.trim();

    let origin = "";
    let destination = "";

    try {
        const body = await req.json();
        origin = body.origin;
        destination = body.destination;

        if (!origin || !destination) {
            return NextResponse.json({ error: "Origin and Destination are required." }, { status: 400 });
        }

        // Arcjet Protection
        const user = await currentUser();
        const userId = user?.primaryEmailAddress?.emailAddress;
        const decision = await aj.protect(req, { userId: userId ?? "", requested: 1 });
        const { has } = await auth();
        const hasPremiumAccess = has({ plan: 'monthly' });

        if (!hasPremiumAccess && decision.isDenied()) {
            return NextResponse.json({ error: "Too Many Requests. Please try again later or upgrade to Premium." }, { status: 429 });
        }

        const systemInstruction = `You are a helpful, professional, and friendly AI travel assistant for SkyTrip.
Your task is to analyze the trip's origin and destination, and return country metadata, correct standard timezone IDs (e.g., 'Asia/Kolkata', 'America/New_York', 'Europe/Paris', 'Asia/Tokyo', etc.), currency info, customized travel tips, and upcoming local events/festivals.

IMPORTANT GUIDELINES:
1. "isDomestic": true if origin and destination are in the same country. Otherwise false.
2. "timezoneOffsetDifference": approximate hours difference between origin and destination timezone (positive if destination is ahead, negative if behind).
3. "recommendations": Provide 3-4 highly specific, helpful, and localized tips for this trip.
   - For domestic trips (e.g. Delhi to Mumbai, or San Francisco to Seattle), provide domestic travel advice (such as local transit tips, weather variations, payment options like UPI in India, local protocols, etc.).
   - For international trips, provide currency tips, timezone/jetlag advice, connectivity/eSIM recommendations, and cultural/etiquette guidelines.
4. "flag": Use the correct country flag emoji (e.g., '🇮🇳' for India, '🇯🇵' for Japan, '🇺🇸' for USA).
5. "events": Provide a list of 3-4 major local cultural events, seasonal highlights, public holidays, or festivals happening in the destination country/city.

You MUST respond strictly in the following JSON format:
{
  "origin": {
    "country": "string",
    "currencyCode": "string (e.g. INR)",
    "currencySymbol": "string (e.g. ₹)",
    "timezone": "string (e.g. Asia/Kolkata)",
    "timezoneName": "string (e.g. IST)",
    "flag": "string"
  },
  "destination": {
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
      "category": "string (e.g. Currency & Payments, Transit, Weather, Cultural Protocol)",
      "title": "string (short title)",
      "description": "string (detailed advice)"
    }
  ],
  "events": [
    {
      "name": "string (event or festival name)",
      "date": "string (approximate date/month, e.g. July 7-9 or October)",
      "description": "string (brief overview of the event/festival and its significance)",
      "type": "string (e.g. Festival, Concert, Seasonal, Public Holiday)"
    }
  ]
}
`;

        // Try Groq first if key exists
        if (groqKey) {
            try {
                const client = new OpenAI({
                    baseURL: "https://api.groq.com/openai/v1",
                    apiKey: groqKey,
                    timeout: 45000
                });
                const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
                const payload: any = {
                    model,
                    response_format: { type: "json_object" },
                    messages: [
                        { role: "system", content: systemInstruction },
                        { role: "user", content: `Analyze the trip from "${origin}" to "${destination}" and generate the JSON payload.` }
                    ],
                    temperature: 0.2,
                    max_completion_tokens: 1500
                };
                if (model.includes("gpt-oss")) {
                    payload.reasoning_effort = "low";
                }

                let completion;
                try {
                    completion = await client.chat.completions.create(payload);
                } catch (gCallErr: any) {
                    const failedGen = gCallErr?.error?.failed_generation || gCallErr?.response?.data?.error?.failed_generation;
                    if (failedGen) {
                        try {
                            const clean = String(failedGen).replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
                            const parsed = JSON.parse(clean);
                            const target = parsed.arguments || parsed;
                            if (target?.origin && target?.destination) {
                                return NextResponse.json(target);
                            }
                        } catch (_) {}
                    }
                    throw gCallErr;
                }

                const content = completion?.choices?.[0]?.message?.content?.trim() || "{}";
                const cleanJson = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");
                const parsed = JSON.parse(cleanJson);
                const target = parsed.arguments || parsed;
                return NextResponse.json(target);
            } catch (groqErr: any) {
                console.warn("Groq trip-addon failed, trying Gemini fallback:", groqErr?.message || groqErr);
            }
        }

        const apiKey = geminiKey;
        if (!apiKey) {
            throw new Error("No AI API key found (GEMINI_API_KEY or GROQ_API_KEY).");
        }

        const contents = [
            {
                role: "user",
                parts: [{ text: `Analyze the trip from "${origin}" to "${destination}" and generate the JSON payload.` }]
            }
        ];

        const payload = {
            contents,
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1500,
                responseMimeType: "application/json"
            }
        };

        const geminiModels = ["gemini-2.5-flash", "gemini-1.5-flash"];
        let lastGeminiErr: any = null;

        for (const gModel of geminiModels) {
            try {
                const result = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${apiKey}`,
                    payload,
                    { headers: { "Content-Type": "application/json" }, timeout: 45000 }
                );

                const replyText = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (replyText) {
                    const clean = replyText.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
                    const data = JSON.parse(clean);
                    return NextResponse.json(data);
                }
            } catch (gErr: any) {
                lastGeminiErr = gErr;
                console.warn(`Gemini trip-addon attempt with ${gModel} failed:`, gErr?.message || gErr);
            }
        }

        throw lastGeminiErr || new Error("Gemini fallback failed to return data");
    }
    catch (error: any) {
        const errorDetails = error?.response?.data || error.message;
        console.warn("Gemini API call failed (using graceful fallback):", JSON.stringify(errorDetails, null, 2));

        // Generate high-fidelity local fallback details
        const originDet = detectLocationFallback(origin, true);
        const destDet = detectLocationFallback(destination, false);
        const isDomestic = originDet.country === destDet.country;
        
        // Simple offset difference calculation helper
        const timezoneDiffs: Record<string, number> = {
            "Asia/Kolkata_Asia/Tokyo": 3.5,
            "Asia/Kolkata_America/New_York": -9.5,
            "Asia/Kolkata_Europe/Paris": -3.5,
            "America/New_York_Asia/Tokyo": 13,
            "Europe/Paris_Asia/Tokyo": 7,
            "Europe/London_Asia/Tokyo": 8,
            "Europe/London_Asia/Kolkata": 5.5
        };
        const key = `${originDet.timezone}_${destDet.timezone}`;
        const timezoneOffsetDifference = originDet.timezone === destDet.timezone ? 0 : (timezoneDiffs[key] || 0);

        const fallbackPayload = {
            origin: originDet,
            destination: destDet,
            isDomestic,
            timezoneOffsetDifference,
            recommendations: [
                {
                    category: "Currency & Payments",
                    title: "Local Payments",
                    description: `Plan to carry a mixture of card and cash. In ${destDet.country}, local cards are widely used but carrying a small amount of cash is recommended.`
                },
                {
                    category: "Connectivity",
                    title: "Mobile Internet",
                    description: `Get a local eSIM or roaming plan beforehand to ensure you have steady internet coverage in ${destDet.city}.`
                },
                {
                    category: "Cultural Protocol",
                    title: "Local Etiquette",
                    description: `Be respectful of local traditions in ${destDet.country}. Look up tipping practices at cafes and service stations.`
                }
            ],
            events: [
                {
                    name: "Local Cultural Market",
                    date: "Weekend",
                    description: "Explore the bustling street side market featuring local food delicacies and fresh crafts.",
                    type: "Market"
                },
                {
                    name: "Seasonal Outdoor Walk",
                    date: "Daily",
                    description: `Visit the central parks, gardens, and view seasonal flora highlights in ${destDet.city}.`,
                    type: "Seasonal"
                }
            ]
        };

        return NextResponse.json(fallbackPayload);
    }
}

function detectLocationFallback(name: string, isOrigin: boolean) {
    const q = name.toLowerCase();
    
    // Common Indian locations list
    const indianKeywords = [
        "india", "inr", "delhi", "mumbai", "bangalore", "bengaluru", "kolkata", "chennai", "hyderabad",
        "jaipur", "udaipur", "agra", "varanasi", "nainital", "jhansi", "dehradun", "rishikesh", "haridwar",
        "shimla", "manali", "goa", "pune", "ahmedabad", "surat", "lucknow", "kanpur", "uttarakhand",
        "uttar pradesh", "rajasthan", "kerala", "himachal", "punjab", "haryana", "kashmir", "srinagar",
        "ladakh", "amritsar", "bhopal", "indore", "patna", "mysore", "kochi", "guwahati", "darjeeling",
        "mussoorie", "kodaikanal", "ooty", "munnar", "alleppey", "ayodhya", "mathura", "vrindavan"
    ];

    const isIndianLocation = indianKeywords.some(keyword => q.includes(keyword));

    if (isIndianLocation) {
        return {
            city: name.split(",")[0].trim(),
            country: "India",
            currencyCode: "INR",
            currencySymbol: "₹",
            timezone: "Asia/Kolkata",
            timezoneName: "IST",
            flag: "🇮🇳"
        };
    } else if (q.includes("japan") || q.includes("tokyo") || q.includes("osaka") || q.includes("kyoto") || q.includes("jpy")) {
        return {
            city: name.split(",")[0].trim(),
            country: "Japan",
            currencyCode: "JPY",
            currencySymbol: "¥",
            timezone: "Asia/Tokyo",
            timezoneName: "JST",
            flag: "🇯🇵"
        };
    } else if (q.includes("usa") || q.includes("america") || q.includes("york") || q.includes("angeles") || q.includes("francisco") || q.includes("usd")) {
        return {
            city: name.split(",")[0].trim(),
            country: "United States",
            currencyCode: "USD",
            currencySymbol: "$",
            timezone: isOrigin ? "America/New_York" : "America/Los_Angeles",
            timezoneName: isOrigin ? "EST" : "PST",
            flag: "🇺🇸"
        };
    } else if (q.includes("europe") || q.includes("france") || q.includes("paris") || q.includes("germany") || q.includes("berlin") || q.includes("italy") || q.includes("rome") || q.includes("eur")) {
        return {
            city: name.split(",")[0].trim(),
            country: "Eurozone",
            currencyCode: "EUR",
            currencySymbol: "€",
            timezone: "Europe/Paris",
            timezoneName: "CET",
            flag: "🇪🇺"
        };
    } else if (q.includes("london") || q.includes("uk") || q.includes("gbp") || q.includes("united kingdom")) {
        return {
            city: name.split(",")[0].trim(),
            country: "United Kingdom",
            currencyCode: "GBP",
            currencySymbol: "£",
            timezone: "Europe/London",
            timezoneName: "GMT",
            flag: "🇬🇧"
        };
    } else if (q.includes("singapore") || q.includes("sgd")) {
        return {
            city: name.split(",")[0].trim(),
            country: "Singapore",
            currencyCode: "SGD",
            currencySymbol: "$",
            timezone: "Asia/Singapore",
            timezoneName: "SGT",
            flag: "🇸🇬"
        };
    }

    // Default to India if not identified as international
    return {
        city: name.split(",")[0].trim(),
        country: "India",
        currencyCode: "INR",
        currencySymbol: "₹",
        timezone: "Asia/Kolkata",
        timezoneName: "IST",
        flag: "🇮🇳"
    };
}
