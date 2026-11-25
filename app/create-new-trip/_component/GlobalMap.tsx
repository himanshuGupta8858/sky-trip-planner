"use client";
import type { Activity, Hotel, ItineraryDay, NearbyPlace, TripInfo } from "@/types/trip";
import { GoogleMap, InfoWindow, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { DollarSign, Droplet, Fuel, Heart, ShoppingBag, Train, Utensils, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "450px",
  borderRadius: "16px",
};

const LIBRARIES: Array<"places"> = ["places"];

const CATEGORIES = [
  { id: "restaurant", name: "Restaurants", icon: Utensils, type: "restaurant" },
  { id: "atm", name: "ATMs", icon: DollarSign, type: "atm" },
  { id: "hospital", name: "Hospitals", icon: Heart, type: "hospital" },
  { id: "metro", name: "Metro", icon: Train, type: "subway_station" },
  { id: "charging", name: "EV Charging", icon: Zap, keyword: "electric_vehicle_charging_station" },
  { id: "fuel", name: "Fuel", icon: Fuel, type: "gas_station" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, type: "shopping_mall" },
  { id: "washroom", name: "Washrooms", icon: Droplet, keyword: "public restroom" },
];

interface GooglePlaceNewResult {
  displayName?: string | { text?: string };
  location?: { lat: (() => number) | number; lng: (() => number) | number };
  rating?: number;
  formattedAddress?: string;
}

interface GoogleMapsGlobal {
  maps: {
    LatLngBounds: new () => {
      extend: (coords: { lat: number; lng: number }) => void;
    };
    LatLng: new (lat: number, lng: number) => unknown;
    event: {
      addListener: (instance: unknown, eventName: string, handler: () => void) => unknown;
      removeListener: (listener: unknown) => void;
    };
    SymbolPath?: {
      FORWARD_CLOSED_ARROW: number;
    };
    places?: {
      Place?: {
        searchNearby?: (req: Record<string, unknown>) => Promise<{ places?: GooglePlaceNewResult[] }>;
      };
      PlacesService?: new (map: google.maps.Map) => {
        nearbySearch: (
          req: Record<string, unknown>,
          callback: (results: NearbyPlace[] | null, status: string) => void
        ) => void;
      };
      PlacesServiceStatus?: {
        OK: string;
      };
    };
  };
}

const GlobalMap = ({ trip, activeDay }: { trip: TripInfo | null; activeDay: number | null }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "",
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [selectedNearbyPlace, setSelectedNearbyPlace] = useState<NearbyPlace | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const onLoad = useCallback((loadedMap: google.maps.Map) => {
    setMap(loadedMap);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getGoogle = (): GoogleMapsGlobal | undefined => {
    if (typeof window === "undefined") return undefined;
    return (window as unknown as { google?: GoogleMapsGlobal }).google;
  };

  useEffect(() => {
    const google = getGoogle();
    if (!map || !google || !trip) return;
    const bounds = new google.maps.LatLngBounds();

    if (activeDay) {
      const dayData = trip.itinerary?.find((item: ItineraryDay) => item.day === activeDay);
      let hasPoints = false;

      const hotel = trip.hotels?.[0];
      if (hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
        bounds.extend({
          lat: Number(hotel.geo_coordinates.latitude),
          lng: Number(hotel.geo_coordinates.longitude),
        });
        hasPoints = true;
      }

      dayData?.activities?.forEach((activity: Activity) => {
        if (activity?.geo_coordinates?.latitude && activity?.geo_coordinates?.longitude) {
          bounds.extend({
            lat: Number(activity.geo_coordinates.latitude),
            lng: Number(activity.geo_coordinates.longitude),
          });
          hasPoints = true;
        }
      });

      if (hasPoints) {
        map.fitBounds(bounds as unknown as google.maps.LatLngBounds);
        const listener = google.maps.event.addListener(map, "bounds_changed", () => {
          const currentZoom = map.getZoom();
          if (currentZoom && currentZoom > 15) map.setZoom(15);
          google.maps.event.removeListener(listener);
        });
      }
    } else {
      let hasPoints = false;
      trip?.hotels?.forEach((hotel: Hotel) => {
        if (hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
          bounds.extend({
            lat: Number(hotel.geo_coordinates.latitude),
            lng: Number(hotel.geo_coordinates.longitude),
          });
          hasPoints = true;
        }
      });

      trip?.itinerary?.forEach((item: ItineraryDay) => {
        item.activities?.forEach((activity: Activity) => {
          if (activity?.geo_coordinates?.latitude && activity?.geo_coordinates?.longitude) {
            bounds.extend({
              lat: Number(activity.geo_coordinates.latitude),
              lng: Number(activity.geo_coordinates.longitude),
            });
            hasPoints = true;
          }
        });
      });

      if (hasPoints) {
        map.fitBounds(bounds as unknown as google.maps.LatLngBounds);
      }
    }
  }, [activeDay, map, trip]);

  const searchNearby = useCallback(
    (categoryId: string) => {
      const google = getGoogle();
      if (!map || !google || !trip) return;

      const category = CATEGORIES.find((c) => c.id === categoryId);
      if (!category) return;

      setIsSearching(true);
      setSelectedNearbyPlace(null);

      try {
        let lat: number | null = null;
        let lng: number | null = null;

        if (activeDay) {
          const dayData = trip.itinerary?.find((item: ItineraryDay) => item.day === activeDay);
          const firstActivity = dayData?.activities?.[0];
          if (firstActivity?.geo_coordinates?.latitude) {
            lat = Number(firstActivity.geo_coordinates.latitude);
            lng = Number(firstActivity.geo_coordinates.longitude);
          }
        }

        if (!lat || !lng) {
          const hotel = trip.hotels?.[0];
          if (hotel?.geo_coordinates?.latitude) {
            lat = Number(hotel.geo_coordinates.latitude);
            lng = Number(hotel.geo_coordinates.longitude);
          }
        }

        if (!lat || !lng) {
          setIsSearching(false);
          return;
        }

        if (google.maps.places?.Place?.searchNearby) {
          const newSearchReq: Record<string, unknown> = {
            fields: ["displayName", "location", "rating", "formattedAddress"],
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
            .then(({ places }) => {
              setIsSearching(false);
              if (places && places.length > 0) {
                const formatted: NearbyPlace[] = places.map((p) => ({
                  name:
                    typeof p.displayName === "string"
                      ? p.displayName
                      : p.displayName?.text || "Nearby Place",
                  geometry: { location: p.location },
                  rating: p.rating,
                  vicinity: p.formattedAddress,
                }));
                setNearbyPlaces(formatted);
              } else {
                setNearbyPlaces([]);
              }
            })
            .catch(() => {
              setIsSearching(false);
              setNearbyPlaces([]);
            });
          return;
        }

        if (!google.maps.places?.PlacesService) {
          setIsSearching(false);
          return;
        }

        const service = new google.maps.places.PlacesService(map);
        const searchLocation = new google.maps.LatLng(lat, lng);
        const searchRequest: Record<string, unknown> = {
          location: searchLocation,
          radius: 2000,
        };

        if (category.type) {
          searchRequest.type = category.type;
        } else if (category.keyword) {
          searchRequest.keyword = category.keyword;
        }

        service.nearbySearch(searchRequest, (results, status) => {
          setIsSearching(false);
          if (status === google.maps.places?.PlacesServiceStatus?.OK && results) {
            setNearbyPlaces(results);
          } else {
            setNearbyPlaces([]);
          }
        });
      } catch (err) {
        console.warn("Places nearby search warning:", err);
        setIsSearching(false);
      }
    },
    [map, trip, activeDay]
  );

  useEffect(() => {
    if (selectedCategory) {
      searchNearby(selectedCategory);
    } else {
      setNearbyPlaces([]);
      setSelectedNearbyPlace(null);
    }
  }, [selectedCategory, searchNearby]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const getRouteCoordinates = () => {
    if (!activeDay || !trip) return [];
    const dayData = trip.itinerary?.find((item: ItineraryDay) => item.day === activeDay);
    if (!dayData || !dayData.activities) return [];

    const coords: { lat: number; lng: number }[] = [];

    const hotel = trip.hotels?.[0];
    if (hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
      coords.push({
        lat: Number(hotel.geo_coordinates.latitude),
        lng: Number(hotel.geo_coordinates.longitude),
      });
    }

    dayData.activities.forEach((activity: Activity) => {
      if (activity?.geo_coordinates?.latitude && activity?.geo_coordinates?.longitude) {
        coords.push({
          lat: Number(activity.geo_coordinates.latitude),
          lng: Number(activity.geo_coordinates.longitude),
        });
      }
    });

    if (coords.length > 1 && hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
      coords.push({
        lat: Number(hotel.geo_coordinates.latitude),
        lng: Number(hotel.geo_coordinates.longitude),
      });
    }

    return coords;
  };

  if (!isLoaded) return <div className="p-10 text-center text-neutral-500">Loading Map...</div>;
  if (!trip) return null;

  const googleGlobal = getGoogle();

  return (
    <div className="flex flex-col h-full w-full">
      <div
        className="flex gap-2 overflow-x-auto pb-3 mb-1 no-print scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800"
        role="group"
        aria-label="Filter nearby places"
      >
        {CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-primary border-primary text-white shadow-sm hover:bg-opacity-95"
                  : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{category.name}</span>
              {isSelected && isSearching && (
                <span className="w-2 h-2 rounded-full border border-white border-t-transparent animate-spin ml-0.5" aria-hidden="true" />
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
            gestureHandling: "cooperative",
          }}
        >
          {trip?.hotels?.map((hotel: Hotel, index: number) => {
            if (activeDay && index > 0) return null;
            return (
              hotel?.geo_coordinates && (
                <Marker
                  key={`hotel-${index}`}
                  position={{
                    lat: Number(hotel.geo_coordinates.latitude),
                    lng: Number(hotel.geo_coordinates.longitude),
                  }}
                  label={{
                    text: "🏨",
                    fontSize: "14px",
                  }}
                  title={hotel.hotel_name}
                />
              )
            );
          })}

          {trip?.itinerary?.map((item: ItineraryDay) => {
            if (activeDay && item.day !== activeDay) return null;
            return item.activities?.map((activity: Activity, index: number) =>
              activity?.geo_coordinates ? (
                <Marker
                  key={`activity-${item.day}-${index}`}
                  position={{
                    lat: Number(activity.geo_coordinates.latitude),
                    lng: Number(activity.geo_coordinates.longitude),
                  }}
                  label={{
                    text: `${index + 1}`,
                    color: "white",
                    fontWeight: "bold",
                  }}
                  title={activity.place_name}
                />
              ) : null
            );
          })}

          {activeDay && (
            <Polyline
              path={getRouteCoordinates()}
              options={{
                strokeColor: "#E11D48",
                strokeOpacity: 0.9,
                strokeWeight: 4,
                geodesic: true,
                icons: googleGlobal?.maps?.SymbolPath
                  ? [
                      {
                        icon: {
                          path: googleGlobal.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        },
                        offset: "100px",
                        repeat: "100px",
                      },
                    ]
                  : undefined,
              }}
            />
          )}

          {selectedCategory &&
            nearbyPlaces.map((place, index) => {
              const placeLat = place.geometry?.location?.lat;
              const placeLng = place.geometry?.location?.lng;
              const lat = typeof placeLat === "function" ? placeLat() : placeLat;
              const lng = typeof placeLng === "function" ? placeLng() : placeLng;

              if (!lat || !lng) return null;

              return (
                <Marker
                  key={`nearby-${place.name || index}-${lat}`}
                  position={{ lat, lng }}
                  title={place.name}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                  onClick={() => setSelectedNearbyPlace(place)}
                />
              );
            })}

          {selectedNearbyPlace &&
            (() => {
              const placeLat = selectedNearbyPlace.geometry?.location?.lat;
              const placeLng = selectedNearbyPlace.geometry?.location?.lng;
              const lat = typeof placeLat === "function" ? placeLat() : placeLat;
              const lng = typeof placeLng === "function" ? placeLng() : placeLng;

              return (
                lat &&
                lng && (
                  <InfoWindow
                    position={{ lat, lng }}
                    onCloseClick={() => setSelectedNearbyPlace(null)}
                  >
                    <div className="p-2 text-neutral-900 font-sans max-w-[200px]">
                      <h4 className="font-bold text-sm mb-1">{selectedNearbyPlace.name}</h4>
                      {selectedNearbyPlace.vicinity && (
                        <p className="text-xs text-neutral-600 mb-1">
                          {selectedNearbyPlace.vicinity}
                        </p>
                      )}
                      {selectedNearbyPlace.rating && (
                        <p className="text-xs font-semibold text-amber-600">
                          ★ {selectedNearbyPlace.rating}
                        </p>
                      )}
                    </div>
                  </InfoWindow>
                )
              );
            })()}
        </GoogleMap>
      </div>
    </div>
  );
};

export default GlobalMap;
