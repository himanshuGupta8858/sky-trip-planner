import { describe, expect, it } from "vitest";
import {
  buildGoogleFlightsUrl,
  calculateTimezoneOffset,
  calculateTripCost,
  calculateTripDistance,
  convertCurrency,
  detectLocationDetails,
  extractCityFromAddress,
  FALLBACK_RATES,
  getCurrencySymbol,
  getHaversineDistance,
  isGoodBusinessHour,
  parsePrice,
} from "@/lib/travel-utils";
import type { TripInfo } from "@/types/trip";

describe("travel-utils", () => {
  describe("detectLocationDetails", () => {
    it("identifies Indian cities and maps them to INR / Asia/Kolkata", () => {
      const details = detectLocationDetails("Jhansi, Uttar Pradesh", true);
      expect(details.country).toBe("India");
      expect(details.currencyCode).toBe("INR");
      expect(details.currencySymbol).toBe("₹");
      expect(details.timezone).toBe("Asia/Kolkata");
      expect(details.city).toBe("Jhansi");
    });

    it("identifies international cities like Tokyo", () => {
      const details = detectLocationDetails("Tokyo, Japan", false);
      expect(details.country).toBe("Japan");
      expect(details.currencyCode).toBe("JPY");
      expect(details.timezone).toBe("Asia/Tokyo");
    });

    it("returns safe defaults for empty place strings", () => {
      expect(detectLocationDetails("", true).country).toBe("India");
      expect(detectLocationDetails("", false).country).toBe("United States");
    });
  });

  describe("convertCurrency & getCurrencySymbol", () => {
    it("converts USD to INR accurately using provided rates", () => {
      const result = convertCurrency(10, "USD", "INR", { USD: 1, INR: 85 });
      expect(result.rate).toBe(85);
      expect(result.converted).toBe(850);
    });

    it("handles negative or invalid numbers gracefully", () => {
      const result = convertCurrency(-50, "USD", "EUR", FALLBACK_RATES);
      expect(result.converted).toBe(0);
    });

    it("returns expected currency symbols", () => {
      expect(getCurrencySymbol("INR")).toBe("₹");
      expect(getCurrencySymbol("USD")).toBe("$");
      expect(getCurrencySymbol("JPY")).toBe("¥");
      expect(getCurrencySymbol("UNKNOWN")).toBe("");
    });
  });

  describe("calculateTimezoneOffset & isGoodBusinessHour", () => {
    it("returns 0 offset when origin and destination share timezone", () => {
      expect(calculateTimezoneOffset("Asia/Kolkata", "Asia/Kolkata")).toBe(0);
    });

    it("computes 3.5h offset between IST and JST", () => {
      expect(calculateTimezoneOffset("Asia/Kolkata", "Asia/Tokyo")).toBe(3.5);
    });

    it("identifies sociable business hours vs quiet hours", () => {
      expect(isGoodBusinessHour("10:30 AM")).toBe(true);
      expect(isGoodBusinessHour("8:45 PM")).toBe(true);
      expect(isGoodBusinessHour("11:30 PM")).toBe(false);
      expect(isGoodBusinessHour("3:00 AM")).toBe(false);
    });
  });

  describe("parsePrice, distance, and cost calculations", () => {
    it("parses formatted currency strings and free entries", () => {
      expect(parsePrice("₹2,500")).toBe(2500);
      expect(parsePrice("$125.50")).toBe(125.5);
      expect(parsePrice("Free entry")).toBe(0);
      expect(parsePrice(400)).toBe(400);
      expect(parsePrice(undefined)).toBe(0);
    });

    it("computes Haversine distance accurately between Delhi and Agra (~180-210km)", () => {
      const km = getHaversineDistance(28.6139, 77.209, 27.1767, 78.0081);
      expect(km).toBeGreaterThan(170);
      expect(km).toBeLessThan(220);
    });

    it("calculates trip cost and distance from itinerary and hotel data", () => {
      const sampleTrip: Partial<TripInfo> = {
        duration: "3 Days",
        hotels: [
          {
            hotel_name: "Hotel Alpha",
            hotel_address: "MG Road, Bengaluru",
            price_per_night: "₹3,000",
            rating: 4.5,
            hotel_image_url: "",
            description: "Central stay",
            geo_coordinates: { latitude: 12.9716, longitude: 77.5946 },
          },
        ],
        itinerary: [
          {
            day: 1,
            day_plan: "Explore gardens",
            best_time_to_visit_day: "Morning",
            activities: [
              {
                place_name: "Lalbagh",
                place_details: "Botanical garden",
                place_image_url: "",
                geo_coordinates: { latitude: 12.9507, longitude: 77.5848 },
                place_address: "Bengaluru",
                ticket_pricing: "₹50",
                time_travel_each_location: "15 mins",
                best_time_to_visit: "9 AM",
              },
            ],
          },
        ],
      };

      expect(calculateTripCost(sampleTrip)).toBe(9050);
      expect(calculateTripDistance(sampleTrip)).toBeGreaterThan(0);
    });
  });

  describe("extractCityFromAddress & buildGoogleFlightsUrl", () => {
    it("extracts known city names from full hotel addresses", () => {
      expect(extractCityFromAddress("Dashashwamedh Ghat, Varanasi, Uttar Pradesh, India")).toBe("Varanasi");
      expect(extractCityFromAddress("123 Main St, Austin, USA")).toBe("Austin");
    });

    it("builds encoded Google Flights URLs for valid routes", () => {
      const url = buildGoogleFlightsUrl("Delhi, India", "Tokyo, Japan");
      expect(url).toContain("https://www.google.com/travel/flights?q=");
      expect(url).toContain("Tokyo");
      expect(url).toContain("Delhi");
      expect(buildGoogleFlightsUrl("", "Tokyo")).toBe("");
    });
  });
});
