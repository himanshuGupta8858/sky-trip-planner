import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim() || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY?.trim();
        const { placeName } = await req.json();

        if (!placeName || !apiKey) {
            return NextResponse.json(null);
        }

        const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
        const config = {
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": [
                    'places.photos',
                    'places.displayName',
                    'places.id'
                ].join(',')
            }
        };

        const result = await axios.post(BASE_URL, {
            textQuery: placeName,
        }, config);

        const placesRefName = result?.data?.places?.[0]?.photos?.[0]?.name;
        if (!placesRefName) {
            return NextResponse.json(null);
        }

        const placesRefURL = `https://places.googleapis.com/v1/${placesRefName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${apiKey}`;
        return NextResponse.json(placesRefURL);
    }
    catch (error: any) {
        const errorDetails = error?.response?.data || error.message;
        console.warn("Google Place Detail Warning (falling back to placeholder):", errorDetails?.error?.message || error.message);
        // Return null gracefully so frontend components fallback to local placeholder images without 500 errors
        return NextResponse.json(null);
    }
}