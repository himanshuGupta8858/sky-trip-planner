"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { 
  Clock, 
  Coins, 
  Globe, 
  ArrowLeftRight, 
  Sparkles, 
  Info, 
  Calendar, 
  Sun, 
  Moon, 
  CloudSun, 
  Plane,
  AlertCircle,
  HelpCircle,
  TrendingUp
} from "lucide-react";
import { TripInfo } from "./chatbox";
import { useAuth } from '@clerk/nextjs';
import { useUserDetail, useTripDetail } from '@/app/provider';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from "motion/react";

export interface LocationDetails {
  city: string;
  country: string;
  currencyCode: string;
  currencySymbol: string;
  timezone: string;
  timezoneName: string;
  flag: string;
}

export interface AIResponse {
  origin: LocationDetails;
  destination: LocationDetails;
  isDomestic: boolean;
  timezoneOffsetDifference: number;
  recommendations: {
    category: string;
    title: string;
    description: string;
  }[];
  events: {
    name: string;
    date: string;
    description: string;
    type: string;
  }[];
}

// Client-side fallback database
const DEFAULT_INDIA: LocationDetails = {
  city: "Delhi",
  country: "India",
  currencyCode: "INR",
  currencySymbol: "₹",
  timezone: "Asia/Kolkata",
  timezoneName: "IST",
  flag: "🇮🇳"
};

const DEFAULT_US: LocationDetails = {
  city: "New York",
  country: "United States",
  currencyCode: "USD",
  currencySymbol: "$",
  timezone: "America/New_York",
  timezoneName: "EST",
  flag: "🇺🇸"
};

const GEO_DATABASE: { keywords: string[]; details: LocationDetails }[] = [
  {
    keywords: [
      "india", "delhi", "mumbai", "bombay", "bangalore", "bengaluru", "kolkata", "calcutta", 
      "chennai", "madras", "hyderabad", "pune", "jaipur", "goa", "kerala", "agra", "varanasi",
      "nainital", "jhansi", "dehradun", "rishikesh", "haridwar", "shimla", "manali", "uttarakhand",
      "uttar pradesh", "rajasthan", "himachal", "punjab", "haryana", "kashmir", "srinagar", "ladakh",
      "amritsar", "bhopal", "indore", "lucknow", "kanpur", "ayodhya", "mathura", "vrindavan",
      "darjeeling", "mussoorie", "kodaikanal", "ooty", "munnar", "alleppey", "mysore", "kochi"
    ],
    details: {
      city: "Delhi",
      country: "India",
      currencyCode: "INR",
      currencySymbol: "₹",
      timezone: "Asia/Kolkata",
      timezoneName: "IST",
      flag: "🇮🇳"
    }
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
      flag: "🇯🇵"
    }
  },
  {
    keywords: ["united states", "usa", "america", "new york", "san francisco", "los angeles", "chicago", "miami", "boston", "seattle", "washington", "las vegas", "hawaii", "california", "texas"],
    details: {
      city: "New York",
      country: "United States",
      currencyCode: "USD",
      currencySymbol: "$",
      timezone: "America/New_York",
      timezoneName: "EST",
      flag: "🇺🇸"
    }
  },
  {
    keywords: ["united kingdom", "uk", "london", "manchester", "edinburgh", "birmingham", "scotland", "england", "wales", "ireland", "dublin"],
    details: {
      city: "London",
      country: "United Kingdom",
      currencyCode: "GBP",
      currencySymbol: "£",
      timezone: "Europe/London",
      timezoneName: "GMT",
      flag: "🇬🇧"
    }
  },
  {
    keywords: ["france", "paris", "nice", "lyon", "marseille"],
    details: {
      city: "Paris",
      country: "France",
      currencyCode: "EUR",
      currencySymbol: "€",
      timezone: "Europe/Paris",
      timezoneName: "CET",
      flag: "🇫🇷"
    }
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
      flag: "🇩🇪"
    }
  },
  {
    keywords: ["italy", "rome", "milan", "venice", "florence", "naples"],
    details: {
      city: "Rome",
      country: "Italy",
      currencyCode: "EUR",
      currencySymbol: "€",
      timezone: "Europe/Rome",
      timezoneName: "CET",
      flag: "🇮🇹"
    }
  },
  {
    keywords: ["spain", "madrid", "barcelona", "seville", "valencia", "mallorca"],
    details: {
      city: "Madrid",
      country: "Spain",
      currencyCode: "EUR",
      currencySymbol: "€",
      timezone: "Europe/Madrid",
      timezoneName: "CET",
      flag: "🇪🇸"
    }
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
      flag: "🇸🇬"
    }
  },
  {
    keywords: ["australia", "sydney", "melbourne", "brisbane", "perth", "adelaide", "cairns"],
    details: {
      city: "Sydney",
      country: "Australia",
      currencyCode: "AUD",
      currencySymbol: "A$",
      timezone: "Australia/Sydney",
      timezoneName: "AEST",
      flag: "🇦🇺"
    }
  },
  {
    keywords: ["canada", "toronto", "vancouver", "montreal", "ottawa", "calgary"],
    details: {
      city: "Toronto",
      country: "Canada",
      currencyCode: "CAD",
      currencySymbol: "C$",
      timezone: "America/Toronto",
      timezoneName: "EST",
      flag: "🇨🇦"
    }
  },
  {
    keywords: ["dubai", "abu dhabi", "uae", "united arab emirates"],
    details: {
      city: "Dubai",
      country: "United Arab Emirates",
      currencyCode: "AED",
      currencySymbol: "د.إ",
      timezone: "Asia/Dubai",
      timezoneName: "GST",
      flag: "🇦🇪"
    }
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
      flag: "🇹🇭"
    }
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
      flag: "🇮🇩"
    }
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
      flag: "🇨🇭"
    }
  }
];

export const detectLocationDetails = (placeName: string, isOrigin: boolean): LocationDetails => {
  if (!placeName) return isOrigin ? DEFAULT_INDIA : DEFAULT_US;
  
  const searchStr = placeName.toLowerCase();
  for (const entry of GEO_DATABASE) {
    for (const key of entry.keywords) {
      if (searchStr.includes(key)) {
        const cityPart = placeName.split(',')[0].trim();
        return {
          ...entry.details,
          city: cityPart || entry.details.city
        };
      }
    }
  }
  
  const parts = placeName.split(',');
  const city = parts[0].trim();
  const country = parts.length > 1 ? parts[1].trim() : "Unknown";
  
  return {
    city: city || (isOrigin ? "Origin" : "Destination"),
    country: country || (isOrigin ? "India" : "United States"),
    currencyCode: isOrigin ? "INR" : "USD",
    currencySymbol: isOrigin ? "₹" : "$",
    timezone: isOrigin ? "Asia/Kolkata" : "UTC",
    timezoneName: isOrigin ? "IST" : "UTC",
    flag: isOrigin ? "🇮🇳" : "🌐"
  };
};

const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 83.50,
  JPY: 158.00,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.50,
  CAD: 1.36,
  SGD: 1.35,
  AED: 3.67,
  THB: 36.50,
  IDR: 16300.0,
  CHF: 0.90,
};

export const DEFAULT_RECOMMENDATIONS = [
  {
    category: "Currency & Payments",
    title: "Local Payments",
    description: "Keep a combination of credit cards and local cash. If within India, UPI is widely accepted almost everywhere."
  },
  {
    category: "Connectivity",
    title: "Mobile Internet",
    description: "Arrange an eSIM or local SIM card prior to departure. Universal adapters are recommended for charging gadgets."
  },
  {
    category: "Cultural Protocol",
    title: "Local Etiquette",
    description: "Research simple phrases and greetings. Standard tipping rules vary, so check guidelines for restaurants and taxis."
  }
];

export const DEFAULT_EVENTS = [
  {
    name: "Local Cultural Festivals",
    date: "Seasonal",
    description: "Experience regional street food markets, craft fairs, and seasonal celebrations happening at local hubs.",
    type: "Festival"
  },
  {
    name: "Seasonal Outdoor Activities",
    date: "Monthly",
    description: "Explore botanical gardens, parks, and seasonal highlights specific to this time of year.",
    type: "Seasonal"
  },
  {
    name: "Weekend Markets & Fleas",
    date: "Weekly",
    description: "Visit traditional handicraft markets, fresh food stalls, and community popups.",
    type: "Market"
  }
];

interface AddonProps {
  trip?: TripInfo;
  initialData?: AIResponse | null;
}

const TripPlannerAddon = ({ trip, initialData }: AddonProps) => {
  const { has } = useAuth();
  const { userDetail, setUserDetail } = useUserDetail();
  const isPremium = (has ? has({ plan: 'monthly' }) : false) || 
    Boolean(userDetail?.subscription && userDetail.subscription !== 'free');
  const decrementAICredits = useMutation(api.user.DecrementAICredits);
  const dbCredits = userDetail?.aiCredits ?? 3;

  const [activeTab, setActiveTab] = useState<"currency" | "timezone" | "events">("currency");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiData, setAiData] = useState<AIResponse | null>(null);

  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const updateItinerary = useMutation(api.tripDetail.updateTripItinerary);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);

  const handleAddEventToItinerary = async (event: any, dayIndex: number) => {
    // Determine active trip detail
    const activeTrip = trip || tripDetailInfo;
    if (!activeTrip || !userDetail?._id) {
      toast.error("You can only add events to a saved itinerary.");
      return;
    }

    try {
      const currentItinerary = activeTrip.itinerary ? JSON.parse(JSON.stringify(activeTrip.itinerary)) : [];
      if (!currentItinerary[dayIndex]) {
        toast.error("Selected Day is invalid");
        return;
      }

      const defaultGeo = currentItinerary[0]?.activities?.[0]?.geo_coordinates || { latitude: 0, longitude: 0 };
      
      const newActivity = {
        place_name: event.name,
        place_details: event.description,
        place_image_url: "",
        geo_coordinates: defaultGeo,
        place_address: `Local Event (${event.type})`,
        ticket_pricing: "Free / Local Entry",
        time_travel_each_location: "N/A",
        best_time_to_visit: event.date || "Flexible"
      };

      if (!currentItinerary[dayIndex].activities) {
        currentItinerary[dayIndex].activities = [];
      }
      currentItinerary[dayIndex].activities.push(newActivity);

      const updatedTrip = {
        ...activeTrip,
        itinerary: currentItinerary
      };

      // Extract raw tripId (from useParams or the prop)
      const targetTripId = (activeTrip as any).tripId || (tripDetailInfo as any)?.tripId;
      if (!targetTripId) {
        toast.error("Trip ID not found");
        return;
      }

      const result = await updateItinerary({
        tripId: targetTripId,
        uid: userDetail._id,
        tripDetail: updatedTrip
      });

      if (result.success) {
        setTripDetailInfo(updatedTrip);
        toast.success(`"${event.name}" added to Day ${dayIndex + 1}! 🎉`);
        setSelectedEventIndex(null);
      } else {
        toast.error("Failed to update itinerary in database");
      }
    } catch (err) {
      console.error("Add event error", err);
      toast.error("Failed to add event to itinerary");
    }
  };

  // Standalone Mode & Search Inputs
  const isStandalone = !trip;
  const [originInput, setOriginInput] = useState(trip?.origin || "Delhi, India");
  const [destinationInput, setDestinationInput] = useState(trip?.destination || "Tokyo, Japan");
  const [originQuery, setOriginQuery] = useState(trip?.origin || "Delhi, India");
  const [destinationQuery, setDestinationQuery] = useState(trip?.destination || "Tokyo, Japan");

  // Live Exchange Rates State
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [ratesUpdated, setRatesUpdated] = useState<string>("");
  
  // Currency Converter Form State
  const [amount, setAmount] = useState<string>("100");
  const [sourceCurrency, setSourceCurrency] = useState<string>("INR");
  const [targetCurrency, setTargetCurrency] = useState<string>("JPY");

  // Timezone Form State
  const [sliderVal, setSliderVal] = useState<number>(12); // represents hours relative to current time (-12 to +12)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Detect local defaults immediately to prevent loading delay
  const localOrigin = useMemo(() => detectLocationDetails(originQuery, true), [originQuery]);
  const localDestination = useMemo(() => detectLocationDetails(destinationQuery, false), [destinationQuery]);

  // Sync state with detected values when ready
  useEffect(() => {
    if (localOrigin && localDestination) {
      setSourceCurrency(localOrigin.currencyCode);
      setTargetCurrency(localDestination.currencyCode);
    }
  }, [localOrigin, localDestination]);

  // Keep clock running
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Live Rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get("https://open.er-api.com/v6/latest/USD");
        if (res.data && res.data.rates) {
          setRates(res.data.rates);
          const dateStr = new Date(res.data.time_last_update_utc).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          });
          setRatesUpdated(dateStr);
        }
      } catch (err) {
        console.error("Error fetching live rates", err);
      }
    };
    fetchRates();
  }, []);

  const triggerAIPrediction = async (o: string, d: string) => {
    try {
      setLoadingAI(true);
      const res = await axios.post("/api/trip-addon", { origin: o, destination: d });
      if (res.data && !res.data.error) {
        setAiData(res.data);
        if (res.data.origin?.currencyCode) setSourceCurrency(res.data.origin.currencyCode);
        if (res.data.destination?.currencyCode) setTargetCurrency(res.data.destination.currencyCode);
      }
    } catch (err) {
      console.error("Error fetching AI enrichment", err);
    } finally {
      setLoadingAI(false);
    }
  };

  // Sync initialData or auto-trigger AI predictions for Premium Users
  useEffect(() => {
    if (initialData) {
      setAiData(initialData);
      if (initialData.origin?.currencyCode) setSourceCurrency(initialData.origin.currencyCode);
      if (initialData.destination?.currencyCode) setTargetCurrency(initialData.destination.currencyCode);
      setLoadingAI(false);
      return;
    }

    if (isPremium) {
      triggerAIPrediction(originQuery, destinationQuery);
    } else {
      setAiData(null);
      setLoadingAI(false);
    }
  }, [originQuery, destinationQuery, isPremium, initialData]);

  const handleUnlockAI = async () => {
    if (!userDetail?._id) return;
    if (dbCredits <= 0) return;
    try {
      const updatedUser = await decrementAICredits({ uid: userDetail._id });
      setUserDetail(updatedUser);
      await triggerAIPrediction(originQuery, destinationQuery);
    } catch (err) {
      console.error("Failed to unlock AI credits", err);
    }
  };

  const handleAnalyzeRoute = () => {
    setOriginQuery(originInput);
    setDestinationQuery(destinationInput);
  };

  // Values computed from current state or fallback
  const origin = aiData?.origin || localOrigin;
  const destination = aiData?.destination || localDestination;
  const isDomestic = aiData !== null ? aiData.isDomestic : (origin.country === destination.country);

  // Currency Calculations
  const conversionRate = useMemo(() => {
    const fromUSD = rates[sourceCurrency] || FALLBACK_RATES[sourceCurrency] || 1;
    const toUSD = rates[targetCurrency] || FALLBACK_RATES[targetCurrency] || 1;
    return toUSD / fromUSD;
  }, [rates, sourceCurrency, targetCurrency]);

  const convertedValue = useMemo(() => {
    const amtNum = parseFloat(amount) || 0;
    return (amtNum * conversionRate).toFixed(2);
  }, [amount, conversionRate]);

  const handleSwapCurrencies = () => {
    const temp = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  const quickMultipliers = [100, 500, 1000, 5000];

  // Timezone Calculations
  const formatTime = (date: Date, tz: string, offsetHours: number = 0) => {
    const adjustedDate = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(adjustedDate);
    } catch {
      return adjustedDate.toLocaleTimeString();
    }
  };

  const formatDate = (date: Date, tz: string, offsetHours: number = 0) => {
    const adjustedDate = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: "short",
        month: "short",
        day: "numeric"
      }).format(adjustedDate);
    } catch {
      return adjustedDate.toLocaleDateString();
    }
  };

  const offsetHoursDiff = useMemo(() => {
    if (aiData?.timezoneOffsetDifference !== undefined) {
      return aiData.timezoneOffsetDifference;
    }
    
    // Fallback calculation using Intl
    try {
      const getOffset = (tz: string) => {
        const d = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          timeZoneName: "longOffset"
        });
        const parts = formatter.formatToParts(d);
        const offsetString = parts.find(p => p.type === "timeZoneName")?.value || "";
        
        // formats like GMT+5:30, GMT-8, GMT
        if (!offsetString || offsetString === "GMT") return 0;
        const match = offsetString.match(/GMT([+-])(\d+):?(\d*)/);
        if (!match) return 0;
        const sign = match[1] === "+" ? 1 : -1;
        const hours = parseInt(match[2]);
        const minutes = parseInt(match[3] || "0");
        return sign * (hours + minutes / 60);
      };
      
      return getOffset(destination.timezone) - getOffset(origin.timezone);
    } catch {
      return 0;
    }
  }, [origin.timezone, destination.timezone, aiData]);

  // Adjusting timezone slider representation
  const sliderHoursOffset = sliderVal - 12; // Slider is 0-24, offset is -12 to +12 hours from now

  const originPlannedTime = formatTime(currentTime, origin.timezone, sliderHoursOffset);
  const originPlannedDate = formatDate(currentTime, origin.timezone, sliderHoursOffset);

  const destPlannedTime = formatTime(currentTime, destination.timezone, sliderHoursOffset);
  const destPlannedDate = formatDate(currentTime, destination.timezone, sliderHoursOffset);

  // Time details mapping
  const timeDifferenceText = useMemo(() => {
    if (isDomestic && offsetHoursDiff === 0) {
      return "Same timezone (No time difference)";
    }
    const absDiff = Math.abs(offsetHoursDiff);
    const hrs = Math.floor(absDiff);
    const mins = Math.round((absDiff - hrs) * 60);
    const timeStr = `${hrs}h ${mins > 0 ? mins + 'm' : ''}`;
    
    if (offsetHoursDiff > 0) {
      return `${destination.city} is ${timeStr} ahead of ${origin.city}`;
    } else {
      return `${destination.city} is ${timeStr} behind ${origin.city}`;
    }
  }, [offsetHoursDiff, origin.city, destination.city, isDomestic]);

  // Check if current time in dest is suitable for calls (9 AM - 9 PM)
  const isGoodBusinessHour = (timeStr: string) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (!match) return true;
    let hour = parseInt(match[1]);
    const ampm = match[3];
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return hour >= 9 && hour <= 21;
  };

  const destCallingStatus = useMemo(() => {
    const good = isGoodBusinessHour(destPlannedTime);
    return {
      allowed: good,
      text: good ? "Active Hours (Suitable for activities/calls)" : "Quiet Hours (Late Night/Early Morning)"
    };
  }, [destPlannedTime]);

  const recommendations = aiData?.recommendations || DEFAULT_RECOMMENDATIONS;

  const googleFlightsUrl = useMemo(() => {
    const cleanCity = (name: string) => {
      if (!name) return "";
      return name.split(",")[0].trim();
    };
    const originCity = cleanCity(origin.city);
    const destCity = cleanCity(destination.city);

    const date = new Date();
    date.setDate(date.getDate() + 7);
    const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const query = `Flights to ${destCity} from ${originCity} on ${dateString}`;
    return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
  }, [origin.city, destination.city]);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
      
      {/* Standalone inputs for city search */}
      {isStandalone && (
        <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl mb-5 space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
            <Globe className="w-3.5 h-3.5 text-orange-500" />
            <span>Standalone Search Route</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-450 uppercase tracking-wider block">From Location</label>
              <input 
                type="text" 
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                placeholder="e.g. Delhi, India"
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-100 focus:outline-none focus:border-orange-500/80"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-neutral-450 uppercase tracking-wider block">To Destination</label>
              <input 
                type="text" 
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder="e.g. Tokyo, Japan"
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-100 focus:outline-none focus:border-orange-500/80"
              />
            </div>
          </div>
          <button 
            onClick={handleAnalyzeRoute}
            className="w-full py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            Analyze Route
          </button>
        </div>
      )}

      {/* Header and Toggle */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500 fill-orange-500/10" />
            <h2 className="text-xl font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">Trip Companion</h2>
          </div>
          {loadingAI && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-450">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>AI Syncing...</span>
            </div>
          )}
          {!loadingAI && !isPremium && (
            <div className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-bold text-neutral-500">
              {dbCredits} AI Credits Left
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-50 dark:bg-neutral-800/40 p-1 rounded-xl border border-neutral-100 dark:border-neutral-800/80">
          <button 
            onClick={() => setActiveTab("currency")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'currency' ? 'bg-white dark:bg-neutral-800 shadow-sm text-neutral-950 dark:text-white' : 'text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-355'}`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Currency</span>
          </button>
          <button 
            onClick={() => setActiveTab("timezone")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'timezone' ? 'bg-white dark:bg-neutral-800 shadow-sm text-neutral-950 dark:text-white' : 'text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-355'}`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timezone</span>
          </button>
          <button 
            onClick={() => setActiveTab("events")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'events' ? 'bg-white dark:bg-neutral-800 shadow-sm text-neutral-950 dark:text-white' : 'text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-355'}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events</span>
          </button>
        </div>
      </div>

      {/* AI Unlock Widget for Free Users */}
      {!isPremium && !aiData && (
        <div className="bg-orange-50/20 dark:bg-neutral-850/20 p-4 border border-dashed border-orange-200/60 dark:border-neutral-800 rounded-2xl mb-5 text-center space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-orange-600 dark:text-orange-400">
            <Sparkles className="w-4 h-4 fill-orange-500/10" />
            <span>Unlock Premium AI Companion Guide</span>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-450 leading-relaxed max-w-sm mx-auto font-medium">
            Get personalized travel protocols, connectivity eSIM tips, local cash/card guidelines, and timezone adjustment coping strategies.
          </p>
          
          <div className="pt-1">
            {dbCredits > 0 ? (
              <button 
                onClick={handleUnlockAI}
                className="py-2 px-5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-orange-500/10 hover:shadow-lg active:scale-95"
              >
                Spend 1 AI Credit ({dbCredits} left)
              </button>
            ) : (
              <Link href="/pricing">
                <span className="inline-block py-2 px-5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-xl text-xs font-bold cursor-pointer border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200/60 dark:hover:bg-neutral-750 transition-colors">
                  0 Credits Remaining — Upgrade to Premium
                </span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === "currency" ? (
          <motion.div
            key="currency"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="space-y-4"
          >
          {/* Conversion Details */}
          <div className="flex items-center gap-3 bg-orange-50/40 dark:bg-neutral-850/40 p-3 rounded-2xl border border-orange-100/50 dark:border-neutral-800/30">
            <div className="text-xl font-bold">{origin.flag}</div>
            <div className="flex-1">
              <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Itinerary Conversion</p>
              <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                {origin.city} to {destination.city} ({origin.currencyCode} {origin.currencySymbol} → {destination.currencyCode} {destination.currencySymbol})
              </h4>
            </div>
          </div>

          {/* Inputs Row */}
          <div className="grid grid-cols-5 gap-2 items-center">
            {/* Source */}
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">From</label>
              <select 
                value={sourceCurrency}
                onChange={(e) => setSourceCurrency(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 text-sm font-bold text-neutral-800 dark:text-neutral-100 focus:outline-none"
              >
                {Object.keys(rates).map(cur => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="col-span-1 flex justify-center pt-5">
              <button 
                onClick={handleSwapCurrencies}
                className="p-2 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 border border-neutral-100 dark:border-neutral-850 rounded-xl cursor-pointer shadow-sm hover:scale-105 transition-all text-neutral-600 dark:text-neutral-350"
                title="Swap Currencies"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Target */}
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">To</label>
              <select 
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 rounded-xl p-2.5 text-sm font-bold text-neutral-800 dark:text-neutral-100 focus:outline-none"
              >
                {Object.keys(rates).map(cur => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount Input & Live Display */}
          <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Amount</label>
              <span className="text-[10px] font-semibold text-neutral-400">
                1 {sourceCurrency} = {conversionRate.toFixed(4)} {targetCurrency}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-neutral-400">{sourceCurrency === "INR" ? "₹" : sourceCurrency === "USD" ? "$" : sourceCurrency === "JPY" ? "¥" : sourceCurrency === "EUR" ? "€" : sourceCurrency === "GBP" ? "£" : ""}</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.00"
                className="flex-1 bg-transparent text-lg font-bold outline-none text-neutral-800 dark:text-white"
              />
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800 my-3 pt-3 flex items-baseline justify-between">
              <span className="text-xs text-neutral-400 font-semibold">Converted</span>
              <div className="text-right">
                <span className="text-2xl font-black text-orange-500 tracking-tight">{convertedValue}</span>
                <span className="text-sm font-bold text-neutral-500 ml-1.5">{targetCurrency}</span>
              </div>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-1.5">
            {quickMultipliers.map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="flex-1 py-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-350 cursor-pointer transition-colors"
              >
                +{val}
              </button>
            ))}
          </div>

          {/* Source update note */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400/80 px-1 pt-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              Live Rates Active
            </span>
            {ratesUpdated && <span>Updated {ratesUpdated}</span>}
          </div>
        </motion.div>
      ) : activeTab === "timezone" ? (
        /* Timezone Tab */
        <motion.div
          key="timezone"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="space-y-4"
        >
          {/* Timezone Status Info */}
          <div className="bg-orange-50/40 dark:bg-neutral-850/40 p-3 rounded-2xl border border-orange-100/50 dark:border-neutral-800/30 flex items-start gap-2.5">
            <Globe className="w-4 h-4 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-300">Time Difference</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal font-medium mt-0.5">
                {timeDifferenceText}
              </p>
            </div>
          </div>

          {/* Planner Display */}
          <div className="grid grid-cols-2 gap-3">
            {/* Origin */}
            <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3.5 border border-neutral-100 dark:border-neutral-800 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <span className="text-base">{origin.flag}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider truncate max-w-[80px]">{origin.city}</span>
              </div>
              <h3 className="text-lg font-black text-neutral-800 dark:text-white tracking-tight">{originPlannedTime}</h3>
              <p className="text-[10px] text-neutral-400 font-semibold mt-1">{originPlannedDate}</p>
              <div className="mt-2 text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 py-0.5 px-2 rounded-full inline-block text-neutral-500">
                {origin.timezoneName}
              </div>
            </div>

            {/* Destination */}
            <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3.5 border border-neutral-100 dark:border-neutral-800 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <span className="text-base">{destination.flag}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider truncate max-w-[80px]">{destination.city}</span>
              </div>
              <h3 className="text-lg font-black text-orange-500 tracking-tight">{destPlannedTime}</h3>
              <p className="text-[10px] text-neutral-400 font-semibold mt-1">{destPlannedDate}</p>
              <div className="mt-2 text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 py-0.5 px-2 rounded-full inline-block text-neutral-500">
                {destination.timezoneName}
              </div>
            </div>
          </div>

          {/* Time Planner Slider */}
          {!isDomestic && (
            <div className="space-y-1.5 bg-neutral-50 dark:bg-neutral-800/40 p-3.5 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
              <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                <span>Adjust Time</span>
                <span className="text-neutral-500 font-semibold">
                  {sliderHoursOffset === 0 ? "Current Time" : sliderHoursOffset > 0 ? `+${sliderHoursOffset}h` : `${sliderHoursOffset}h`}
                </span>
              </div>
              <input 
                type="range"
                min="0"
                max="24"
                value={sliderVal}
                onChange={(e) => setSliderVal(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-neutral-400 font-semibold px-0.5 mt-0.5">
                <span>12h ago</span>
                <span>Current</span>
                <span>12h ahead</span>
              </div>

              {/* Suitability Indicator */}
              <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${destCallingStatus.allowed ? 'bg-emerald-500 shadow-sm shadow-emerald-400/20' : 'bg-amber-500 shadow-sm shadow-amber-400/20'}`} />
                <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                  {destCallingStatus.text}
                </span>
              </div>
            </div>
          )}

          {/* Domestic Indicator */}
          {isDomestic && (
            <div className="flex items-center gap-2 bg-emerald-50/40 dark:bg-emerald-950/10 p-3 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wide justify-center">
              <span>✈️ Domestic Trip Details Locked</span>
            </div>
          )}
        </motion.div>
      ) : (
        /* Events Tab */
        <motion.div
          key="events"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="space-y-4"
        >
          <div className="bg-orange-50/40 dark:bg-neutral-850/40 p-3 rounded-2xl border border-orange-100/50 dark:border-neutral-800/30 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-300">Local Festivals & Events</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-450 leading-normal font-medium mt-0.5">
                Explore cultural festivals, concerts, public holidays, and seasonal highlights in {destination.city}.
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {(aiData?.events || DEFAULT_EVENTS).map((event, index) => {
              const isActive = selectedEventIndex === index;
              const activeTrip = trip || tripDetailInfo;
              const hasItinerary = activeTrip && activeTrip.itinerary && activeTrip.itinerary.length > 0;

              return (
                <div 
                  key={index} 
                  className="bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-3.5 hover:bg-white dark:hover:bg-neutral-800/50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-500 bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded">
                      {event.type}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400">
                      📅 {event.date}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-850 dark:text-neutral-255 mb-1">{event.name}</h4>
                  <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-405 mb-3 font-medium">
                    {event.description}
                  </p>

                  {/* Add to Itinerary Button/Selector */}
                  {hasItinerary ? (
                    <div>
                      {!isActive ? (
                        <button 
                          onClick={() => setSelectedEventIndex(index)}
                          className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Add to Itinerary
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-neutral-450 uppercase tracking-wider block">
                            Select Day to Add:
                          </label>
                          <div className="flex gap-1.5 flex-wrap">
                            {activeTrip.itinerary.map((day: any, dIdx: number) => (
                              <button
                                key={dIdx}
                                onClick={() => handleAddEventToItinerary(event, dIdx)}
                                className="px-3 py-1 bg-orange-50 hover:bg-orange-100 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-orange-600 dark:text-orange-400 rounded-lg text-[10px] font-extrabold cursor-pointer border border-orange-100/50 dark:border-neutral-700 transition-colors"
                              >
                                Day {dIdx + 1}
                              </button>
                            ))}
                            <button
                              onClick={() => setSelectedEventIndex(null)}
                              className="px-3 py-1 bg-neutral-100 hover:bg-neutral-205 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-500 dark:text-neutral-400 rounded-lg text-[10px] font-bold cursor-pointer border border-neutral-200 dark:border-neutral-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[9px] font-bold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 py-1.5 text-center rounded-xl">
                      Save Trip first to add to Itinerary
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Dynamic AI travel recommendations */}
      <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>AI Companion Tips</span>
        </h3>
        
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div 
              key={i} 
              className="bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-3.5 hover:border-orange-100 dark:hover:border-neutral-850 hover:bg-white dark:hover:bg-neutral-800/50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
            >
              <div className="flex items-center gap-2 mb-1.5">
                {rec.category.toLowerCase().includes("payment") || rec.category.toLowerCase().includes("currency") ? (
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                ) : rec.category.toLowerCase().includes("timezone") || rec.category.toLowerCase().includes("jet lag") || rec.category.toLowerCase().includes("time") ? (
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                ) : rec.category.toLowerCase().includes("transit") || rec.category.toLowerCase().includes("transport") ? (
                  <Plane className="w-3.5 h-3.5 text-teal-500" />
                ) : rec.category.toLowerCase().includes("weather") || rec.category.toLowerCase().includes("climate") ? (
                  <CloudSun className="w-3.5 h-3.5 text-orange-400" />
                ) : (
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                )}
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">{rec.category}</span>
              </div>
              <h4 className="text-xs font-bold text-neutral-850 dark:text-neutral-200 mb-1">{rec.title}</h4>
              <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400 font-medium">
                {rec.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Booking Actions */}
      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
        <a 
          href={googleFlightsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Find Flights on Google Flights</span>
        </a>
      </div>
    </div>
  );
};

export default TripPlannerAddon;
