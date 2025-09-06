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
import { useLazyGetAllRegulatorComponentByOwnerQuery } from "@/redux/componentsManageApi/regulatorComponent/regulatorComponentApi";
import { useEffect, useState } from "react";

import { RegulatorDataTable } from "./regulator_table";
import AddRegulatorModal from "./add_regulator_modal";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function RegulatorComponentManagePage() {
  const regulatorItems = useSelector(
    (state: any) => state.regulatorComponent.items
  );
  const [getAllRegulatorComponentByOwner, { isLoading }] =
    useLazyGetAllRegulatorComponentByOwnerQuery();

  const fetchData = async () => {
    try {
      await getAllRegulatorComponentByOwner(undefined, true).unwrap();
    } catch (error) {
      console.log("erreur:get all regulator by owner ", error);
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
    fetchData();
  }, []);

  useEffect(() => {
    console.log("my data inside store: ", regulatorItems);
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
                <BreadcrumbPage>Regulator Component</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="container mx-auto py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Gestionnaire des Regulateurs
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Gérez votre base de données de régulateurs
          </p>
          <AddRegulatorModal />
        </div>

        <RegulatorDataTable
          data={regulatorItems}
          filterConfigs={filterConfigs}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
