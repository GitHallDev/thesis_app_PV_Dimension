// lib/mapbox/provieder.tsx

"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { MapContext } from "@/context/map-context";
import type { LocationFeature } from "./utils";

mapboxgl.accessToken = import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN!;

type MapComponentProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  children?: React.ReactNode;
};

export default function MapProvider({
  mapContainerRef,
  initialViewState,
  children,
}: MapComponentProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState<LocationFeature | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<LocationFeature[]>(
    []
  );
  useEffect(() => {
    if (!mapContainerRef.current || map) return;
    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      attributionControl: false,
      logoPosition: "bottom-right",
    });

    newMap.on("load", () => {
      setMapLoaded(true);
    });
    setMap(newMap);
    return () => {
      if (newMap) {
        newMap.remove();
        setMap(null);
      }
    };
    // setMapLoaded(true);
  }, [initialViewState, mapContainerRef]);

  if (!map) return null;
  return (
    <div className="z-[1000]">
      <MapContext.Provider
        value={{
          map: map!,
          selectedLocation,
          setSelectedLocation,
          selectedLocations,
          setSelectedLocations,
        }}
      >
        {children}
      </MapContext.Provider>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[1000]">
          <div className="text-lg font-medium">Loading map ...</div>
        </div>
      )}
    </div>
  );
}
