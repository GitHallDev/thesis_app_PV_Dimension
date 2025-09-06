// map-context.ts
import type { LocationFeature } from "@/lib/mapbox/utils";
import { createContext, useContext } from "react";

interface MapContextType {
  map: mapboxgl.Map;
  selectedLocation: LocationFeature | null;
  setSelectedLocation: (loc: LocationFeature | null) => void;
  selectedLocations: LocationFeature[];
  setSelectedLocations: (locs: LocationFeature[]) => void;
}
export const MapContext = createContext<MapContextType | null>(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}

export function useCurrentCoordinates(): [number, number] | null {
  const { selectedLocation } = useMap();
  return selectedLocation
    ? (selectedLocation.geometry.coordinates as [number, number])
    : null;
}
