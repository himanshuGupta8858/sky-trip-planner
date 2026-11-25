"use client";
import type { TripRecord } from "@/types/trip";
import axios from "axios";
import { ArrowBigRightDash, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const MyTripCard = ({ trip }: { trip: TripRecord }) => {
  const [photoUrl, setPhotoUrl] = useState<string>();

  const getGooglePlaceDetail = useCallback(async () => {
    try {
      const result = await axios.post<string | null>("/api/google-place-detail", {
        placeName: trip.tripDetail?.destination,
      });
      if (result?.data) {
        setPhotoUrl(result.data);
      }
    } catch (error: unknown) {
      toast.error("Failed to fetch trip details");
      console.error("Failed to fetch trip details:", error);
    }
  }, [trip.tripDetail?.destination]);

  useEffect(() => {
    if (trip) {
      void getGooglePlaceDetail();
    }
  }, [trip, getGooglePlaceDetail]);

  return (
    <div>
      <Link
        href={`/view-trip/${trip.tripId}`}
        className="block focus:outline-none"
        aria-label={`View trip from ${trip.tripDetail.origin} to ${trip.tripDetail.destination}`}
      >
        <Image
          src={photoUrl || "/trips.png"}
          alt={`${trip.tripDetail.destination} trip preview`}
          width={550}
          height={400}
          className="rounded-xl w-full h-[250px] object-cover"
        />
        <div className="flex items-center gap-2 pt-4">
          <h2 className="font-bold">{trip.tripDetail.origin}</h2>
          <span className="text-primary" aria-hidden="true">
            <ArrowBigRightDash />
          </span>
          <h2 className="font-bold">{trip.tripDetail.destination}</h2>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <span className="text-primary" aria-hidden="true">
            <Clock />
          </span>
          <p className="text-sm text-neutral-500">
            {trip.tripDetail.duration} with the {trip.tripDetail.budget} Budget
          </p>
        </div>
      </Link>
    </div>
  );
};

export default MyTripCard;
