import React, { useEffect, useState } from "react";
import { BorderTrail } from "@/components/motion-primitives/border-trail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Eye, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useGetProjectQuery } from "@/redux/projectApi/projectApi";
import { Link } from "react-router-dom";
import { type TableData } from "./columns";
import { api_path } from "@/environement";

interface ProjectDetailsProps {
  projectId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ProjectDetailsSheet: React.FC<ProjectDetailsProps> = ({
  projectId,
  open,
  setOpen,
}) => {
  const {
    data: project,
    isLoading,
    error,
  } = useGetProjectQuery(projectId, { skip: !open });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && error) {
      toast.error("Erreur lors du chargement des détails du projet");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non défini";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    console.log("Project: ", project);
  }, project);
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-[900px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Détails du Projet</SheetTitle>
          <SheetDescription>
            Informations détaillées sur le projet.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p>Chargement des détails du projet...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500">
            <p>Erreur lors du chargement des détails du projet</p>
          </div>
        ) : project ? (
          <div className="flex-1 overflow-y-auto p-4">
            {/* Image du projet */}
            {project?.data?.profil_url && (
              <div className="mb-6 flex justify-center">
                <div className="h-48 w-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  <img
                    src={`${api_path}/uploads/${project.data.profil_url}`}
                    alt={`Image du projet ${project.data.project_name}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Informations générales */}
            <Card className="mb-6">
              <CardHeader>
                <h3 className="text-xl font-semibold flex items-center">
                  <BorderTrail
                    className="bg-linear-to-l from-blue-300 via-orange-500 to-blue-300 animate-pulse blur-xl dark:from-orange-500 dark:via-blue-500 dark:to-blue-700"
                    size={100}
                  />
                  Informations générales
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nom du projet</Label>
                    <p className="text-base">{project.data?.project_name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nom du client</Label>
                    <p className="text-base">
                      {project.data?.customer_name || "Non spécifié"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Statut</Label>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === "En cours"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {project.data?.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Date de création
                    </Label>
                    <p className="text-base">{formatDate(project.data?.createdAt)}</p>
                  </div>

                  {/* <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Dernière mise à jour
                    </Label>
                    <p className="text-base">{formatDate(project.updatedAt)}</p>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* Localisation */}
            <Card className="mb-6">
              <CardHeader>
                <h3 className="text-xl font-semibold flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Localisation
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nom du site</Label>
                    <p className="text-base">{project.data?.location_name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Coordonnées</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Longitude
                        </span>
                        <p className="text-sm font-mono">{project.data?.longitude}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Latitude
                        </span>
                        <p className="text-sm font-mono">{project.data?.latitude}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Altitude
                        </span>
                        <p className="text-sm font-mono">{project.data?.hauteur} m</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lien vers la carte */}
                <div className="mt-4">
                  <Link
                    to="/map"
                    className="text-sm text-primary hover:underline flex items-center"
                    state={{
                      longitude: project.longitude,
                      latitude: project.latitude,
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Voir sur la carte
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Aucune donnée disponible</p>
          </div>
        )}

        <SheetFooter>
          <SheetClose asChild>
            <Button className="border border-gray-300 bg-transparent text-gray-700 hover:text-black hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 hover:cursor-pointer">
              Fermer
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
