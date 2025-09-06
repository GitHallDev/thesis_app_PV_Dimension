import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface CoordinatesInputProps {
  currentCoordinates: [number, number] | null;
  onSubmit: (coordinates: [number, number]) => void;
}

export default function CoordinatesInput({
  currentCoordinates,
  onSubmit,
}: CoordinatesInputProps) {
  const [lng, setLng] = useState("");
  const [lat, setLat] = useState("");

  useEffect(() => {
    if (currentCoordinates) {
      setLng(currentCoordinates[0].toFixed(6));
      setLat(currentCoordinates[1].toFixed(6));
    }
  }, [currentCoordinates]);

  const handleSubmit = () => {
    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);

    if (
      isNaN(longitude) ||
      isNaN(latitude) ||
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      toast.error("Veuillez entrer des coordonnées valides.");
      return;
    }

    onSubmit([longitude, latitude]);
  };

  return (
    <div className="absolute top-5 right-2 sm:top-10  sm:right-4  z-10 bg-background p-3 rounded-md shadow-md space-y-2 w-[200px] sm:w-[260px] hidden sm:block">
      <div>
        <label className="text-xs sm:text-sm font-medium">Longitude</label>
        <Input
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="h-8 sm:h-10 text-xs sm:text-sm"
        />
      </div>
      <div>
        <label className="text-xs sm:text-sm font-medium">Latitude</label>
        <Input
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="h-8 sm:h-10 text-xs sm:text-sm"
        />
      </div>
      <Button
        className="w-full h-8 sm:h-10 text-xs sm:text-sm"
        onClick={handleSubmit}
      >
        Aller à cette position
      </Button>
    </div>
  );
}
