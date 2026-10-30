"use client";
import React from "react";
import TripPlannerAddon from "@/app/create-new-trip/_component/TripPlannerAddon";
import Footer from "@/app/_components/footer";
import { Sparkles, Globe, Shield, Users, Plane, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";

export default function StandaloneConverterPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 relative overflow-hidden flex flex-col items-center">
      
      {/* Premium Hero Banner Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-amber-950 via-rose-950 to-slate-900 text-white py-20 md:py-28 px-6 text-center">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80")', backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="relative max-w-4xl mx-auto z-10 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-6 text-white/90">
              <Sparkles className="w-4 h-4 text-orange-400 fill-orange-400/20" /> Built with passion for travellers
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              SkyTrip{" "}
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                Travel Toolkit
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Plan currency conversions, calculate timezone differences, and retrieve localized AI companion guidelines for any route globally — all in one conversation-connected toolkit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Container */}
      <div className="w-full max-w-4xl mx-auto px-4 py-16 relative z-10">
        
        {/* Companion Card container */}
        <div className="w-full max-w-2xl mx-auto">
          <TripPlannerAddon />
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 text-left border-t border-neutral-100 dark:border-neutral-800/80 pt-10">
          <div className="flex gap-3">
            <div className="p-2.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-xl h-fit">
              <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 text-sm">Dual City Planner</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                Easily search and configure timezone mappings and currency pairs for any two cities globally.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl h-fit">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 text-sm">AI Companion Insights</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                Retrieve custom AI tips regarding cash-vs-card usage, connectivity/eSIM options, and regional protocols.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-2.5 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 rounded-xl h-fit">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 text-sm">Offline Failsafe</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                Static conversion and timezone computations run 100% locally and instantly if you're offline or out of credits.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
