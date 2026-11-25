import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

interface PlaceSearchResponse {
  places?: Array<{
    photos?: Array<{ name?: string }>;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey =
      process.env.GOOGLE_PLACES_API_KEY?.trim() ||
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY?.trim();
    const body = (await req.json()) as { placeName?: unknown };
    const placeName = typeof body.placeName === "string" ? body.placeName.trim() : "";

    if (!placeName || !apiKey) {
      return NextResponse.json(null);
    }

    const baseUrl = "https://places.googleapis.com/v1/places:searchText";
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"].join(","),
      },
    };

    const result = await axios.post<PlaceSearchResponse>(
      baseUrl,
      { textQuery: placeName },
      config
    );

    const placesRefName = result?.data?.places?.[0]?.photos?.[0]?.name;
    if (!placesRefName) {
      return NextResponse.json(null);
    }

    const placesRefURL = `https://places.googleapis.com/v1/${placesRefName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${apiKey}`;
    return NextResponse.json(placesRefURL);
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ error?: { message?: string } }>;
    const msg =
      axiosErr?.response?.data?.error?.message ||
      (error instanceof Error ? error.message : "Unknown error");
    console.warn("Google Place Detail Warning (falling back to placeholder):", msg);
    return NextResponse.json(null);
  }
}
