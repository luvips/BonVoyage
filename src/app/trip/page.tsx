"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TripHeader from "./components/TripHeader";
import TripNav from "./components/TripNav";
import FlightsSection from "./components/FlightsSection";
import HotelsSection from "./components/HotelsSection";
import PointsOfInterestSection from "./components/PointsOfInterestSection";
import RestaurantsSection from "./components/RestaurantsSection";

export type TripSection = "vuelos" | "hospedaje" | "puntos" | "restaurantes";

function TripPageContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<TripSection>("vuelos");

  const destination = {
    name: searchParams.get("name") ?? "Destino",
    country: searchParams.get("country") ?? "",
    lat: parseFloat(searchParams.get("lat") ?? "0"),
    lng: parseFloat(searchParams.get("lng") ?? "0"),
    photoUrl: searchParams.get("photoUrl") ?? null,
  };

  const sectionComponents: Record<TripSection, React.ReactNode> = {
    vuelos: <FlightsSection destination={destination} />,
    hospedaje: <HotelsSection destination={destination} />,
    puntos: <PointsOfInterestSection destination={destination} />,
    restaurantes: <RestaurantsSection destination={destination} />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TripHeader />

      {/* Secondary nav */}
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
          {/* Gradient overlay */}
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
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
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
