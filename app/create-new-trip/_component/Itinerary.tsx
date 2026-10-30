
"use client";
import { useTripDetail } from "@/app/provider";
import { Timeline } from "@/components/ui/timeline";
import axios from "axios";
import { ArrowLeft, Clock, ExternalLink, MapPin, Star, Ticket, Wallet } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";
import { TripInfo } from "./chatbox";
import HotelCard from "./HotelCard";
import { ShareExport } from "./TripTools";

// const TRIP_DATA = {
//     budget: "Low",
//     origin: "Delhi",
//     destination: "Mumbai",
//     duration: "5 Days",
//     hotels: [
//         {
//             description:
//                 "Budget-friendly hotel with clean rooms, located close to Dadar Station.",
//             geo_coordinates: {
//                 latitude: 19.013,
//                 longitude: 72.847,
//             },
//             hotel_address:
//                 "Next to Dadar Station, Dadar East, Mumbai",
//             hotel_image_url:
//                 "https://google.com/hotel-surestay.jpg",
//             hotel_name: "Hotel SureStay",
//             price_per_night: "$30",
//             rating: 4,
//         },
//         {
//             description:
//                 "Comfortable stay with in-house dining, located near popular shopping areas.",
//             geo_coordinates: {
//                 latitude: 19.006,
//                 longitude: 72.8288,
//             },
//             hotel_address: "Near Atria Mall, Worli, Mumbai",
//             hotel_image_url:
//                 "https://google.com/residency-hotel.jpg",
//             hotel_name: "Residency Hotel",
//             price_per_night: "$40",
//             rating: 4.5,
//         },
//         {
//             description:
//                 "Ideal for travelers, close to the airport with easy access to local eateries.",
//             geo_coordinates: {
//                 latitude: 19.0998,
//                 longitude: 72.876,
//             },
//             hotel_address:
//                 "Near Mumbai Airport, Andheri East, Mumbai",
//             hotel_image_url:
//                 "https://google.com/hotel-transit.jpg",
//             hotel_name: "Hotel Transit",
//             price_per_night: "$35",
//             rating: 4.2,
//         },
//     ],
//     itinerary: [
//         {
//             activities: [
//                 {
//                     best_time_to_visit: "Evening",
//                     geo_coordinates: {
//                         latitude: 19.103,
//                         longitude: 72.8258,
//                     },
//                     place_address: "Juhu Tara Rd, Juhu, Mumbai",
//                     place_details:
//                         "Famous beach known for its street food and vibrant atmosphere.",
//                     place_image_url:
//                         "https://google.com/juhu-beach.jpg",
//                     place_name: "Juhu Beach",
//                     ticket_pricing: "Free",
//                     time_travel_each_location: "1 hour from hotel",
//                 },
//             ],
//             best_time_to_visit_day: "Evening",
//             day: 1,
//             day_plan: "Explore street food in Juhu Beach",
//         },
//         {
//             activities: [
//                 {
//                     best_time_to_visit: "Morning",
//                     geo_coordinates: {
//                         latitude: 19.0144,
//                         longitude: 72.8266,
//                     },
//                     place_address:
//                         "Siddhivinayak Temple Rd, Prabhadevi, Mumbai",
//                     place_details:
//                         "One of the most famous Ganesh temples in Mumbai.",
//                     place_image_url:
//                         "https://google.com/siddhivinayak.jpg",
//                     place_name: "Siddhivinayak Temple",
//                     ticket_pricing: "Free",
//                     time_travel_each_location:
//                         "30 minutes from hotel",
//                 },
//                 {
//                     best_time_to_visit: "Afternoon",
//                     geo_coordinates: {
//                         latitude: 18.9634,
//                         longitude: 72.8263,
//                     },
//                     place_address: "Marine Lines, Mumbai",
//                     place_details:
//                         "Historic ice cream parlour famous for its unique ice cream sandwiches.",
//                     place_image_url:
//                         "https://google.com/k-rustoms.jpg",
//                     place_name: "K. Rustom's Ice Cream",
//                     ticket_pricing: "Approx. $2",
//                     time_travel_each_location:
//                         "15 minutes from Siddhivinayak Temple",
//                 },
//             ],
//             best_time_to_visit_day: "Morning",
//             day: 2,
//             day_plan:
//                 "Visit Siddhivinayak Temple and explore local snacks",
//         },
//         {
//             activities: [
//                 {
//                     best_time_to_visit: "Evening",
//                     geo_coordinates: {
//                         latitude: 18.9662,
//                         longitude: 72.8154,
//                     },
//                     place_address: "Chowpatty, Marine Drive, Mumbai",
//                     place_details:
//                         "Iconic beach known for its bhel puri and other local snacks.",
//                     place_image_url:
//                         "https://google.com/chowpatty.jpg",
//                     place_name: "Chowpatty Beach",
//                     ticket_pricing: "Free",
//                     time_travel_each_location:
//                         "30 minutes from hotel",
//                 },
//             ],
//             best_time_to_visit_day: "Evening",
//             day: 3,
//             day_plan:
//                 "Visit Chowpatty Beach for some evening snacks",
//         },
//         {
//             activities: [
//                 {
//                     best_time_to_visit: "Afternoon",
//                     geo_coordinates: {
//                         latitude: 18.9612,
//                         longitude: 72.8347,
//                     },
//                     place_address:
//                         "Mahatma Jyotiba Phule Marg, T. M. S. No. 84, Mumbai",
//                     place_details:
//                         "Famous market for shopping and tasting local food.",
//                     place_image_url:
//                         "https://google.com/crawford-market.jpg",
//                     place_name: "Crawford Market",
//                     ticket_pricing: "Free entry",
//                     time_travel_each_location:
//                         "45 minutes from hotel",
//                 },
//             ],
//             best_time_to_visit_day: "Afternoon",
//             day: 4,
//             day_plan:
//                 "Explore the local markets and try street food",
//         },
//         {
//             activities: [
//                 {
//                     best_time_to_visit: "Morning",
//                     geo_coordinates: {
//                         latitude: 19.0146,
//                         longitude: 72.8489,
//                     },
//                     place_address: "Dharavi, Mumbai",
//                     place_details:
//                         "One of the largest slums in Asia, known for its local food tours.",
//                     place_image_url:
//                         "https://google.com/dharavi.jpg",
//                     place_name: "Dharavi",
//                     ticket_pricing:
//                         "Approx. $10 for guided food tour",
//                     time_travel_each_location: "1 hour from hotel",
//                 },
//             ],
//             best_time_to_visit_day: "Morning",
//             day: 5,
//             day_plan:
//                 "Visit Dharavi and explore local culinary experiences",
//         },
//     ],
//     people_size: "Solo",
// }

const HotelGridItem = ({ hotel, index, setSelectedHotel }: { hotel: any, index: number, setSelectedHotel: (hotel: any) => void }) => {
    const [photoUrl, setPhotoUrl] = useState<string>();

    useEffect(() => {
        hotel && GetGooglePlaceDetail();
    }, [hotel]);

    const GetGooglePlaceDetail = async () => {
        try {
            const result = await axios.post('/api/google-place-detail', { placeName: hotel?.hotel_name });
            setPhotoUrl(result?.data);
        } catch (error: any) {
            console.error("Failed to fetch hotel details:", error);
        }
    }

    return (
        <div key={index} className="group bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300">

            <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4">
                <Image
                    src={photoUrl ? photoUrl : '/Hotel.png'}
                    alt={hotel.hotel_name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-medium">{hotel.rating}</span>
                </div>
            </div>

            <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 mb-1 line-clamp-1">{hotel.hotel_name}</h2>

            <div className="flex items-start gap-1 mb-3 text-neutral-500 dark:text-neutral-400">
                <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                <p className="text-sm line-clamp-1">{hotel.hotel_address}</p>
            </div>

            <div className="flex justify-between items-center mt-auto">
                <Wallet className="w-5 h-5 text-green-600" /> <p className="text-green-600 font-bold text-md">{hotel.price_per_night}<span className="text-xs text-neutral-400 font-normal">/night</span></p>
                <button
                    onClick={() => setSelectedHotel(hotel)}
                    className="bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                >
                    View Hotel
                </button>
            </div>
        </div>
    )
}

const ActivityGridItem = ({ activity, index, setSelectedActivity }: { activity: any, index: number, setSelectedActivity: (activity: any) => void }) => {
    const [photoUrl, setPhotoUrl] = useState<string>();

    useEffect(() => {
        activity && GetGooglePlaceDetail();
    }, [activity]);

    const GetGooglePlaceDetail = async () => {
        try {
            const result = await axios.post('/api/google-place-detail', { placeName: activity?.place_name });
            setPhotoUrl(result?.data);
        } catch (error: any) {
            console.error("Failed to fetch activity details:", error);
        }
    }

    return (
        <div
            key={index}
            className="group bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
            <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-4">
                <Image
                    src={photoUrl ? photoUrl : '/activities.png'}
                    alt={activity.place_name}
                    width={400}
                    height={200}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold">4.5</span>
                </div>
            </div>

            <div className="mb-2">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-100 leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {activity.place_name}
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{activity.place_address}</span>
                </p>
            </div>

            <div className="mt-auto space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                        <Ticket className="w-3.5 h-3.5 text-green-600" />
                        <span className="font-medium text-xs line-clamp-1">{activity.ticket_pricing}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-medium text-xs line-clamp-1">{activity.time_travel_each_location}</span>
                    </div>
                </div>

                <button
                    onClick={() => setSelectedActivity(activity)}
                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary dark:group-hover:text-white"
                >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

const Itinerary = ({ trip, activeDay, setActiveDay }: { trip?: TripInfo, activeDay?: number | null, setActiveDay?: (day: number | null) => void }) => {
    //ts-ignore
    const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
    const [tripData, setTripData] = useState<TripInfo | null>(null);
    const [selectedHotel, setSelectedHotel] = React.useState<any>(null);
    const [selectedActivity, setSelectedActivity] = React.useState<any>(null);

    useEffect(() => {
        trip && setTripData(trip);
        !trip && tripDetailInfo && setTripData(tripDetailInfo);
    }, [trip, tripDetailInfo]);

    const data = tripData ? [{
        title: "Recommended Hotels",
        content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tripData?.hotels?.map((hotel, index) => (
                    <HotelGridItem key={index} hotel={hotel} index={index} setSelectedHotel={setSelectedHotel} />
                ))}
            </div>
        ),
    },
    ...(tripData?.itinerary?.map((dayData) => ({
        title: `Day ${dayData.day}`,
        content: (
            <div className="flex flex-col gap-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Best Time
                        </span>
                        <span className="text-orange-900 dark:text-orange-100 font-semibold tracking-wide">
                            {dayData.best_time_to_visit_day}
                        </span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed font-medium">
                        {dayData.day_plan}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dayData?.activities?.map((activity, index) => (
                        <ActivityGridItem key={index} activity={activity} index={index} setSelectedActivity={setSelectedActivity} />
                    ))}
                </div>
            </div>
        ),
    })) || [])
    ] : [];

    return (
        <div className="relative w-full overflow-clip">
            {tripData ? (
                <Timeline data={data} tripData={tripData} activeDay={activeDay} setActiveDay={setActiveDay} />
            ) : (
                <div className="relative h-[80vh] w-full rounded-2xl overflow-hidden shadow-2xl group">
                    <Image
                        src="/empty.jpg"
                        alt="Start Planning"
                        fill
                        className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute bottom-12 left-0 w-full px-6 flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg animate-pulse">
                            <ArrowLeft className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-2xl">
                                Make your personalized trip
                            </h2>
                            <p className="text-lg text-neutral-200 font-medium drop-shadow-md">
                                Here with the help of SkyTrip
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-12 mb-12">
                <div className="bg-white dark:bg-black/20 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-50" />

                </div>
            </div>


            <ShareExport trip={tripData || undefined} />

            <HotelCard selectedHotel={selectedHotel} setSelectedHotel={setSelectedHotel} />
            <ActivityCard selectedActivity={selectedActivity} setSelectedActivity={setSelectedActivity} />
        </div>
    );
}
export default Itinerary