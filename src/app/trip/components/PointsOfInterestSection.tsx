"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { IoStar, IoLocationSharp, IoCompass, IoPricetag, IoSearch, IoAdd, IoCheckmark } from "react-icons/io5";
import type { ItineraryItem } from "../types";

const POIMap = dynamic(() => import("./POIMap"), { ssr: false });

type POI = {
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

type Props = {
  destination: Destination;
  onAddToItinerary: (item: ItineraryItem, dayNumber: number) => void;
};

export default function PointsOfInterestSection({ destination, onAddToItinerary }: Props) {
  const [places, setPlaces] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [pickerOpenId, setPickerOpenId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchPOIs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/poi?lat=${destination.lat}&lng=${destination.lng}`);
        const data = await res.json();
        setPlaces(data.places ?? []);
        if (data.places?.length > 0) setSelectedId(data.places[0].id);
      } catch {
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPOIs();
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

  function handleAddToDay(poi: POI, day: number) {
    onAddToItinerary(
      {
        id: poi.id,
        type: "poi",
        name: poi.name,
        address: poi.address,
        lat: poi.lat,
        lng: poi.lng,
        photoUrl: poi.photoUrl,
        rating: poi.rating,
        priceLevel: poi.priceLevel,
      },
      day
    );
    setAddedIds((prev) => new Set(prev).add(poi.id));
    setPickerOpenId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 gap-3 text-gray-400">
        <IoCompass className="text-3xl animate-spin" />
        <span className="text-sm">Buscando puntos de interés...</span>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3 text-gray-400">
        <IoCompass className="text-5xl text-gray-200" />
        <p className="text-sm">No se encontraron puntos de interés cerca de {destination.name}.</p>
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
          placeholder="Buscar lugar..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
        />
      </div>

      <div className="flex gap-4 items-start">

        <div className="flex-1 overflow-y-auto max-h-[580px] pr-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">Sin resultados para "{query}"</p>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((poi) => (
                <POICard
                  key={poi.id}
                  poi={poi}
                  selected={selectedId === poi.id}
                  added={addedIds.has(poi.id)}
                  pickerOpen={pickerOpenId === poi.id}
                  onClick={() => { setSelectedId(poi.id); setPickerOpenId(null); }}
                  onPickerToggle={() => setPickerOpenId(pickerOpenId === poi.id ? null : poi.id)}
                  onAddToDay={(day) => handleAddToDay(poi, day)}
                />
              ))}
            </div>
          )}
        </div>

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

function POICard({
  poi,
  selected,
  added,
  pickerOpen,
  onClick,
  onPickerToggle,
  onAddToDay,
}: {
  poi: POI;
  selected: boolean;
  added: boolean;
  pickerOpen: boolean;
  onClick: () => void;
  onPickerToggle: () => void;
  onAddToDay: (day: number) => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative w-full text-left bg-white rounded-xl overflow-hidden shadow-sm border transition-all duration-200 cursor-pointer ${
        selected
          ? "border-blue-500 shadow-md ring-1 ring-blue-200"
          : "border-gray-100 hover:border-gray-300 hover:shadow"
      }`}
    >
      {/* Add to itinerary button */}
      <button
        onClick={(e) => { e.stopPropagation(); onPickerToggle(); }}
        title="Agregar al itinerario"
        className={`absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full flex items-center justify-center shadow transition-colors ${
          added
            ? "bg-green-500 text-white"
            : "bg-white/90 text-blue-500 hover:bg-blue-50"
        }`}
      >
        {added ? <IoCheckmark className="text-xs" /> : <IoAdd className="text-sm" />}
      </button>

      {/* Day picker popover */}
      {pickerOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-8 right-1.5 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-2 w-36"
        >
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 px-1">
            Agregar al día
          </p>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <button
                key={day}
                onClick={() => onAddToDay(day)}
                className="text-[11px] font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg py-1 transition-colors"
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image */}
      <div className="w-full h-28 bg-gray-100 overflow-hidden">
        {poi.photoUrl ? (
          <img src={poi.photoUrl} alt={poi.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <IoCompass className="text-3xl text-gray-200" />
          </div>
        )}
      </div>

      <div className="p-2.5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            {poi.rating && (
              <>
                <IoStar className="text-amber-400 text-[10px]" />
                <span className="text-[11px] font-semibold text-gray-700">
                  {poi.rating.toFixed(1)}
                </span>
                {poi.ratingCount && (
                  <span className="text-[9px] text-gray-400">
                    ({poi.ratingCount > 999 ? `${(poi.ratingCount / 1000).toFixed(1)}k` : poi.ratingCount})
                  </span>
                )}
              </>
            )}
          </div>
          {poi.priceLevel && (
            <div className="flex items-center gap-0.5 text-gray-500">
              <IoPricetag className="text-[9px]" />
              <span className="text-[10px] font-medium">{poi.priceLevel}</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-gray-800 text-xs leading-tight line-clamp-1">
          {poi.name}
        </h3>

        {poi.description && (
          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {poi.description}
          </p>
        )}

        <div className="flex items-start gap-1 mt-1.5">
          <IoLocationSharp className="text-gray-400 text-[9px] flex-shrink-0 mt-0.5" />
          <p className="text-[9px] text-gray-400 line-clamp-1">{poi.address}</p>
        </div>
      </div>
    </div>
  );
}
