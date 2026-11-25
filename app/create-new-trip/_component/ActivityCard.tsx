"use client";
import type { Activity } from "@/types/trip";
import axios from "axios";
import { ExternalLink, MapPin, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

interface ActivityCardProps {
  selectedActivity: Activity | null;
  setSelectedActivity: (activity: Activity | null) => void;
}

const ActivityCard = ({ selectedActivity, setSelectedActivity }: ActivityCardProps) => {
  const [photoUrl, setPhotoUrl] = useState<string>();

  const getGooglePlaceDetail = useCallback(async () => {
    if (!selectedActivity) return;
    try {
      const result = await axios.post<string | null>("/api/google-place-detail", {
        placeName: `${selectedActivity.place_name}:${selectedActivity.place_address}`,
      });
      if (result?.data) {
        setPhotoUrl(result.data);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch activity details:", error);
    }
  }, [selectedActivity]);

  useEffect(() => {
    if (selectedActivity) {
      void getGooglePlaceDetail();
    }
  }, [selectedActivity, getGooglePlaceDetail]);

  useEffect(() => {
    if (!selectedActivity) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedActivity(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedActivity, setSelectedActivity]);

  return (
    <div>
      {selectedActivity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedActivity(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="activity-modal-title"
        >
          <div
            className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-neutral-200 dark:border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 w-full">
              <Image
                src={photoUrl || "/activities.png"}
                alt={selectedActivity.place_name}
                fill
                className="object-cover"
              />
              <button
                type="button"
                aria-label="Close activity details"
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h2 id="activity-modal-title" className="text-white font-bold text-2xl drop-shadow-md">
                    {selectedActivity.place_name}
                  </h2>
                  <div className="flex items-center gap-2 text-white/90 drop-shadow-md">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {selectedActivity.place_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-wide uppercase font-semibold">
                    Ticket Price
                  </p>
                  <p className="text-xl font-bold text-primary">{selectedActivity.ticket_pricing}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-wide uppercase font-semibold">
                    Travel Time
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {selectedActivity.time_travel_each_location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-wide uppercase font-semibold">
                    Best Time
                  </p>
                  <p className="text-lg font-bold text-primary">{selectedActivity.best_time_to_visit}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-wide uppercase font-semibold text-right">
                    Coordinates
                  </p>
                  <p className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-600 dark:text-neutral-300">
                    {Number(selectedActivity.geo_coordinates.latitude).toFixed(4)},{" "}
                    {Number(selectedActivity.geo_coordinates.longitude).toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  About this activity
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">
                  {selectedActivity.place_details}
                </p>
              </div>

              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${selectedActivity.place_name},${selectedActivity.place_address}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary dark:bg-white text-white dark:text-black px-5 py-2.5 mt-4 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity w-full flex items-center justify-center gap-2"
              >
                <span>View on Map</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
