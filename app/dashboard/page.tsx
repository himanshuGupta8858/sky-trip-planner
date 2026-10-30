"use client"
import React, { useEffect, useState } from 'react';
import { useUserDetail } from '../provider';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Plane, Hotel, MapPin, DollarSign, Compass, ArrowLeft, BarChart3, PieChart, CheckCircle2 } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';

// Haversine formula to compute distance in km
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

const parsePrice = (priceStr: any): number => {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
};

const getCountry = (destination: string) => {
    if (!destination) return 'Unknown';
    const parts = destination.split(',');
    return parts[parts.length - 1].trim();
};

const getCity = (destination: string) => {
    if (!destination) return 'Unknown';
    return destination.split(',')[0].trim();
};

const calculateTripDistance = (trip: any): number => {
    let total = 0;
    const itinerary = trip.itinerary || [];
    const hotel = trip.hotels?.[0];
    const hotelLat = hotel?.geo_coordinates?.latitude;
    const hotelLng = hotel?.geo_coordinates?.longitude;
    
    let lastLat = hotelLat;
    let lastLng = hotelLng;

    itinerary.forEach((day: any) => {
        (day.activities || []).forEach((act: any) => {
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
        const days = parseInt(trip.duration) || 3;
        total = days * 45;
    }
    return Math.round(total);
};

const calculateTripCost = (trip: any): number => {
    const days = parseInt(trip.duration) || 1;
    
    // Average hotel cost (since user will choose one hotel recommendation)
    const hotelCount = trip.hotels?.length || 0;
    const totalHotelPrice = trip.hotels?.reduce((sum: number, hotel: any) => {
        return sum + parsePrice(hotel.price_per_night);
    }, 0) || 0;
    
    const avgHotelPrice = hotelCount > 0 ? (totalHotelPrice / hotelCount) : 0;
    const hotelCost = avgHotelPrice * days;

    const activitiesCost = trip.itinerary?.reduce((daySum: number, day: any) => {
        return daySum + (day.activities?.reduce((actSum: number, act: any) => {
            return actSum + parsePrice(act.ticket_pricing);
        }, 0) || 0);
    }, 0) || 0;

    return Math.round(hotelCost + activitiesCost);
};

const AnalyticsDashboard = () => {
    const { userDetail } = useUserDetail();
    const convex = useConvex();
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userDetail) {
            GetTrips();
        }
    }, [userDetail]);

    const GetTrips = async () => {
        try {
            const result = await convex.query(api.tripDetail.getTripDetail, { uid: userDetail._id });
            setTrips(result || []);
        } catch (err) {
            console.error("Failed to load user trips:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
                <div className="flex flex-col items-center gap-2">
                    <span className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm font-semibold text-neutral-500">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    // Compute Metrics
    const totalTripsCount = trips.length;
    const completedTrips = trips.filter(t => t.completed);
    const completedCount = completedTrips.length;

    // Collect Unique Countries
    const uniqueCountries = new Set<string>();
    const uniqueCities = new Set<string>();
    let totalDistance = 0;
    let totalSpent = 0;
    let totalHotelsBooked = 0;
    let estimatedFlights = 0;

    // Budget Distribution
    let lowBudgetCount = 0;
    let medBudgetCount = 0;
    let highBudgetCount = 0;

    // Cost per trip array (for bar chart)
    const tripCosts: { label: string; value: number }[] = [];
    // Distance over time (for line chart)
    let cumulativeDistance = 0;
    const distanceTimeline: { label: string; value: number }[] = [];

    trips.forEach((tripRecord) => {
        const details = tripRecord.tripDetail;
        if (!details) return;

        // Cities & Countries
        const dest = details.destination || '';
        uniqueCities.add(getCity(dest));
        uniqueCountries.add(getCountry(dest));

        // Hotels count
        totalHotelsBooked += details.hotels?.length || 0;

        // Budget breakdown
        const b = details.budget?.toLowerCase() || '';
        if (b.includes('low')) lowBudgetCount++;
        else if (b.includes('med')) medBudgetCount++;
        else highBudgetCount++;

        // Distance & Cost
        const dist = calculateTripDistance(details);
        totalDistance += dist;
        cumulativeDistance += dist;
        distanceTimeline.push({ label: getCity(dest), value: cumulativeDistance });

        const cost = calculateTripCost(details);
        totalSpent += cost;
        tripCosts.push({ label: getCity(dest), value: cost });

        // Estimated Flights: if origin country != destination country
        const origCountry = getCountry(details.origin || '');
        const destCountry = getCountry(dest);
        if (origCountry !== destCountry) {
            estimatedFlights += 2; // Roundtrip flight
        }
    });

    const countriesCount = uniqueCountries.size;
    const citiesCount = uniqueCities.size;

    // 1. Doughnut Chart Logic (Budget Distribution)
    const totalBudgets = lowBudgetCount + medBudgetCount + highBudgetCount || 1;
    const lowPct = (lowBudgetCount / totalBudgets) * 100;
    const medPct = (medBudgetCount / totalBudgets) * 100;
    const highPct = (highBudgetCount / totalBudgets) * 100;

    // SVG Doughnut Calculation
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const lowStroke = (lowPct / 100) * circumference;
    const medStroke = (medPct / 100) * circumference;
    const highStroke = (highPct / 100) * circumference;

    // 2. Bar Chart Scaling (Max Cost)
    const maxCost = Math.max(...tripCosts.map(c => c.value), 1000);

    // 3. Line Chart Scaling (Cumulative Distance)
    const maxDistance = cumulativeDistance || 1000;

    return (
        <div className="min-h-screen w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-neutral-100 dark:border-neutral-900">
                    <div className="space-y-1">
                        <Link href="/my-trips" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-primary transition-colors mb-2 group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            <span>Back to Trips</span>
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-950 dark:text-white">Travel Analytics</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Detailed summary and statistics of your global explorations.</p>
                    </div>

                    <Link href="/create-new-trip">
                        <ShimmerButton className="h-12 px-6 rounded-xl shadow-lg font-bold text-sm">
                            Plan Next Adventure
                        </ShimmerButton>
                    </Link>
                </div>

                {totalTripsCount === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                        <Compass className="w-16 h-16 text-primary mb-4 animate-pulse" />
                        <h2 className="text-2xl font-bold mb-2">No travel logs found</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mb-6 text-xs leading-relaxed">
                            Start planning trips with SkyTrip to build your travel map and view personalized statistics here.
                        </p>
                        <Link href="/create-new-trip">
                            <ShimmerButton className="h-12 px-6 text-xs font-bold">
                                Start Planning Now
                            </ShimmerButton>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Summary Cards Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            
                            {/* Card 1: Trips */}
                            <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Trips</span>
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <Compass className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl md:text-3xl font-black leading-none">{totalTripsCount}</h3>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>{completedCount} Completed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Countries */}
                            <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Countries</span>
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl md:text-3xl font-black leading-none">{countriesCount}</h3>
                                    <p className="text-[10px] font-medium text-neutral-400 mt-1">{citiesCount} Unique Cities</p>
                                </div>
                            </div>

                            {/* Card 3: Distance */}
                            <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Distance</span>
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                                        <Plane className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl md:text-3xl font-black leading-none">{totalDistance.toLocaleString()} <span className="text-xs font-normal">km</span></h3>
                                    <p className="text-[10px] font-medium text-neutral-400 mt-1">Est. {estimatedFlights} Flights taken</p>
                                </div>
                            </div>

                            {/* Card 4: Money Spent */}
                            <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Est. Cost</span>
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl md:text-3xl font-black leading-none">₹{totalSpent.toLocaleString()}</h3>
                                    <p className="text-[10px] font-medium text-neutral-400 mt-1">{totalHotelsBooked} Hotels booked</p>
                                </div>
                            </div>

                        </div>

                        {/* Charts Area Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Chart Card 1: Budget Doughnut */}
                            <div className="bg-white dark:bg-neutral-900/25 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-sm space-y-6">
                                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                                    <PieChart className="w-4.5 h-4.5 text-primary" />
                                    <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Budget Choices</h3>
                                </div>
                                
                                <div className="flex justify-center items-center relative py-6">
                                    <svg className="w-44 h-44" viewBox="0 0 100 100">
                                        <circle 
                                            cx="50" cy="50" r={radius} 
                                            fill="transparent" stroke="rgba(200,200,200,0.1)" strokeWidth="10" 
                                        />
                                        {/* High segment */}
                                        {highPct > 0 && (
                                            <circle 
                                                cx="50" cy="50" r={radius} 
                                                fill="transparent" stroke="#E11D48" strokeWidth="10" 
                                                strokeDasharray={`${highStroke} ${circumference}`}
                                                strokeDashoffset="0"
                                                transform="rotate(-90 50 50)"
                                            />
                                        )}
                                        {/* Med segment */}
                                        {medPct > 0 && (
                                            <circle 
                                                cx="50" cy="50" r={radius} 
                                                fill="transparent" stroke="#3B82F6" strokeWidth="10" 
                                                strokeDasharray={`${medStroke} ${circumference}`}
                                                strokeDashoffset={`-${highStroke}`}
                                                transform="rotate(-90 50 50)"
                                            />
                                        )}
                                        {/* Low segment */}
                                        {lowPct > 0 && (
                                            <circle 
                                                cx="50" cy="50" r={radius} 
                                                fill="transparent" stroke="#10B981" strokeWidth="10" 
                                                strokeDasharray={`${lowStroke} ${circumference}`}
                                                strokeDashoffset={`-${highStroke + medStroke}`}
                                                transform="rotate(-90 50 50)"
                                            />
                                        )}
                                    </svg>
                                    <div className="absolute flex flex-col items-center justify-center text-center">
                                        <span className="text-2xl font-black text-neutral-900 dark:text-white leading-none">{totalBudgets}</span>
                                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Budgets</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-2.5 rounded-xl border border-emerald-100/30">
                                        <span className="block w-2.5 h-2.5 bg-emerald-500 rounded-full mx-auto mb-1.5" />
                                        <span className="text-neutral-400 block font-medium text-[9px] uppercase">Low</span>
                                        <span className="font-extrabold text-neutral-800 dark:text-neutral-100">{lowBudgetCount}</span>
                                    </div>
                                    <div className="bg-blue-50/50 dark:bg-blue-950/10 p-2.5 rounded-xl border border-blue-100/30">
                                        <span className="block w-2.5 h-2.5 bg-blue-500 rounded-full mx-auto mb-1.5" />
                                        <span className="text-neutral-400 block font-medium text-[9px] uppercase">Med</span>
                                        <span className="font-extrabold text-neutral-800 dark:text-neutral-100">{medBudgetCount}</span>
                                    </div>
                                    <div className="bg-rose-50/50 dark:bg-rose-950/10 p-2.5 rounded-xl border border-rose-100/30">
                                        <span className="block w-2.5 h-2.5 bg-primary rounded-full mx-auto mb-1.5" />
                                        <span className="text-neutral-400 block font-medium text-[9px] uppercase">High</span>
                                        <span className="font-extrabold text-neutral-800 dark:text-neutral-100">{highBudgetCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Card 2: Spending Bar Chart */}
                            <div className="bg-white dark:bg-neutral-900/25 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-sm space-y-6 lg:col-span-2">
                                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                                    <BarChart3 className="w-4.5 h-4.5 text-primary" />
                                    <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Trip Cost Comparison (Estimated)</h3>
                                </div>

                                <div className="h-56 w-full flex items-end justify-around pt-8 pb-3 relative">
                                    {/* Horizontal Guidelines */}
                                    <div className="absolute inset-x-0 top-8 border-t border-dashed border-neutral-100 dark:border-neutral-800/80 pointer-events-none" />
                                    <div className="absolute inset-x-0 top-[60%] border-t border-dashed border-neutral-100 dark:border-neutral-800/80 pointer-events-none" />

                                    {tripCosts.map((item, idx) => {
                                        const pct = (item.value / maxCost) * 100;
                                        return (
                                            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group max-w-[80px] w-full relative">
                                                {/* Tooltip on Hover */}
                                                <div className="absolute bottom-[105%] bg-neutral-950 text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md whitespace-nowrap z-10">
                                                    ₹{item.value.toLocaleString()}
                                                </div>

                                                <div 
                                                    style={{ height: `${Math.max(pct, 4)}%` }} 
                                                    className="w-8 md:w-10 bg-gradient-to-t from-primary/60 to-primary rounded-t-lg transition-all duration-500 group-hover:opacity-90 cursor-pointer shadow-sm shadow-primary/10"
                                                />
                                                <span className="text-[10px] font-extrabold text-neutral-500 dark:text-neutral-400 text-center truncate max-w-full leading-tight">
                                                    {item.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* Chart Card 3: Distance Traveled Line Chart */}
                        <div className="bg-white dark:bg-neutral-900/25 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                                <Plane className="w-4.5 h-4.5 text-primary" />
                                <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Cumulative Distance Traveled (km)</h3>
                            </div>

                            <div className="h-56 w-full relative pt-8 pb-4">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="distanceGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Line Grid */}
                                    <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(200,200,200,0.15)" strokeWidth="0.5" strokeDasharray="2" />
                                    <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(200,200,200,0.15)" strokeWidth="0.5" strokeDasharray="2" />
                                    <line x1="0" y1="90" x2="100" y2="90" stroke="rgba(200,200,200,0.15)" strokeWidth="0.5" strokeDasharray="2" />

                                    {/* Smooth Polyline area & path */}
                                    {distanceTimeline.length > 0 && (() => {
                                        const count = distanceTimeline.length;
                                        // Generate coords
                                        const points = distanceTimeline.map((item, idx) => {
                                            const x = count > 1 ? (idx / (count - 1)) * 100 : 50;
                                            const y = 90 - (item.value / maxDistance) * 80;
                                            return { x, y };
                                        });

                                        const pathString = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                        const areaString = `${pathString} L ${points[points.length - 1].x} 90 L ${points[0].x} 90 Z`;

                                        return (
                                            <>
                                                {/* Area under the curve */}
                                                <path d={areaString} fill="url(#distanceGrad)" />
                                                {/* Line path */}
                                                <path d={pathString} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                                                {/* Circles for data points */}
                                                {points.map((p, i) => (
                                                    <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#3B82F6" stroke="white" strokeWidth="0.5" />
                                                ))}
                                            </>
                                        );
                                    })()}
                                </svg>
                                
                                {/* Labels under the chart */}
                                <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[9px] font-bold text-neutral-400">
                                    {distanceTimeline.map((item, idx) => (
                                        <span key={idx}>{item.label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default AnalyticsDashboard;
