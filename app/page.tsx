"use client"
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import Footer from "./_components/footer";
import Hero from "./_components/hero";
import { PopularCityList } from "./_components/popularcityList";

export default function Home() {
  return (
    <div>
      <Hero/>
      <PopularCityList/>
      
      {/* Travel Tools CTA Section */}
      <section className="bg-gray-50/50 py-16 border-t border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full text-xs font-bold text-orange-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-orange-500/10 animate-pulse" />
            Instant Travel Assistant
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Plan Currencies & Timezones Effortlessly
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Going abroad or traveling domestically? Use our global converter tool to compute live exchange rates, compare local times, and retrieve expert AI protocols.
          </p>
          <div className="pt-2">
            <Link href="/tools/converter">
              <ShimmerButton className="h-11 px-8 text-sm font-semibold">
                Open Travel Converter →
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />  
    </div>
  );
}
