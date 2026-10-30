"use client";
import React, { useEffect, useState } from 'react';
import { TripInfo } from './chatbox';
import { AIResponse, detectLocationDetails, DEFAULT_RECOMMENDATIONS } from './TripPlannerAddon';

interface PrintTravelGuideProps {
    trip: TripInfo | undefined;
    addonData?: AIResponse | null;
}

const PrintTravelGuide: React.FC<PrintTravelGuideProps> = ({ trip, addonData }) => {
    const [liveUrl, setLiveUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLiveUrl(window.location.href);
        }
    }, []);

    if (!trip) return null;

    // Resolve origin and destination
    const localOrigin = detectLocationDetails(trip.origin || "Delhi", true);
    const localDestination = detectLocationDetails(trip.destination || "Japan", false);
    const origin = addonData?.origin || localOrigin;
    const destination = addonData?.destination || localDestination;
    const isDomestic = addonData ? addonData.isDomestic : (origin.country === destination.country);

    // Timezone difference calculation
    let offsetHoursDiff = addonData?.timezoneOffsetDifference ?? 0;
    if (!addonData) {
        try {
            const getOffset = (tz: string) => {
                const d = new Date();
                const formatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: tz,
                    timeZoneName: "longOffset"
                });
                const parts = formatter.formatToParts(d);
                const offsetString = parts.find(p => p.type === "timeZoneName")?.value || "";
                if (!offsetString || offsetString === "GMT") return 0;
                const match = offsetString.match(/GMT([+-])(\d+):?(\d*)/);
                if (!match) return 0;
                const sign = match[1] === "+" ? 1 : -1;
                const hours = parseInt(match[2]);
                const minutes = parseInt(match[3] || "0");
                return sign * (hours + minutes / 60);
            };
            offsetHoursDiff = getOffset(destination.timezone) - getOffset(origin.timezone);
        } catch {
            offsetHoursDiff = 0;
        }
    }

    const recommendations = addonData?.recommendations || DEFAULT_RECOMMENDATIONS;

    // Helper to get QR Code URL
    const getQrUrl = (data: string) => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
    };

    // Helper to get emergency contacts based on destination
    const getEmergencyContacts = () => {
        const dest = trip.destination?.toLowerCase() || '';
        if (dest.includes('india')) {
            return [
                { service: 'National Emergency', number: '112' },
                { service: 'Police', number: '100' },
                { service: 'Ambulance', number: '102' },
                { service: 'Fire Station', number: '101' },
                { service: 'Tourist Helpline', number: '1363' }
            ];
        } else if (dest.includes('usa') || dest.includes('united states') || dest.includes('america')) {
            return [
                { service: 'Emergency Dispatch', number: '911' },
                { service: 'Non-Emergency Police', number: '311' },
                { service: 'Assistance / Info', number: '211' }
            ];
        } else if (dest.includes('uk') || dest.includes('united kingdom') || dest.includes('london')) {
            return [
                { service: 'Emergency Services', number: '999' },
                { service: 'Non-Emergency Medical', number: '111' },
                { service: 'Non-Emergency Police', number: '101' }
            ];
        } else if (dest.includes('europe') || dest.includes('france') || dest.includes('germany') || dest.includes('italy') || dest.includes('spain')) {
            return [
                { service: 'European Emergency Number', number: '112' },
                { service: 'Local Police Assistance', number: '114' }
            ];
        } else {
            return [
                { service: 'Standard Emergency', number: '112' },
                { service: 'Global Tourist Help', number: '+1-202-501-4444' }
            ];
        }
    };

    return (
        <div className="font-sans text-neutral-900 bg-white p-8 max-w-4xl mx-auto">
            {/* Custom Print Style overrides to ensure A4 formatting */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 1.5cm;
                    }
                    body {
                        background-color: #ffffff !important;
                        color: #111111 !important;
                    }
                    .page-break {
                        page-break-before: always !important;
                        clear: both;
                    }
                    .no-break {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                }
            `}} />

            {/* PAGE 1: COVER PAGE */}
            <div className="print-page flex flex-col justify-between min-h-[26cm] border-4 border-double border-neutral-300 p-8 rounded-xl">
                <div className="text-center my-auto space-y-8">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-500">Official Travel Companion</p>
                    
                    <h1 className="text-5xl font-black tracking-tight text-neutral-950 mt-4 leading-tight uppercase">
                        SkyTrip Guide
                    </h1>
                    
                    <div className="w-20 h-1 bg-neutral-900 mx-auto my-6" />
                    
                    <h2 className="text-3xl font-extrabold text-neutral-800">
                        {trip.destination}
                    </h2>
                    
                    <p className="text-lg text-neutral-600 max-w-md mx-auto italic font-serif mt-2">
                        A customized travel guidebook generated specifically for your upcoming itinerary.
                    </p>

                    {/* Metadata Table */}
                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-b border-neutral-200 py-6 mt-12 text-left">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Duration</span>
                            <span className="font-bold text-neutral-800 text-sm">{trip.duration}</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Budget</span>
                            <span className="font-bold text-neutral-800 text-sm">{trip.budget}</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Travelers</span>
                            <span className="font-bold text-neutral-800 text-sm">{(trip as any).people_size || (trip as any).group_size}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-8 mt-12 bg-neutral-50 p-4 rounded-xl">
                    <div className="text-left space-y-1">
                        <h4 className="font-bold text-xs uppercase text-neutral-700 tracking-wider">Scan Live Guide</h4>
                        <p className="text-[10px] text-neutral-500 max-w-[250px]">
                            Scan this QR code to view live maps, hotel cards, and chat with your AI assistant online.
                        </p>
                    </div>
                    {liveUrl && (
                        <div className="w-20 h-20 bg-white p-1.5 border border-neutral-200 rounded-lg shadow-sm flex items-center justify-center">
                            <img src={getQrUrl(liveUrl)} alt="Live URL QR Code" className="w-full h-full" />
                        </div>
                    )}
                </div>
            </div>

            {/* PAGE 2: RECOMMENDED HOTELS */}
            <div className="page-break pt-12">
                <div className="border-b-2 border-neutral-900 pb-3 mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-wider text-neutral-950">Recommended Accommodations</h2>
                    <p className="text-xs text-neutral-500 font-medium">Selected lodging options mapped near your destination</p>
                </div>

                <div className="space-y-6">
                    {trip.hotels?.map((hotel, index) => {
                        const hotelMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotel_name + ' ' + hotel.hotel_address)}`;
                        
                        return (
                            <div key={index} className="no-break border border-neutral-200 rounded-xl p-5 flex gap-6 bg-white shadow-sm">
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-neutral-900 leading-tight">
                                            {index + 1}. {hotel.hotel_name}
                                        </h3>
                                        <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded text-xs font-bold text-yellow-700">
                                            ★ {hotel.rating}
                                        </div>
                                    </div>

                                    <p className="text-xs text-neutral-500 flex items-start gap-1">
                                        <span className="font-semibold uppercase text-neutral-400">Address:</span> {hotel.hotel_address}
                                    </p>

                                    <p className="text-xs text-neutral-600 leading-relaxed italic">
                                        "{hotel.description}"
                                    </p>

                                    <div className="flex justify-between items-center pt-2 border-t border-neutral-100 text-xs">
                                        <span className="font-semibold text-green-700">Estimated Price: {hotel.price_per_night} / night</span>
                                    </div>
                                </div>

                                <div className="w-24 flex flex-col items-center justify-center border-l border-neutral-100 pl-6 text-center space-y-1.5 flex-shrink-0">
                                    <div className="w-18 h-18 bg-neutral-50 p-1 border border-neutral-200 rounded-md">
                                        <img src={getQrUrl(hotelMapUrl)} alt="Hotel Map QR" className="w-full h-full" />
                                    </div>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider leading-none">Map Route</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PAGE 3: DAY-BY-DAY ITINERARY */}
            <div className="page-break pt-12">
                <div className="border-b-2 border-neutral-900 pb-3 mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-wider text-neutral-950">Day-by-Day Travel Plan</h2>
                    <p className="text-xs text-neutral-500 font-medium">Your customized activities, timings, and ticket estimates</p>
                </div>

                <div className="space-y-8">
                    {trip.itinerary?.map((dayData, dIndex) => (
                        <div key={dIndex} className="no-break border border-neutral-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                <h3 className="text-lg font-black text-neutral-900 uppercase tracking-wide">
                                    Day {dayData.day}: {dayData.day_plan || `Explore ${trip.destination}`}
                                </h3>
                                <span className="bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold text-orange-700 uppercase tracking-wide">
                                    ⏱ Best Time: {dayData.best_time_to_visit_day}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {dayData.activities?.map((activity: any, aIndex: number) => {
                                    const activityMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.place_name + ' ' + activity.place_address)}`;
                                    
                                    return (
                                        <div key={aIndex} className="flex gap-4 items-start bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                                            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                                                {aIndex + 1}
                                            </div>
                                            <div className="flex-1 space-y-1.5">
                                                <h4 className="font-bold text-sm text-neutral-800">{activity.place_name}</h4>
                                                <p className="text-xs text-neutral-500 leading-relaxed">{activity.place_details}</p>
                                                <p className="text-[10px] text-neutral-400 font-medium">{activity.place_address}</p>
                                                
                                                <div className="grid grid-cols-2 gap-4 pt-2 text-[10px] font-semibold text-neutral-600">
                                                    <div>🎟 Ticket: <span className="text-neutral-800">{activity.ticket_pricing}</span></div>
                                                    <div>🚗 Travel: <span className="text-neutral-800">{activity.time_travel_each_location}</span></div>
                                                </div>
                                            </div>
                                            <div className="w-16 flex flex-col items-center justify-center text-center pl-3 flex-shrink-0">
                                                <div className="w-14 h-14 bg-white p-1 border border-neutral-200 rounded-md">
                                                    <img src={getQrUrl(activityMapUrl)} alt="Activity Map QR" className="w-full h-full" />
                                                </div>
                                                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mt-1">Navigate</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PAGE 4: SMART PACKING CHECKLIST & EMERGENCY CONTACTS */}
            <div className="page-break pt-12">
                <div className="border-b-2 border-neutral-900 pb-3 mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-wider text-neutral-950">Packing List & Safety Guide</h2>
                    <p className="text-xs text-neutral-500 font-medium">Final preparations and local assistance coordinates</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Packing Checklist */}
                    <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
                        <h3 className="font-bold text-neutral-800 border-b border-neutral-100 pb-2 flex items-center gap-2">
                            🎒 Essential Packing Items
                        </h3>
                        <ul className="space-y-3">
                            {['Passport & Tickets', 'Local Cash & Cards', 'Medications & Prescriptions', 'Phone & Charger', 'Power Bank / Adapters', 'Toiletries & Personal Care', 'Comfortable Shoes', 'Climate Appropriate Clothing'].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-xs text-neutral-600 font-medium">
                                    <div className="w-4 h-4 rounded border border-neutral-300 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Safety Contacts */}
                    <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="space-y-4">
                            <h3 className="font-bold text-neutral-800 border-b border-neutral-100 pb-2">
                                📞 Local Emergency Contacts
                            </h3>
                            <div className="space-y-2">
                                {getEmergencyContacts().map((contact, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs border-b border-neutral-50 pb-1.5 last:border-0 last:pb-0">
                                        <span className="text-neutral-500 font-medium">{contact.service}</span>
                                        <span className="font-bold text-neutral-950 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">{contact.number}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                            <h4 className="font-bold text-xs text-yellow-800 mb-1">⚠️ Travel Advisory</h4>
                            <p className="text-[10px] text-yellow-700 leading-relaxed font-medium">
                                Always keep your physical passport and printed guide in a secure, dry place. Scan the Cover QR code on page 1 to immediately access support and route changes on your smartphone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGE 5: AI COMPANION RECOMMENDATIONS */}
            {recommendations && recommendations.length > 0 && (
                <div className="page-break pt-12">
                    <div className="border-b-2 border-neutral-900 pb-3 mb-6">
                        <h2 className="text-2xl font-black uppercase tracking-wider text-neutral-950">AI Companion Guide</h2>
                        <p className="text-xs text-neutral-500 font-medium">Localized currency, timezone, and protocol recommendations for {destination.city}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 flex flex-col justify-center text-center">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider mb-1">Currency Info</span>
                            <span className="font-extrabold text-neutral-800 text-sm">
                                {origin.flag} {origin.currencyCode} ({origin.currencySymbol}) → {destination.flag} {destination.currencyCode} ({destination.currencySymbol})
                            </span>
                        </div>
                        <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 flex flex-col justify-center text-center">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider mb-1">Timezone Offset</span>
                            <span className="font-extrabold text-neutral-800 text-sm">
                                {isDomestic && offsetHoursDiff === 0 
                                  ? "Same Timezone" 
                                  : `${Math.abs(offsetHoursDiff)}h ${offsetHoursDiff > 0 ? 'ahead' : 'behind'}`
                                }
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {recommendations.map((rec: any, idx: number) => (
                            <div key={idx} className="no-break border border-neutral-200 rounded-xl p-5 bg-white shadow-sm space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full inline-block">
                                    {rec.category}
                                </span>
                                <h3 className="font-bold text-neutral-900 text-sm">{rec.title}</h3>
                                <p className="text-xs text-neutral-600 leading-relaxed">{rec.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrintTravelGuide;
