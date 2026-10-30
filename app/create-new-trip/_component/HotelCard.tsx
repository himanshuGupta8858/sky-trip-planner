"use client"

import axios from "axios";
import { ExternalLink, MapPin, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


interface HotelCardProps {
    selectedHotel: any;
    setSelectedHotel: (hotel: any) => void;
}

const HotelCard = ({ selectedHotel, setSelectedHotel }: HotelCardProps) => {

    const [photoUrl, setPhotoUrl] = useState<string>();

    useEffect(() => {
        selectedHotel && GetGooglePlaceDetail();
    }, [selectedHotel])

    const GetGooglePlaceDetail = async () => {
        try {
            const result = await axios.post('/api/google-place-detail', { placeName: selectedHotel?.hotel_name });
            setPhotoUrl(result?.data);
        } catch (error: any) {
            console.error("Failed to fetch hotel details:", error);
        }
    }

    const extractCity = (address: string): string => {
        if (!address) return '';
        const cities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Srinagar', 'Jaipur', 'Goa', 'Agra', 
            'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Manali', 'Shimla', 'Udaipur', 'Kochi', 
            'Ooty', 'Munnar', 'Varanasi', 'Amritsar', 'Jaisalmer', 'Jodhpur', 'Rishikesh'
        ];
        for (const city of cities) {
            if (address.toLowerCase().includes(city.toLowerCase())) return city;
        }

        const parts = address.split(',').map(p => p.trim());
        const ignoredWords = ['india', 'usa', 'united states', 'uk', 'united kingdom', 'vietnam', 'thailand', 'singapore', 'malaysia', 'indonesia'];
        
        for (let i = parts.length - 1; i >= 0; i--) {
            const part = parts[i];
            if (/\d/.test(part)) continue;
            if (ignoredWords.includes(part.toLowerCase())) continue;
            return part;
        }
        return '';
    }

    const handleBookNow = (hotel: any) => {
        const hotelName = hotel.hotel_name || '';
        const city = extractCity(hotel.hotel_address);
        const query = `site:makemytrip.com/hotels/ "${hotelName}" ${city}`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    }

    return (
        <div>
            {selectedHotel && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedHotel(null)}
                >
                    <div
                        className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-neutral-200 dark:border-neutral-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-64 w-full">
                            <Image
                                src={photoUrl ? photoUrl : '/Hotel.png'}
                                alt={selectedHotel.hotel_name}
                                fill
                                className="object-cover"
                            />
                            <button
                                onClick={() => setSelectedHotel(null)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <div>
                                    <h2 className="text-white font-bold text-2xl drop-shadow-md">{selectedHotel.hotel_name}</h2>
                                    <div className="flex items-center gap-2 text-white/90 drop-shadow-md">
                                        <MapPin className="w-4 h-4" />
                                        <p className="text-sm font-medium truncate max-w-[200px]">{selectedHotel.hotel_address}</p>
                                    </div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-white font-bold">{selectedHotel.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-wide uppercase font-semibold">Price per night</p>
                                    <p className="text-3xl font-bold text-primary">{selectedHotel.price_per_night}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 tracking-wide uppercase font-semibold text-right">Coordinates</p>
                                    <p className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-600 dark:text-neutral-300">
                                        {selectedHotel.geo_coordinates.latitude.toFixed(4)}, {selectedHotel.geo_coordinates.longitude.toFixed(4)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">About this place</h3>
                                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">
                                    {selectedHotel.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-neutral-800 dark:border-neutral-800">
                                <p className="text-md text-center text-neutral-800">
                                    Address: {selectedHotel.hotel_address}
                                </p>
                            </div>
                            <Link href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(selectedHotel?.hotel_name + "," + selectedHotel?.hotel_address)} target="_blank"><button className="bg-primary dark:bg-white text-white dark:text-black px-5 py-2 mt-4 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity w-full flex items-center justify-center gap-2">View on Map <ExternalLink /></button></Link>
                            <button
                                onClick={() => handleBookNow(selectedHotel)}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg mt-2 transition-colors"
                            >
                                Book Now on MakeMyTrip
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HotelCard