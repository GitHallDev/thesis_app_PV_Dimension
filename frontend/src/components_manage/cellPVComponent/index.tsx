// src/components_manage/cellPVComponent/index.tsx

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// importation pour le notre tableau
import { type TableData, filterConfigs } from "./columns";
import { useLazyGetAllCellPvComponentByOwnerQuery } from "@/redux/componentsManageApi/cellPVComponent/cellPVComponentApi";
import { useEffect, useState } from "react";

import { PVDataTable } from "./pv_table";
import AddPvModuleModal from "./add_pv_module_modal";
import { toast } from "sonner";
import { useSelector } from "react-redux";
// import { useAppSelector } from "@/redux/store";

// async function getData(): Promise<TableData[]> {
//   return [
//     {
//       fabricant: "PV1",
//       model: "PV1",
//       technologie: "Monocristallin",
//       puissance_crete: 100,
//       tension_puissance_maximale: 100,
//       courant_puissance_maximale: 100,
//       tension_a_vide: 45.5,
//       courant_court_circuit: 9.5,
//       tolerance_puissance: 3,
//       nombre_cellule: 72,
//       dimension_module_longueur: 120,
//       dimension_module_largeur: 60,
//       dimension_module_hauteur: 10,
//       coefficient_temperature_courant: 0.004,
//       coefficient_temperature_tension: 0.01,
//       coefficient_temperature_puissance: 0.002,
//       plage_temperature_fonctionnement: "-40°C à 85°C",
//       poids_module: 100,
//       rendement_cellule: 15,
//       rendement_module: 18,
//       condition_standard_test: "IEC 61851",
//       prix: 100,
//     },
//     {
//       fabricant: "PV2",
//       model: "PV2",
//       technologie: "Polycristallin",
//       puissance_crete: 100,
//       tension_puissance_maximale: 100,
//       courant_puissance_maximale: 100,
//       tension_a_vide: 45.5,
//       courant_court_circuit: 9.5,
//       tolerance_puissance: 3,
//       nombre_cellule: 72,
//       dimension_module_longueur: 120,
//       dimension_module_largeur: 60,
//       dimension_module_hauteur: 10,
//       coefficient_temperature_courant: 0.004,
//       coefficient_temperature_tension: 0.01,
//       coefficient_temperature_puissance: 0.002,
//       plage_temperature_fonctionnement: "-40°C à 85°C",
//       poids_module: 100,
//       rendement_cellule: 15,
//       rendement_module: 18,
//       condition_standard_test: "IEC 61851",
//       prix: 100,
//     },
//     {
//       fabricant: "PV3",
//       model: "PV3",
//       technologie: "CIS/CIGS",
//       puissance_crete: 100,
//       tension_puissance_maximale: 100,
//       courant_puissance_maximale: 100,
//       tension_a_vide: 45.5,
//       courant_court_circuit: 9.5,
//       tolerance_puissance: 3,
//       nombre_cellule: 72,
//       dimension_module_longueur: 120,
//       dimension_module_largeur: 60,
//       dimension_module_hauteur: 10,
//       coefficient_temperature_courant: 0.004,
//       coefficient_temperature_tension: 0.01,
//       coefficient_temperature_puissance: 0.002,
//       plage_temperature_fonctionnement: "-40°C à 85°C",
//       poids_module: 100,
//       rendement_cellule: 15,
//       rendement_module: 18,
//       condition_standard_test: "IEC 61851",
//       prix: 100,
//     },
//     {
//       fabricant: "PV4",
//       model: "PV4",
//       technologie: "CdTe",
//       puissance_crete: 100,
//       tension_puissance_maximale: 100,
//       courant_puissance_maximale: 100,
//       tension_a_vide: 45.5,
//       courant_court_circuit: 9.5,
//       tolerance_puissance: 3,
//       nombre_cellule: 72,
//       dimension_module_longueur: 120,
//       dimension_module_largeur: 60,
//       dimension_module_hauteur: 10,
//       coefficient_temperature_courant: 0.004,
//       coefficient_temperature_tension: 0.01,
//       coefficient_temperature_puissance: 0.002,
//       plage_temperature_fonctionnement: "-40°C à 85°C",
//       poids_module: 100,
//       rendement_cellule: 15,
//       rendement_module: 18,
//       condition_standard_test: "IEC 61851",
//       prix: 100,
//     },

//     // ...
//   ];
// }

export default function CellPVComponentManagePage() {
  //  const components = useAppSelector((state) => state.cellPvComponent.items);
  const cellPVItems = useSelector((state: any) => state.cellPvComponent.items);
  const [getAllCellPvComponentByOwner, { isLoading }] =
    useLazyGetAllCellPvComponentByOwnerQuery();

  const fetchData = async () => {
    try {
      await getAllCellPvComponentByOwner(undefined, true).unwrap();
    } catch (error) {
      console.log("erreur:get all PV Cell by owner ", error);
      if (error) {
        const error_custom: any = error;
        toast.error(
          error_custom?.data?.message ||
            "Erreur lors de la récupération des composants"
        );
      }
    }
  };

  useEffect(() => {
    // getData().then((data) => setData(data));
    fetchData();
  }, []);

  useEffect(() => {
    console.log("my data inside store: ", cellPVItems);
  });
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Dashboard App</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Cell Component</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="container mx-auto py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Gestionnaire de Modules PV
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Gérez votre base de données de modules photovoltaïques
          </p>
          <AddPvModuleModal />
        </div>

        <PVDataTable
          data={cellPVItems}
          filterConfigs={filterConfigs}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
