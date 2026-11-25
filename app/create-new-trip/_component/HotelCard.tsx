"use client";

import { extractCityFromAddress } from "@/lib/travel-utils";
import type { Hotel } from "@/types/trip";
import axios from "axios";
import { ExternalLink, MapPin, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface HotelCardProps {
  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel | null) => void;
}

const HotelCard = ({ selectedHotel, setSelectedHotel }: HotelCardProps) => {
  const [photoUrl, setPhotoUrl] = useState<string>();

  const getGooglePlaceDetail = useCallback(async () => {
    if (!selectedHotel) return;
    try {
      const result = await axios.post<string | null>("/api/google-place-detail", {
        placeName: selectedHotel.hotel_name,
      });
      if (result?.data) {
        setPhotoUrl(result.data);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch hotel details:", error);
    }
  }, [selectedHotel]);

  useEffect(() => {
    if (selectedHotel) {
      void getGooglePlaceDetail();
    }
  }, [selectedHotel, getGooglePlaceDetail]);

  useEffect(() => {
    if (!selectedHotel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedHotel(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedHotel, setSelectedHotel]);

  const handleBookNow = (hotel: Hotel) => {
    const hotelName = hotel.hotel_name || "";
    const city = extractCityFromAddress(hotel.hotel_address);
    const query = `site:makemytrip.com/hotels/ "${hotelName}" ${city}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      {selectedHotel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedHotel(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hotel-modal-title"
        >
          <div
            className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-neutral-200 dark:border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 w-full">
              <Image
                src={photoUrl || "/Hotel.png"}
                alt={selectedHotel.hotel_name}
                fill
                className="object-cover"
              />
              <button
                type="button"
                aria-label="Close hotel details"
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h2 id="hotel-modal-title" className="text-white font-bold text-2xl drop-shadow-md">
                    {selectedHotel.hotel_name}
                  </h2>
                  <div className="flex items-center gap-2 text-white/90 drop-shadow-md">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {selectedHotel.hotel_address}
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                    <span className="text-white font-bold">{selectedHotel.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-wide uppercase font-semibold">
                    Price per night
                  </p>
                  <p className="text-3xl font-bold text-primary">{selectedHotel.price_per_night}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-wide uppercase font-semibold text-right">
                    Coordinates
                  </p>
                  <p className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-600 dark:text-neutral-300">
                    {Number(selectedHotel.geo_coordinates.latitude).toFixed(4)},{" "}
                    {Number(selectedHotel.geo_coordinates.longitude).toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  About this place
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">
                  {selectedHotel.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-md text-center text-neutral-800 dark:text-neutral-200">
                  Address: {selectedHotel.hotel_address}
                </p>
              </div>
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${selectedHotel.hotel_name},${selectedHotel.hotel_address}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary dark:bg-white text-white dark:text-black px-5 py-2.5 mt-4 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity w-full flex items-center justify-center gap-2"
              >
                <span>View on Map</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => handleBookNow(selectedHotel)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg mt-2 transition-colors cursor-pointer"
              >
                Book Now on MakeMyTrip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelCard;
