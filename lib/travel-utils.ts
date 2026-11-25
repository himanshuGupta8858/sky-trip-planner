import type { LocationDetails, TripInfo } from "@/types/trip";

export const DEFAULT_INDIA: LocationDetails = {
  city: "Delhi",
  country: "India",
  currencyCode: "INR",
  currencySymbol: "₹",
  timezone: "Asia/Kolkata",
  timezoneName: "IST",
  flag: "🇮🇳",
};

export const DEFAULT_US: LocationDetails = {
  city: "New York",
  country: "United States",
  currencyCode: "USD",
  currencySymbol: "$",
  timezone: "America/New_York",
  timezoneName: "EST",
  flag: "🇺🇸",
};

export const GEO_DATABASE: Array<{ keywords: string[]; details: LocationDetails }> = [
  {
    keywords: [
      "india", "delhi", "mumbai", "bombay", "bangalore", "bengaluru", "kolkata", "calcutta",
      "chennai", "madras", "hyderabad", "pune", "jaipur", "goa", "kerala", "agra", "varanasi",
      "nainital", "jhansi", "dehradun", "rishikesh", "haridwar", "shimla", "manali", "uttarakhand",
      "uttar pradesh", "rajasthan", "himachal", "punjab", "haryana", "kashmir", "srinagar", "ladakh",
      "amritsar", "bhopal", "indore", "lucknow", "kanpur", "ayodhya", "mathura", "vrindavan",
      "darjeeling", "mussoorie", "kodaikanal", "ooty", "munnar", "alleppey", "mysore", "kochi",
      "udaipur", "jaisalmer", "jodhpur",
    ],
    details: { ...DEFAULT_INDIA },
  },
  {
    keywords: ["japan", "tokyo", "osaka", "kyoto", "yokohama", "sapporo", "fukuoka", "nagoya", "hiroshima", "nara", "okinawa"],
    details: {
      city: "Tokyo",
      country: "Japan",
      currencyCode: "JPY",
      currencySymbol: "¥",
      timezone: "Asia/Tokyo",
      timezoneName: "JST",
      flag: "🇯🇵",
    },
  },
  {
    keywords: ["united states", "usa", "america", "new york", "san francisco", "los angeles", "chicago", "miami", "boston", "seattle", "washington", "las vegas", "hawaii", "california", "texas"],
    details: { ...DEFAULT_US },
  },
  {
    keywords: ["united kingdom", "uk", "london", "manchester", "edinburgh", "birmingham", "liverpool", "oxford", "england", "scotland"],
    details: {
      city: "London",
      country: "United Kingdom",
      currencyCode: "GBP",
      currencySymbol: "£",
      timezone: "Europe/London",
      timezoneName: "GMT",
      flag: "🇬🇧",
    },
  },
  {
    keywords: ["france", "paris", "nice", "lyon", "marseille", "bordeaux", "cannes"],
    details: {
      city: "Paris",
      country: "France",
      currencyCode: "EUR",
      currencySymbol: "€",
      timezone: "Europe/Paris",
      timezoneName: "CET",
      flag: "🇫🇷",
    },
  },
  {
    keywords: ["germany", "berlin", "munich", "frankfurt", "hamburg", "cologne"],
    details: {
      city: "Berlin",
      country: "Germany",
      currencyCode: "EUR",
      currencySymbol: "€",
      timezone: "Europe/Berlin",
      timezoneName: "CET",
      flag: "🇩🇪",
    },
  },
  {
    keywords: ["italy", "rome", "milan", "venice", "florence", "naples", "amalfi"],
    details: {
      city: "Rome",
      country: "Italy",
      currencyCode: "EUR",
      currencySymbol: "€",
      timezone: "Europe/Rome",
      timezoneName: "CET",
      flag: "🇮🇹",
    },
  },
  {
    keywords: ["spain", "madrid", "barcelona", "seville", "valencia", "ibiza"],
    details: {
      city: "Madrid",
      country: "Spain",
      currencyCode: "EUR",
      currencySymbol: "€",
      timezone: "Europe/Madrid",
      timezoneName: "CET",
      flag: "🇪🇸",
    },
  },
  {
    keywords: ["uae", "dubai", "abu dhabi", "sharjah", "emirates"],
    details: {
      city: "Dubai",
      country: "UAE",
      currencyCode: "AED",
      currencySymbol: "د.إ",
      timezone: "Asia/Dubai",
      timezoneName: "GST",
      flag: "🇦🇪",
    },
  },
  {
    keywords: ["singapore"],
    details: {
      city: "Singapore",
      country: "Singapore",
      currencyCode: "SGD",
      currencySymbol: "S$",
      timezone: "Asia/Singapore",
      timezoneName: "SGT",
      flag: "🇸🇬",
    },
  },
  {
    keywords: ["australia", "sydney", "melbourne", "brisbane", "perth", "gold coast"],
    details: {
      city: "Sydney",
      country: "Australia",
      currencyCode: "AUD",
      currencySymbol: "A$",
      timezone: "Australia/Sydney",
      timezoneName: "AEST",
      flag: "🇦🇺",
    },
  },
  {
    keywords: ["canada", "toronto", "vancouver", "montreal", "ottawa", "calgary", "banff"],
    details: {
      city: "Toronto",
      country: "Canada",
      currencyCode: "CAD",
      currencySymbol: "C$",
      timezone: "America/Toronto",
      timezoneName: "EST",
      flag: "🇨🇦",
    },
  },
  {
    keywords: ["thailand", "bangkok", "phuket", "pattaya", "chiang mai", "krabi"],
    details: {
      city: "Bangkok",
      country: "Thailand",
      currencyCode: "THB",
      currencySymbol: "฿",
      timezone: "Asia/Bangkok",
      timezoneName: "ICT",
      flag: "🇹🇭",
    },
  },
  {
    keywords: ["indonesia", "bali", "jakarta", "ubud", "denpasar"],
    details: {
      city: "Bali",
      country: "Indonesia",
      currencyCode: "IDR",
      currencySymbol: "Rp",
      timezone: "Asia/Jakarta",
      timezoneName: "WIB",
      flag: "🇮🇩",
    },
  },
  {
    keywords: ["switzerland", "zurich", "geneva", "lucerne", "interlaken"],
    details: {
      city: "Zurich",
      country: "Switzerland",
      currencyCode: "CHF",
      currencySymbol: "CHF",
      timezone: "Europe/Zurich",
      timezoneName: "CET",
      flag: "🇨🇭",
    },
  },
];

export const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  INR: 84.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 153.2,
  AUD: 1.52,
  CAD: 1.38,
  AED: 3.67,
  SGD: 1.34,
  THB: 34.5,
  IDR: 15700,
  CHF: 0.88,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  JPY: "¥",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  SGD: "S$",
  AUD: "A$",
  CAD: "C$",
  THB: "฿",
  IDR: "Rp",
  CHF: "CHF ",
};

/**
 * Resolves country, currency, flag, and IANA timezone metadata for a place string.
 */
export function detectLocationDetails(placeName: string, isOrigin: boolean): LocationDetails {
  if (!placeName || !placeName.trim()) {
    return isOrigin ? { ...DEFAULT_INDIA } : { ...DEFAULT_US };
  }

  const searchStr = placeName.toLowerCase();
  for (const entry of GEO_DATABASE) {
    for (const key of entry.keywords) {
      if (searchStr.includes(key)) {
        const cityPart = placeName.split(",")[0].trim();
        return {
          ...entry.details,
          city: cityPart || entry.details.city,
        };
      }
    }
  }

  const cityPart = placeName.split(",")[0].trim();
  const base = isOrigin ? DEFAULT_INDIA : DEFAULT_US;
  return {
    ...base,
    city: cityPart || base.city,
  };
}

/**
 * Returns the currency symbol for a given ISO currency code.
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_SYMBOLS[currencyCode.toUpperCase()] ?? "";
}

/**
 * Converts an amount from source currency to target currency using live or fallback USD-indexed rates.
 */
export function convertCurrency(
  amount: number,
  sourceCurrency: string,
  targetCurrency: string,
  rates: Record<string, number> = FALLBACK_RATES
): { rate: number; converted: number } {
  const fromUSD = rates[sourceCurrency] || FALLBACK_RATES[sourceCurrency] || 1;
  const toUSD = rates[targetCurrency] || FALLBACK_RATES[targetCurrency] || 1;
  const rate = toUSD / fromUSD;
  const safeAmount = Number.isFinite(amount) && amount >= 0 ? amount : 0;
  return {
    rate,
    converted: Number((safeAmount * rate).toFixed(2)),
  };
}

/**
 * Computes the timezone offset difference in hours between two IANA timezones.
 */
export function calculateTimezoneOffset(originTz: string, destTz: string, referenceDate: Date = new Date()): number {
  if (originTz === destTz) return 0;
  try {
    const getOffsetHours = (tz: string): number => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "longOffset",
      });
      const parts = formatter.formatToParts(referenceDate);
      const offsetString = parts.find((p) => p.type === "timeZoneName")?.value || "";
      if (!offsetString || offsetString === "GMT") return 0;
      const match = offsetString.match(/GMT([+-])(\d+):?(\d*)/);
      if (!match) return 0;
      const sign = match[1] === "+" ? 1 : -1;
      const hours = parseInt(match[2], 10);
      const minutes = parseInt(match[3] || "0", 10);
      return sign * (hours + minutes / 60);
    };

    return getOffsetHours(destTz) - getOffsetHours(originTz);
  } catch {
    return 0;
  }
}

/**
 * Checks whether a formatted 12-hour time string falls within sociable hours (9 AM to 9 PM).
 */
export function isGoodBusinessHour(timeStr: string): boolean {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return true;
  let hour = parseInt(match[1], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return hour >= 9 && hour <= 21;
}

/**
 * Computes great-circle distance between two coordinates in kilometers via Haversine formula.
 */
export function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Parses numeric price from currency-formatted strings (e.g., "₹2,500", "$120.50", "Free entry").
 */
export function parsePrice(priceStr: string | number | undefined | null): number {
  if (typeof priceStr === "number") {
    return Number.isFinite(priceStr) ? priceStr : 0;
  }
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Calculates total estimated itinerary travel distance in kilometers.
 */
export function calculateTripDistance(trip: Partial<TripInfo>): number {
  let total = 0;
  const itinerary = trip.itinerary || [];
  const hotel = trip.hotels?.[0];
  const hotelLat = hotel?.geo_coordinates?.latitude;
  const hotelLng = hotel?.geo_coordinates?.longitude;

  let lastLat = hotelLat;
  let lastLng = hotelLng;

  itinerary.forEach((day) => {
    (day.activities || []).forEach((act) => {
      const actLat = act.geo_coordinates?.latitude;
      const actLng = act.geo_coordinates?.longitude;
      if (lastLat && lastLng && actLat && actLng) {
        total += getHaversineDistance(Number(lastLat), Number(lastLng), Number(actLat), Number(actLng));
      }
      lastLat = actLat || lastLat;
      lastLng = actLng || lastLng;
    });

    if (lastLat && lastLng && hotelLat && hotelLng) {
      total += getHaversineDistance(Number(lastLat), Number(lastLng), Number(hotelLat), Number(hotelLng));
    }
    lastLat = hotelLat;
    lastLng = hotelLng;
  });

  if (total === 0) {
    const days = parseInt(String(trip.duration || "3"), 10) || 3;
    total = days * 45;
  }
  return Math.round(total);
}

/**
 * Calculates estimated total cost of a trip (average hotel rate * days + ticket prices).
 */
export function calculateTripCost(trip: Partial<TripInfo>): number {
  const days = parseInt(String(trip.duration || "1"), 10) || 1;
  const hotelCount = trip.hotels?.length || 0;
  const totalHotelPrice =
    trip.hotels?.reduce((sum, hotel) => sum + parsePrice(hotel.price_per_night), 0) || 0;

  const avgHotelPrice = hotelCount > 0 ? totalHotelPrice / hotelCount : 0;
  const hotelCost = avgHotelPrice * days;

  const activitiesCost =
    trip.itinerary?.reduce((daySum, day) => {
      return (
        daySum +
        (day.activities?.reduce((actSum, act) => actSum + parsePrice(act.ticket_pricing), 0) || 0)
      );
    }, 0) || 0;

  return Math.round(hotelCost + activitiesCost);
}

/**
 * Extracts a clean city name from a multi-segment hotel or place address.
 */
export function extractCityFromAddress(address: string): string {
  if (!address) return "";
  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Bengaluru", "Srinagar", "Jaipur", "Goa", "Agra",
    "Chennai", "Hyderabad", "Kolkata", "Pune", "Manali", "Shimla", "Udaipur", "Kochi",
    "Ooty", "Munnar", "Varanasi", "Amritsar", "Jaisalmer", "Jodhpur", "Rishikesh",
  ];
  for (const city of cities) {
    if (address.toLowerCase().includes(city.toLowerCase())) return city;
  }

  const parts = address.split(",").map((p) => p.trim());
  const ignoredWords = new Set([
    "india", "usa", "united states", "uk", "united kingdom",
    "vietnam", "thailand", "singapore", "malaysia", "indonesia",
  ]);

  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (!part || /\d/.test(part)) continue;
    if (ignoredWords.has(part.toLowerCase())) continue;
    return part;
  }
  return "";
}

/**
 * Generates a pre-filled Google Flights search URL for an origin and destination pair.
 */
export function buildGoogleFlightsUrl(origin?: string, destination?: string, daysAhead = 7): string {
  if (!origin || !destination) return "";
  const cleanCity = (name: string) => name.split(",")[0].trim();
  const originCity = cleanCity(origin);
  const destCity = cleanCity(destination);
  if (!originCity || !destCity) return "";

  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const dateString = date.toISOString().split("T")[0];
  const query = `Flights to ${destCity} from ${originCity} on ${dateString}`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
}
