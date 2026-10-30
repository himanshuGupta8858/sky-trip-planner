"use client";
import { GoogleMap, Marker, Polyline, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
import { Utensils, DollarSign, Heart, Train, Zap, Fuel, ShoppingBag, Droplet } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '450px',
    borderRadius: '16px'
};

const LIBRARIES: any = ["places"];

const CATEGORIES = [
    { id: 'restaurant', name: 'Restaurants', icon: Utensils, type: 'restaurant' },
    { id: 'atm', name: 'ATMs', icon: DollarSign, type: 'atm' },
    { id: 'hospital', name: 'Hospitals', icon: Heart, type: 'hospital' },
    { id: 'metro', name: 'Metro', icon: Train, type: 'subway_station' },
    { id: 'charging', name: 'EV Charging', icon: Zap, keyword: 'electric_vehicle_charging_station' },
    { id: 'fuel', name: 'Fuel', icon: Fuel, type: 'gas_station' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, type: 'shopping_mall' },
    { id: 'washroom', name: 'Washrooms', icon: Droplet, keyword: 'public restroom' }
];

const GlobalMap = ({ trip, activeDay }: { trip: any, activeDay: number | null }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "",
        libraries: LIBRARIES
    });

    const [map, setMap] = useState<any | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
    const [selectedNearbyPlace, setSelectedNearbyPlace] = useState<any | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const onLoad = useCallback(function callback(map: any) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: any) {
        setMap(null);
    }, []);

    // Set map bounds dynamically based on activeDay
    useEffect(() => {
        if (!map || !(window as any).google || !trip) return;
        const google = (window as any).google;
        const bounds = new google.maps.LatLngBounds();

        if (activeDay) {
            const dayData = trip.itinerary?.find((item: any) => item.day === activeDay);
            let hasPoints = false;

            // Include first hotel in bounds
            const hotel = trip.hotels?.[0];
            if (hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
                bounds.extend({
                    lat: hotel.geo_coordinates.latitude,
                    lng: hotel.geo_coordinates.longitude
                });
                hasPoints = true;
            }

            // Include current day's activities in bounds
            dayData?.activities?.forEach((activity: any) => {
                if (activity?.geo_coordinates?.latitude && activity?.geo_coordinates?.longitude) {
                    bounds.extend({
                        lat: activity.geo_coordinates.latitude,
                        lng: activity.geo_coordinates.longitude
                    });
                    hasPoints = true;
                }
            });

            if (hasPoints) {
                map.fitBounds(bounds);
                // Set custom zoom offset to prevent maps from getting too close
                const listener = google.maps.event.addListener(map, 'bounds_changed', () => {
                    if (map.getZoom() > 15) map.setZoom(15);
                    google.maps.event.removeListener(listener);
                });
            }
        } else {
            // Overview Mode: include all hotels and activities
            let hasPoints = false;
            trip?.hotels?.forEach((hotel: any) => {
                if (hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
                    bounds.extend({
                        lat: hotel.geo_coordinates.latitude,
                        lng: hotel.geo_coordinates.longitude
                    });
                    hasPoints = true;
                }
            });

            trip?.itinerary?.forEach((item: any) => {
                item.activities?.forEach((activity: any) => {
                    if (activity?.geo_coordinates?.latitude && activity?.geo_coordinates?.longitude) {
                        bounds.extend({
                            lat: activity.geo_coordinates.latitude,
                            lng: activity.geo_coordinates.longitude
                        });
                        hasPoints = true;
                    }
                });
            });

            if (hasPoints) {
                map.fitBounds(bounds);
            }
        }
    }, [activeDay, map, trip]);

    // Handle searching for nearby places
    const searchNearby = useCallback((categoryId: string) => {
        if (!map || !(window as any).google || !trip) return;

        const category = CATEGORIES.find(c => c.id === categoryId);
        if (!category) return;

        setIsSearching(true);
        setSelectedNearbyPlace(null);

        try {
            const google = (window as any).google;
            // 1. Try modern Places API (New) if available on client
            if (google?.maps?.places?.Place && typeof google.maps.places.Place.searchNearby === 'function') {
                const newSearchReq: any = {
                    fields: ['displayName', 'location', 'rating', 'formattedAddress'],
                    locationRestriction: {
                        center: { lat, lng },
                        radius: 2000,
                    },
                    maxResultCount: 15,
                };
                if (category.type) {
                    newSearchReq.includedPrimaryTypes = [category.type];
                }

                google.maps.places.Place.searchNearby(newSearchReq)
                    .then(({ places }: any) => {
                        setIsSearching(false);
                        if (places && places.length > 0) {
                            const formatted = places.map((p: any) => ({
                                name: typeof p.displayName === 'string' ? p.displayName : p.displayName?.text || 'Nearby Place',
                                geometry: { location: p.location },
                                rating: p.rating,
                                vicinity: p.formattedAddress
                            }));
                            setNearbyPlaces(formatted);
                        } else {
                            setNearbyPlaces([]);
                        }
                    })
                    .catch((err: any) => {
                        console.warn("Places API (New) nearby search notice:", err?.message || err);
                        setIsSearching(false);
                        setNearbyPlaces([]);
                    });
                return;
            }

            // 2. Fallback to classic PlacesService if available
            if (!google?.maps?.places?.PlacesService) {
                setIsSearching(false);
                return;
            }

            const service = new google.maps.places.PlacesService(map);
            const searchLocation = new google.maps.LatLng(lat, lng);
            const searchRequest: any = {
                location: searchLocation,
                radius: 2000 // 2 km radius
            };

            if (category.type) {
                searchRequest.type = category.type;
            } else if (category.keyword) {
                searchRequest.keyword = category.keyword;
            }

            service.nearbySearch(searchRequest, (results: any, status: any) => {
                setIsSearching(false);
                if (status === google.maps.places.PlacesServiceStatus?.OK && results) {
                    setNearbyPlaces(results);
                } else {
                    setNearbyPlaces([]);
                }
            });
        } catch (err) {
            console.warn("Places nearby search warning:", err);
            setIsSearching(false);
        }
    }, [map, trip, activeDay]);

    // Trigger nearby search whenever day or active category shifts
    useEffect(() => {
        if (selectedCategory) {
            searchNearby(selectedCategory);
        } else {
            setNearbyPlaces([]);
            setSelectedNearbyPlace(null);
        }
    }, [activeDay, trip, selectedCategory, searchNearby]);

    const handleCategoryClick = (categoryId: string) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(categoryId);
        }
    };

    // Calculate Polyline route path coordinates
    const getRouteCoordinates = () => {
        if (!trip || !activeDay) return [];
        
        const dayData = trip.itinerary?.find((item: any) => item.day === activeDay);
        if (!dayData || !dayData.activities) return [];

        const coords: { lat: number; lng: number }[] = [];

        // Start at hotel
        const hotel = trip.hotels?.[0];
        if (hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
            coords.push({
                lat: hotel.geo_coordinates.latitude,
                lng: hotel.geo_coordinates.longitude
            });
        }

        // Add activities in order
        dayData.activities.forEach((activity: any) => {
            if (activity?.geo_coordinates?.latitude && activity?.geo_coordinates?.longitude) {
                coords.push({
                    lat: activity.geo_coordinates.latitude,
                    lng: activity.geo_coordinates.longitude
                });
            }
        });

        // Loop back to hotel
        if (coords.length > 1 && hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
            coords.push({
                lat: hotel.geo_coordinates.latitude,
                lng: hotel.geo_coordinates.longitude
            });
        }

        return coords;
    };

    if (!isLoaded) return <div className="p-10 text-center text-neutral-500">Loading Map...</div>;
    if (!trip) return null;

    return (
        <div className="flex flex-col h-full w-full">
            {/* Category Selectors Bar */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-print scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                {CATEGORIES.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = selectedCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                isSelected
                                    ? 'bg-primary border-primary text-white shadow-sm hover:bg-opacity-95'
                                    : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }`}
                        >
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{category.name}</span>
                            {isSelected && isSearching && (
                                <span className="w-2 h-2 rounded-full border border-white border-t-transparent animate-spin ml-0.5" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md h-[450px] w-full">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        mapId: "DEMO_MAP_ID",
                        gestureHandling: "cooperative"
                    }}
                >
                    {/* Hotel Markers */}
                    {trip?.hotels?.map((hotel: any, index: number) => {
                        if (activeDay && index > 0) return null; // Show only primary hotel in day view
                        return hotel?.geo_coordinates && (
                            <Marker
                                key={`hotel-${index}`}
                                position={{
                                    lat: hotel.geo_coordinates.latitude,
                                    lng: hotel.geo_coordinates.longitude
                                }}
                                label={{
                                    text: "🏨",
                                    fontSize: "14px"
                                }}
                                title={hotel.hotel_name}
                            />
                        );
                    })}

                    {/* Activity Markers */}
                    {trip?.itinerary?.map((item: any) => {
                        if (activeDay && item.day !== activeDay) return null; // Hide other days' activities
                        return item.activities?.map((activity: any, index: number) => (
                            activity?.geo_coordinates && (
                                <Marker
                                    key={`activity-${item.day}-${index}`}
                                    position={{
                                        lat: activity.geo_coordinates.latitude,
                                        lng: activity.geo_coordinates.longitude
                                    }}
                                    label={{
                                        text: `${index + 1}`,
                                        color: "white",
                                        fontWeight: "bold"
                                    }}
                                    title={activity.place_name}
                                />
                            )
                        ));
                    })}

                    {/* Polyline Route */}
                    {activeDay && (
                        <Polyline
                            path={getRouteCoordinates()}
                            options={{
                                strokeColor: "#E11D48", // Theme Rose-600 / primary highlight
                                strokeOpacity: 0.9,
                                strokeWeight: 4,
                                geodesic: true,
                                icons: typeof window !== 'undefined' && (window as any).google?.maps?.SymbolPath ? [{
                                    icon: {
                                        path: (window as any).google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW
                                    },
                                    offset: '100px',
                                    repeat: '100px'
                                }] : undefined
                            }}
                        />
                    )}

                    {/* Nearby Places Markers */}
                    {selectedCategory && nearbyPlaces.map((place: any) => {
                        const placeLat = place.geometry?.location?.lat;
                        const placeLng = place.geometry?.location?.lng;
                        
                        // Check if lat/lng are functions or numbers
                        const lat = typeof placeLat === 'function' ? placeLat() : placeLat;
                        const lng = typeof placeLng === 'function' ? placeLng() : placeLng;

                        if (!lat || !lng) return null;

                        return (
                            <Marker
                                key={`nearby-${place.place_id}`}
                                position={{ lat, lng }}
                                title={place.name}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                }}
                                onClick={() => setSelectedNearbyPlace(place)}
                            />
                        );
                    })}

                    {/* InfoWindow for Selected Nearby Place */}
                    {selectedNearbyPlace && (() => {
                        const placeLat = selectedNearbyPlace.geometry?.location?.lat;
                        const placeLng = selectedNearbyPlace.geometry?.location?.lng;
                        const lat = typeof placeLat === 'function' ? placeLat() : placeLat;
                        const lng = typeof placeLng === 'function' ? placeLng() : placeLng;

                        return lat && lng && (
                            <InfoWindow
                                position={{ lat, lng }}
                                onCloseClick={() => setSelectedNearbyPlace(null)}
                            >
                                <div className="p-2 text-neutral-900 font-sans max-w-[200px]">
                                    <h4 className="font-bold text-xs mb-1 leading-tight">{selectedNearbyPlace.name}</h4>
                                    <p className="text-[10px] text-neutral-600 mb-1 leading-normal">{selectedNearbyPlace.vicinity}</p>
                                    {selectedNearbyPlace.rating && (
                                        <div className="flex items-center gap-1 text-[10px] mb-1.5">
                                            <span className="text-yellow-600 font-bold">★ {selectedNearbyPlace.rating}</span>
                                            <span className="text-neutral-400">({selectedNearbyPlace.user_ratings_total})</span>
                                        </div>
                                    )}
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedNearbyPlace.name + " " + selectedNearbyPlace.vicinity)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-bold text-red-500 hover:underline inline-flex items-center gap-0.5 mt-1 cursor-pointer"
                                    >
                                        View Directions ➔
                                    </a>
                                </div>
                            </InfoWindow>
                        );
                    })()}
                </GoogleMap>
            </div>
        </div>
    );
}

export default GlobalMap;