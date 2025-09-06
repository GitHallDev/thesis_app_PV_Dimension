import { BorderTrail } from "@/components/motion-primitives/border-trail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { LocationFeature } from "@/lib/mapbox/utils";
import Map from "@/location/map";
import { type TableData, Shema } from "./columns";
import {
  Plus,
  ImagePlus,
  Eye,
  EyeClosed,
  MapPin,
  LocateFixed,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  setSelectedLocation,
  setSelectedLocations,
} from "@/redux/map/mapSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createProject from "./createProject";
import {
  useCreateProjectMutation,
  useUploadProjectProfilMutation,
} from "@/redux/projectApi/projectApi";

export function CreateProjectSheet() {
  const dispatch = useDispatch();
  const selectedLocation = useSelector(
    (state: any) => state.map.selectedLocation
  );
  const [profilFile, setProfilFile] = useState<File | null>();
  const [open, setOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [createProject, { isLoading, error }] = useCreateProjectMutation();

  const [uploadProjectProfile] = useUploadProjectProfilMutation();
  // 1. Define your form.
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TableData>({
    resolver: zodResolver(Shema),
    defaultValues: {
      id: null,
      status: "En cours",
      profil_url: null,
    },
  });

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:4000/api/upload", {
      method: "POST",
      body: formData,
    });
  };

  // 2. Define a submit handler.
  const onSubmit = async (data: TableData) => {
    try {
      let responseProfile;
      if (profilFile) {
        const formData = new FormData();
        formData.append("file", profilFile);
        // console.log("data send: ", formData);
        responseProfile = await uploadProjectProfile(formData).unwrap();
      }
      console.log("profileResponse: ", responseProfile);
      // console.log("data recieved: ", data);
      toast.promise(
        createProject({ ...data, profil_url: responseProfile?.data }).unwrap(),
        {
          loading: "Création en cours...",
          error: (error: any) => {
            console.error("Error:create project", error);
            if (error) {
              const error_custom: any = error;
              return (
                error_custom?.data?.message ||
                "Erreur lors de la création du projet"
              );
            }
          },
          success: () => {
            setOpen(false);
            return "Projet créé avec success";
          },
        }
      );
    } catch (error) {
      console.log("Error: Create projet ", error);

      const error_custom: any = error;
      toast.error(
        error_custom?.data?.message || "Erreur lors de la création du projet"
      );
    }
  };
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

      const coordinates: [number, number] = [lng, lat];

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
    });
  };

  useEffect(() => {
    if (!selectedLocation || selectedLocation === null) return;

    if (watch("longitude") !== selectedLocation?.geometry?.coordinates[0])
      setValue("longitude", selectedLocation?.geometry?.coordinates[0]);
    if (watch("latitude") !== selectedLocation?.geometry?.coordinates[1])
      setValue("latitude", selectedLocation?.geometry?.coordinates[1]);
  }, [selectedLocation]);

  // mettreà jour la longitude dans notre store
  useEffect(() => {
    if (isNaN(watch("longitude"))) return;

    const coordinates: [number, number] = [
      watch("longitude"),
      watch("latitude"),
    ];
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
  }, [watch("longitude")]);

  // mettreà jour la latidude dans notre store
  useEffect(() => {
    if (isNaN(watch("latitude"))) return;
    const coordinates: [number, number] = [
      watch("longitude"),
      watch("latitude"),
    ];
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
  }, [watch("latitude")]);

  // useEffect(() => {
  //   console.log("errors: ", errors);
  // }, [errors]);

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="  relative inline-flex bg-transparent items-center text-black dark:text-white gap-2  hover:cursor-pointer hover:bg-transparent "
        >
          <BorderTrail
            className="bg-linear-to-l from-blue-300 via-orange-500 to-blue-300 animate-pulse blur-xl hover:blur-3xl dark:from-orange-500 dark:via-blue-500 dark:to-blue-700  "
            size={300}
          />
          <Plus className="w-4 h-4" />
          Créer Projet
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[900px]  flex flex-col">
        <SheetHeader>
          <SheetTitle>Créer Projet</SheetTitle>
          <SheetDescription>
            Créez vos projets ici. Cliquez sur créer quand vous serez prêt.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-4"
          id="create-project-form"
        >
          {/*Upload Section   */}
          <div className=" mt-4 flex flex-wrap items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300">
              {profilFile &&
              ["image/jpeg", "image/png", "image/svg+xml"].includes(
                profilFile.type
              ) ? (
                <img
                  src={URL.createObjectURL(profilFile)}
                  alt="Project profile"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <ImagePlus className="text-gray-400" />
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                  Upload
                  <input
                    type="file"
                    // multiple
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.svg"
                    onChange={(e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files && files.length > 0) {
                        setProfilFile(files[0]);
                      }
                      // setProfilFile(e.target.files[0]||null);
                    }}
                    // {...register("profil_url")}
                  />
                </label>
                <Link
                  to="#"
                  className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  onClick={() => setProfilFile(null)}
                >
                  Remove
                </Link>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Upload image max 4MB, formats JPG, PNG, SVG
              </p>
            </div>
          </div>
          {/* /Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-4">
            <div className="space-y-2">
              <Label htmlFor="sheet-demo-name">
                Nom projet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sheet-demo-name"
                placeholder="ex. Pedri Home's"
                {...register("project_name")}
              />
              {errors.project_name && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.project_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sheet-demo-username">Nom Client </Label>
              <Input
                id="sheet-demo-username"
                placeholder="ex. M. Pedri Amadou"
                {...register("customer_name")}
              />
              {errors.customer_name && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.customer_name.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex  items-center justify-between py-4">
            <h2>Localisation du site</h2>
            <Button
              variant={showMap ? "outline" : "default"}
              className="border border-primary hover:cursor-pointer hover:scale-110 text-center"
              size="lg"
              onClick={() => setShowMap((prev) => !prev)}
            >
              {showMap ? (
                <>
                  <EyeClosed /> Masquer
                </>
              ) : (
                <>
                  <Eye /> Voir
                </>
              )}{" "}
              la carte
            </Button>
          </div>
          {/* ✅ Zone Map */}
          {showMap && (
            <div className=" relative mt-4 h-[400px] sm:h-[600px]  rounded-md  border">
              <Map />
            </div>
          )}
          <div className="bg-gray-50 bg-opacity-30  border-2 border-gray-500 my-4 p-4 rounded-lg dark:bg-gray-500">
            <div className="text-sm text-blue-300 flex items-center justify-between mb-4 text-center">
              <div className="flex items-center">
                <MapPin className="size-4 mx-2" />
                <strong> Localisation infos</strong>
              </div>
              <div className="bg-primary p-1 hover:cursor-pointer rounded-sm">
                {" "}
                <Link
                  to="#"
                  // size="icon"
                  onClick={handleGeolocation}
                >
                  <LocateFixed className=" text-white " />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4">
              <div className="space-y-2">
                <Label htmlFor="sheet-demo-name">
                  Longitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sheet-demo-name"
                  // type="number"
                  // step="0.00001"
                  placeholder="ex. -7.04443"
                  {...register("longitude", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.longitude && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sheet-demo-username">
                  Latidude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sheet-demo-username"
                  placeholder="ex. 12.04442"
                  // type="number"
                  // step="0.00001"
                  {...register("latitude", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.latitude && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.latitude.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sheet-demo-username">
                  Altitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sheet-demo-username"
                  placeholder="ex. 12"
                  // type="number"
                  // step="0.01"
                  {...register("hauteur", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.hauteur && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.hauteur.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="  ">
                Nom localisation <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="ex. Bamako Hippodrome 1 Rue 300 Porte 133 "
                className="h-9 text-sm"
                {...register("location_name")}
              />
              {errors.location_name && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.location_name.message}
                </p>
              )}
            </div>
          </div>
        </form>

        <SheetFooter className="flex ">
          <Button
            type="submit"
            form="create-project-form" // 👈 relie le bouton au form
            className="bg-green-600 hover:bg-green-800 hover:cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Création en cours..." : " Créer Projet"}
          </Button>
          <SheetClose asChild>
            <Button className="border border-red-500 bg-transparent text-red-500 hover:text-white hover:bg-red-500 hover:cursor-pointer">
              Annuler
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
