/**
 * Core domain types shared across SkyTrip client components, API routes, and Convex queries.
 */

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface Hotel {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string | number;
  rating: number;
  hotel_image_url: string;
  description: string;
  geo_coordinates: GeoCoordinates;
}

export interface Activity {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: GeoCoordinates;
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
}

export interface ItineraryDay {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
}

export interface TripInfo {
  origin: string;
  destination: string;
  duration: string;
  budget: string;
  group_size?: string;
  people_size?: string;
  hotels: Hotel[];
  itinerary: ItineraryDay[];
  accessibility_notes?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "model" | "system";
  content: string;
  ui?: string;
}

export interface UserDetail {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  subscription?: string;
  aiCredits?: number;
}

export interface TripFeedback {
  rating: number;
  platformHelp: string;
  usedPdfQr: string;
  feedbackNotes: string;
}

export interface LocationDetails {
  city: string;
  country: string;
  currencyCode: string;
  currencySymbol: string;
  timezone: string;
  timezoneName: string;
  flag: string;
}

export interface CompanionRecommendation {
  category: string;
  title: string;
  description: string;
}

export interface CompanionEvent {
  name: string;
  date: string;
  description: string;
  type: string;
}

export interface CompanionData {
  origin: LocationDetails;
  destination: LocationDetails;
  isDomestic: boolean;
  timezoneOffsetDifference: number;
  recommendations: CompanionRecommendation[];
  events: CompanionEvent[];
}

export interface TripRecord {
  _id: string;
  tripId: string;
  uid: string;
  tripDetail: TripInfo;
  completed?: boolean;
  feedback?: TripFeedback | null;
  companionData?: CompanionData | null;
}

export interface NearbyPlace {
  name?: string;
  geometry?: {
    location?: {
      lat: (() => number) | number;
      lng: (() => number) | number;
    };
  };
  rating?: number;
  vicinity?: string;
}
