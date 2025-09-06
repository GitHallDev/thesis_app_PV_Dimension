// Project: pvGis
// File: src/location/map/index.tsx

// import * as React from "react";
// import { useLazyGetPvGisDataQuery } from "@/redux/pvGisApi/pvGisApi";
// import { json } from "stream/consumers";

// const style: React.CSSProperties = {
//   width: "100%",
//   height: "100vh",
// };

// const Map = () => {
//   // Utilisation du hook lazy
// const [triggerGetPvGisData, { data, isLoading, isError, error }] =
//   useLazyGetPvGisDataQuery();
//   const [long_lat, setLongLat] = React.useState({
//     longitude: 0,
//     latitude: 0,
//   });

//   // Exécuter une action après le chargement des données
//   React.useEffect(() => {
//     if (data && !isLoading && !isError) {
//       // Placez ici l'action à exécuter après le chargement des données
//       console.log("Données chargées :", data);
//       // Par exemple, stockage dans le localStorage
//       localStorage.setItem("pvGisData", JSON.stringify(data));
//     }
//   }, [data, isLoading, isError]);
//   const [startYear, setStartYear] = React.useState(2020);
//   const [endYear, setEndYear] = React.useState(2023);
//   const [angle, setAngle] = React.useState(0);
//   const [aspect, setAspect] = React.useState(0);
//   const [outputFormat, setOutputFormat] = React.useState("json");

//   const onSubmit = (e: React.FormEvent) => {
//     try {
//       e.preventDefault();
//       triggerGetPvGisData({
//         latitude: long_lat.latitude,
//         longitude: long_lat.longitude,
//         startYear,
//         endYear,
//         angle,
//         aspect,
//         outputformat: outputFormat, // attention à la casse !
//       });
//       console.log("Data received:", data);
//       if (data) localStorage.setItem("pvGisData", data); // Stockage des données dans le localStorage
//     } catch (error) {
//       console.error("Error during submission:", error);
//       alert("An error occurred while fetching data. Please try again.");
//     }
//   };

//   return (
//     <div id="map" className="p-4 border">
//       <h1>Map Component</h1>
//       <p>This is a placeholder for the map component.</p>
//       <form onSubmit={onSubmit} className=" h-[400px]  p-4">
//         <div>
//           {" "}
//           <label className="flex flex-row my-1.5 justify-between">
//             Longitude:
//             <input
//               className="mx-8 border"
//               type="number"
//               step={0.000001}
//               value={long_lat.longitude}
//               onChange={(e) =>
//                 setLongLat({
//                   ...long_lat,
//                   longitude: parseFloat(e.target.value),
//                 })
//               }
//             />
//           </label>
//         </div>

//         <div>
//           <label className="flex flex-row my-1.5 justify-between">
//             Latitude:
//             <input
//               type="number"
//               step={0.000001}
//               className="mx-8 border"
//               value={long_lat.latitude}
//               onChange={(e) =>
//                 setLongLat({
//                   ...long_lat,
//                   latitude: parseFloat(e.target.value),
//                 })
//               }
//             />
//           </label>
//         </div>

//         <div>
//           {" "}
//           <label className="flex flex-row my-1.5 justify-between">
//             Start Year:
//             <input
//               type="number"
//               className="mx-8 border"
//               value={startYear}
//               onChange={(e) => setStartYear(parseInt(e.target.value))}
//             />
//           </label>
//         </div>
//         <div>
//           {" "}
//           <label className="flex flex-row my-1.5 justify-between">
//             End Year:
//             <input
//               type="number"
//               className="mx-8 border"
//               value={endYear}
//               onChange={(e) => setEndYear(parseInt(e.target.value))}
//             />
//           </label>
//         </div>

//         <div>
//           {" "}
//           <label className="flex flex-row my-1.5 justify-between">
//             Angle:
//             <input
//               type="number"
//               step={1}
//               className="mx-8 border"
//               value={angle}
//               onChange={(e) => setAngle(parseInt(e.target.value))}
//             />
//           </label>
//         </div>

//         <div>
//           {" "}
//           <label className="flex flex-row my-1.5 justify-between">
//             Aspect:
//             <input
//               type="number"
//               className="mx-8 border"
//               step={1}
//               value={aspect}
//               onChange={(e) => setAspect(parseInt(e.target.value))}
//             />
//           </label>
//         </div>

//         <div>
//           {" "}
//           <label className="flex flex-row my-1.5 justify-between">
//             Output Format:
//             <select
//               className="mx-8 border"
//               value={outputFormat}
//               onChange={(e) => setOutputFormat(e.target.value)}
//             >
//               <option value="json">JSON</option>
//               <option value="csv">CSV</option>
//             </select>
//           </label>
//         </div>

//         <button type="submit" className="my-2 border px-35">
//           Envoyer
//         </button>
//       </form>
//       {/* Affichage des résultats */}
//       {isLoading && <p>Chargement...</p>}
//       {isError && <p>Erreur : {JSON.stringify(error)}</p>}
//       {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
//     </div>
//   );
// };
// export default Map;

// location/map/index.tsx

import { useRef } from "react";

import MapProvider from "@/lib/mapbox/provider";
import MapStyles from "@/components/map/map-styles";
import MapControls from "@/components/map/map-controls";
import MapSearch from "@/components/map/map-search";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import MapCurrentLocation from "@/components/map/map-currentLocation";
import MapClickSetter from "@/components/map/map-click-setter";

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      {/* <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Dashboard App
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  Map
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header> */}
      <div className="w-full h-full">
        <div
          id="map-container"
          ref={mapContainerRef}
          className="absolute inset-0 h-full w-full"
        />

        <MapProvider
          mapContainerRef={mapContainerRef}
          initialViewState={{
            longitude: -7.985,
            latitude: 12.6392,
            zoom: 10,
          }}
        >
          <MapSearch />
          <MapCurrentLocation />
          <MapControls />
          <MapStyles />
          <MapClickSetter />
        </MapProvider>
      </div>
    </>
  );
}
