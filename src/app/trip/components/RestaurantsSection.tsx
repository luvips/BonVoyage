"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { IoStar, IoLocationSharp, IoRestaurant, IoPricetag, IoSearch } from "react-icons/io5";

const POIMap = dynamic(() => import("./POIMap"), { ssr: false });

type Place = {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  ratingCount: number | null;
  priceLevel: string | null;
  description: string | null;
  photoUrl: string | null;
  lat: number;
  lng: number;
};

type Destination = {
  name: string;
  country: string;
  lat: number;
  lng: number;
  photoUrl: string | null;
};

export default function RestaurantsSection({ destination }: { destination: Destination }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true);
      try {
        const res = await fetch(`/api/restaurants?lat=${destination.lat}&lng=${destination.lng}`);
        const data = await res.json();
        setPlaces(data.places ?? []);
        if (data.places?.length > 0) setSelectedId(data.places[0].id);
      } catch {
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, [destination.lat, destination.lng]);

  const filtered = useMemo(() => {
    if (!query.trim()) return places;
    const q = query.toLowerCase();
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }, [places, query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 gap-3 text-gray-400">
        <IoRestaurant className="text-3xl animate-pulse" />
        <span className="text-sm">Buscando restaurantes...</span>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3 text-gray-400">
        <IoRestaurant className="text-5xl text-gray-200" />
        <p className="text-sm">No se encontraron restaurantes cerca de {destination.name}.</p>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-6xl mx-auto pt-6 pb-8 space-y-4">

      {/* Search bar */}
      <div className="relative max-w-sm">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar restaurante..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
        />
      </div>

      {/* Main layout: cards grid + map */}
      <div className="flex gap-4 items-start">

        {/* Left — cards grid */}
        <div className="flex-1 overflow-y-auto max-h-[580px] pr-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">Sin resultados para "{query}"</p>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((place) => (
                <RestaurantCard
                  key={place.id}
                  place={place}
                  selected={selectedId === place.id}
                  onClick={() => setSelectedId(place.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — map */}
        <div className="w-72 flex-shrink-0 sticky top-16 h-[580px] rounded-2xl overflow-hidden shadow-md border border-gray-100">
          <POIMap
            places={filtered}
            selectedId={selectedId}
            onSelectId={setSelectedId}
            center={{ lat: destination.lat, lng: destination.lng }}
          />
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({
  place,
  selected,
  onClick,
}: {
  place: Place;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-xl overflow-hidden shadow-sm border transition-all duration-200 ${
        selected
          ? "border-blue-500 shadow-md ring-1 ring-blue-200"
          : "border-gray-100 hover:border-gray-300 hover:shadow"
      }`}
    >
      {/* Image */}
      <div className="w-full h-28 bg-gray-100 overflow-hidden">
        {place.photoUrl ? (
          <img src={place.photoUrl} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <IoRestaurant className="text-3xl text-gray-200" />
          </div>
        )}
      </div>

      <div className="p-2.5">
        {/* Rating + Price */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            {place.rating && (
              <>
                <IoStar className="text-amber-400 text-[10px]" />
                <span className="text-[11px] font-semibold text-gray-700">
                  {place.rating.toFixed(1)}
                </span>
                {place.ratingCount && (
                  <span className="text-[9px] text-gray-400">
                    ({place.ratingCount > 999
                      ? `${(place.ratingCount / 1000).toFixed(1)}k`
                      : place.ratingCount})
                  </span>
                )}
              </>
            )}
          </div>
          {place.priceLevel && (
            <div className="flex items-center gap-0.5 text-gray-500">
              <IoPricetag className="text-[9px]" />
              <span className="text-[10px] font-medium">{place.priceLevel}</span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-800 text-xs leading-tight line-clamp-1">
          {place.name}
        </h3>

        {/* Description */}
        {place.description && (
          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        )}

        {/* Address */}
        <div className="flex items-start gap-1 mt-1.5">
          <IoLocationSharp className="text-gray-400 text-[9px] flex-shrink-0 mt-0.5" />
          <p className="text-[9px] text-gray-400 line-clamp-1">{place.address}</p>
        </div>
      </div>
    </button>
  );
}
