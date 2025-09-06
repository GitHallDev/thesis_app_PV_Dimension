// components/map/map-controls.tsx

import { PlusIcon, MinusIcon } from "lucide-react";

import { useMap } from "@/context/map-context";
import { Button } from "../ui/button";

export default function MapControls() {
  const { map } = useMap();

  const zoomIn = () => {
    map?.zoomIn();
  };

  const zoomOut = () => {
    map?.zoomOut();
  };

  return (
    <aside className="absolute bottom-8 right-4 z-10 bg-background rounded-lg shadow-lg flex flex-col gap-2">
      <Button variant="ghost" size="icon" onClick={zoomIn}>
        <PlusIcon className=" w-2 h-2 sm:w-5 sm:h-5 " />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={zoomOut}>
        <MinusIcon className="w-5 h-5"/>
        <span className="sr-only">Zoom out</span>
      </Button>
    </aside>
  );
}
