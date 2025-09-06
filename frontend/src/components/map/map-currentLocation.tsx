import { useEffect, useState } from "react";

import { useMap } from "@/context/map-context";

import { LocationMarker } from "../location-marker";
import { LocationPopup } from "../location-popup";
import { toast } from "sonner";
import { type LocationFeature } from "@/lib/mapbox/utils";

import { Button } from "../ui/button";
import { LocateFixed } from "lucide-react";

// composant pour gérer l'affichage des coordonnées et leur modification
import CoordinatesInput from "./map-coordinatesInputs";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  setSelectedLocation,
  setSelectedLocations,
} from "@/redux/map/mapSlice";

export default function MapCurrentLocation() {
  const {
    map,
  } = useMap();
  const dispatch = useDispatch();
  const selectedLocation = useSelector(
    (state: any) => state.map.selectedLocation
  );
  const selectedLocations = useSelector(
    (state: any) => state.map.selectedLocations
  );

  // getCurrentLocation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas disponible sur votre appareil");
      console.log(
        "votre appareil n'est pas compatible avec la géolocalisation"
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lng = position.coords.longitude;
      const lat = position.coords.latitude;

      if (map) {
        const coordinates: [number, number] = [lng, lat];

        // centrer la carte sur la position actuelle
        map.flyTo({
          center: [lng, lat],
          zoom: 14,
          speed: 4,
          duration: 1000,
          essential: true,
        });

        // simule une feature mapbox pour plus de détails
        const pseudoFeature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates,
          },
          properties: {
            name: "Ma position actuelle",
            mapbox_id: "current-location",
          },
        };

        dispatch(setSelectedLocations([pseudoFeature as LocationFeature]));
        dispatch(setSelectedLocation(pseudoFeature as LocationFeature));
      }
    });
  };
  return (
    <>
      <aside className="absolute  bottom-32 right-4  z-10 bg-background rounded-lg shadow-lg flex flex-col gap-2">
        <Button variant="ghost" size="icon" onClick={handleGeolocation}>
          <LocateFixed className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">My location</span>
        </Button>
      </aside>
      {selectedLocations.map((location: any) => (
        <LocationMarker
          key={location.properties.mapbox_id}
          location={location}
          onHover={(data: any) => dispatch(setSelectedLocation(data))}
        />
      ))}

      {selectedLocation && (
        <LocationPopup
          location={selectedLocation}
          onClose={() => dispatch(setSelectedLocation(null))}
        />
      )}
      {/* composant de gestion des coordonnées */}
      <CoordinatesInput
        currentCoordinates={
          selectedLocation
            ? (selectedLocation.geometry.coordinates as [number, number])
            : null
        }
        onSubmit={(coordinates) => {
          if (map) {
            map.flyTo({
              center: coordinates,
              zoom: 14,
              speed: 4,
              duration: 1000,
              essential: true,
            });

            const manualFeature = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates,
              },
              properties: {
                name: `Coordonnées manuelles`,
                mapbox_id: `manual-${coordinates.join(",")}`,
              },
            } as LocationFeature;

            dispatch(setSelectedLocations([manualFeature]));
            dispatch(setSelectedLocation(manualFeature));
          }
        }}
      />
      {/* fin composant de gestion des coordonnées */}
    </>
  );
}
