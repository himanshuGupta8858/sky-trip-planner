"use client";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { TripRecord } from "@/types/trip";
import { useConvex } from "convex/react";
import { Map, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useUserDetail } from "../provider";
import MyTripCard from "./_components/MyTripCard";

const MyTripsPage = () => {
  const [myTrips, setMyTrips] = useState<TripRecord[]>([]);
  const { userDetail } = useUserDetail();
  const convex = useConvex();

  const getUserTrips = useCallback(async () => {
    if (!userDetail?._id) return;
    const result = await convex.query(api.tripDetail.getTripDetail, {
      uid: userDetail._id as Id<"UserTable">,
    });
    setMyTrips((result || []) as TripRecord[]);
  }, [convex, userDetail?._id]);

  useEffect(() => {
    if (userDetail) {
      void getUserTrips();
    }
  }, [userDetail, getUserTrips]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:px-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">My Trips</h1>
          </div>
          {myTrips.length > 0 && (
            <Link href="/create-new-trip">
              <ShimmerButton className="h-12 px-6 flex items-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-5 h-5" aria-hidden="true" />
                <span className="font-semibold">New Trip</span>
              </ShimmerButton>
            </Link>
          )}
        </div>

        {myTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-28 h-[60vh] text-center rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-full shadow-lg mb-6">
              <Map className="w-16 h-16 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">No trips planned yet</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mb-8 leading-relaxed">
              It looks like you haven&apos;t created any trips yet. Start your journey by planning your next adventure with our AI assistant.
            </p>
            <Link href="/create-new-trip">
              <ShimmerButton className="h-14 px-8 text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                Start Planning Now
              </ShimmerButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myTrips.map((trip) => (
              <div
                key={trip._id || trip.tripId}
                className="hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl rounded-xl p-4"
              >
                <MyTripCard trip={trip} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTripsPage;
