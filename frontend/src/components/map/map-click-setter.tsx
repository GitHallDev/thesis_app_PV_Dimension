// components/map/map-click-setter.tsx
import { useEffect } from "react";
import { useMap } from "@/context/map-context";
import type { LocationFeature } from "@/lib/mapbox/utils";
import { setSelectedLocations,setSelectedLocation } from "@/redux/map/mapSlice";
import { useDispatch } from "react-redux";
export default function MapClickSetter() {
  const dispatch=useDispatch()  
  const { map,     } = useMap();

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      const feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates,
        },
        properties: {
          name: "Position définie par clic",
          mapbox_id: `clicked-${coordinates.join(",")}`,
        },
      } as LocationFeature;

     dispatch( setSelectedLocation(feature));
      dispatch(setSelectedLocations([feature]));

      map.flyTo({
        center: coordinates,
        zoom: 14,
        speed: 4,
        duration: 1000,
        essential: true,
      });
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, dispatch]);

  return null;
}
