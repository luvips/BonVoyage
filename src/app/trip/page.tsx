"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import TripHeader from "./components/TripHeader";
import TripNav from "./components/TripNav";
import FlightsSection from "./components/FlightsSection";
import HotelsSection from "./components/HotelsSection";
import PointsOfInterestSection from "./components/PointsOfInterestSection";
import RestaurantsSection from "./components/RestaurantsSection";
import ItinerarySection from "./components/ItinerarySection";
import type { ItineraryItem, TripItinerary, DayPlan } from "./types";

export type TripSection = "vuelos" | "hospedaje" | "puntos" | "restaurantes" | "itinerario";

const BACKEND = "https://bonvoyage-backend.vercel.app";

function TripPageContent() {
  const searchParams = useSearchParams();
  const { getToken } = useAuth();
  const [activeSection, setActiveSection] = useState<TripSection>("vuelos");

  const tripId = searchParams.get("tripId");

  const destination = {
    name: searchParams.get("name") ?? "Destino",
    country: searchParams.get("country") ?? "",
    lat: parseFloat(searchParams.get("lat") ?? "0"),
    lng: parseFloat(searchParams.get("lng") ?? "0"),
    photoUrl: searchParams.get("photoUrl") ?? null,
  };

  // Pre-fill flight params passed from the wizard
  const wizardFlightParams = {
    origin: searchParams.get("origin") ?? "",
    startDate: searchParams.get("startDate") ?? "",
    endDate: searchParams.get("endDate") ?? "",
    passengers: parseInt(searchParams.get("passengers") ?? "1"),
    cabinClass: searchParams.get("cabinClass") ?? "economy",
  };

  const [itinerary, setItinerary] = useState<TripItinerary>({ tripId: tripId ?? "", days: [] });
  const [loadingTrip, setLoadingTrip] = useState(!!tripId);
  const [tripError, setTripError] = useState<string | null>(null);

  const loadTrip = useCallback(async () => {
    if (!tripId) return;
    setLoadingTrip(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND}/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

      // Map backend response to our DayPlan shape
      // Adjust field names here if the actual API differs
      const days: DayPlan[] = (data.days ?? []).map((d: {
        day_id: string;
        day_number: number;
        day_date?: string;
        date?: string;
        items?: Array<{
          item_id: string;
          item_type?: string;
          // fields from place_references JOIN (added by backend team)
          place_reference_id?: string;
          name?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          photo_url?: string;
          category?: string;
          rating?: number | null;
          price_level?: string | null;
          estimated_cost?: number | null;
          notes?: string | null;
        } | null>;
      }) => ({
        dayId: d.day_id,
        dayNumber: d.day_number,
        date: d.day_date ?? d.date ?? "",
        items: (d.items ?? [])
          .filter((item): item is NonNullable<typeof item> => !!item?.item_id)
          .map((item) => ({
            itemId: item.item_id,
            id: item.place_reference_id ?? item.item_id,
            type: (
              item.category === "HOTEL" ? "hotel"
              : item.category === "RESTAURANT" ? "restaurant"
              : "poi"
            ) as "poi" | "restaurant" | "hotel",
            name: item.name ?? "",
            address: item.address ?? "",
            lat: item.latitude ?? 0,
            lng: item.longitude ?? 0,
            photoUrl: item.photo_url ?? null,
            rating: item.rating ?? null,
            priceLevel: item.price_level ?? null,
          })),
      }));

      setItinerary({ tripId, days });
    } catch (err: unknown) {
      setTripError(err instanceof Error ? err.message : "Error al cargar el viaje");
    } finally {
      setLoadingTrip(false);
    }
  }, [tripId, getToken]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  async function addToItinerary(item: ItineraryItem, dayNumber: number) {
    const day = itinerary.days.find((d) => d.dayNumber === dayNumber);
    if (!day) return;
    if (day.items.some((i) => i.id === item.id)) return; // already added

    // Optimistic update — always show in UI regardless of backend result
    const tempId = crypto.randomUUID();
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.dayNumber === dayNumber
          ? { ...d, items: [...d.items, { ...item, itemId: tempId }] }
          : d
      ),
    }));

    // TODO: call backend once it exposes a save endpoint for POIs/restaurants
    // that returns a place_reference_id UUID, then call:
    // POST /api/trips/${tripId}/days/${day.dayId}/items
    // body: { item_type: 'PLACE', place_reference_id: <uuid> }
  }

  async function removeFromItinerary(itemId: string, dayNumber: number) {
    const day = itinerary.days.find((d) => d.dayNumber === dayNumber);
    if (!day) return;

    try {
      const token = await getToken();
      await fetch(
        `${BACKEND}/api/trips/${tripId}/days/${day.dayId}/items/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch {
      // silent
    }

    // Optimistic remove — keep days even when they have 0 items
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.dayNumber === dayNumber
          ? { ...d, items: d.items.filter((i) => i.itemId !== itemId) }
          : d
      ),
    }));
  }

  const tripDays = itinerary.days.map((d) => ({
    dayId: d.dayId,
    dayNumber: d.dayNumber,
    date: d.date,
  }));

  const sectionComponents: Record<TripSection, React.ReactNode> = {
    vuelos: (
      <FlightsSection
        destination={destination}
        defaultOrigin={wizardFlightParams.origin}
        defaultDepartDate={wizardFlightParams.startDate}
        defaultReturnDate={wizardFlightParams.endDate}
        defaultPassengers={wizardFlightParams.passengers}
        defaultCabinClass={wizardFlightParams.cabinClass}
      />
    ),
    hospedaje: <HotelsSection destination={destination} tripId={tripId ?? ""} />,
    puntos: (
      <PointsOfInterestSection
        destination={destination}
        tripDays={tripDays}
        onAddToItinerary={addToItinerary}
      />
    ),
    restaurantes: (
      <RestaurantsSection
        destination={destination}
        tripDays={tripDays}
        onAddToItinerary={addToItinerary}
      />
    ),
    itinerario: (
      <ItinerarySection
        itinerary={itinerary}
        onRemove={removeFromItinerary}
      />
    ),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TripHeader />
      <TripNav active={activeSection} onChange={setActiveSection} />

      {/* Destination hero */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-6">
        <div className="relative h-100 w-full overflow-hidden rounded-2xl bg-gray-800 shadow-md">
          {destination.photoUrl ? (
            <img
              src={destination.photoUrl}
              alt={destination.name}
              className="w-full h-full object-cover opacity-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-7">
            <h1 className="text-white text-5xl font-bold drop-shadow-lg leading-tight">
              {destination.name}
            </h1>
            {destination.country && (
              <p className="text-white/80 text-2xl font-medium mt-1 drop-shadow">
                {destination.country}
              </p>
            )}
            {loadingTrip && (
              <p className="text-white/60 text-sm mt-2">Cargando itinerario...</p>
            )}
            {tripError && (
              <p className="text-red-300 text-sm mt-2">{tripError}</p>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 w-full pt-0 pb-6">
        {sectionComponents[activeSection]}
      </main>
    </div>
  );
}

export default function TripPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">Cargando...</div>}>
      <TripPageContent />
    </Suspense>
  );
}
