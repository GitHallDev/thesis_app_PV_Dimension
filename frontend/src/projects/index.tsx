// src/components_manage/projects/index.tsx

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
import { filterConfigs } from "./columns";
import { useLazyGetAllProjectByOwnerQuery } from "@/redux/projectApi/projectApi";
import { useEffect, useRef } from "react";

import { toast } from "sonner";
import { useSelector } from "react-redux";
import { ProjectDataTable } from "./project_table";
import { CreateProjectSheet } from "./create_project_sheet";
// import { useAppSelector } from "@/redux/store";

export default function ProjectManagePage() {

  const projectItems = useSelector((state: any) => state.project.items);
  const [getAllProjectByOwner, { isLoading }] =
    useLazyGetAllProjectByOwnerQuery();

  const fetchData = async () => {
    try {
      await getAllProjectByOwner(undefined, true).unwrap();
    } catch (error) {
      console.log("erreur:get project by owner ", error);
      if (error) {
        const error_custom: any = error;
        toast.error(
          error_custom?.data?.message ||
            "Erreur lors de la récupération des projets"
        );
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("my data inside store: ", projectItems);
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
                <BreadcrumbPage>Project management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="container mx-auto py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Gestionnaire de Projet
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Gérez votre base de données de projets
          </p>
            <CreateProjectSheet />
        </div>

        <ProjectDataTable
          data={projectItems}
          filterConfigs={filterConfigs}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
