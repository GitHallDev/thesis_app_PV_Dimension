import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Shema, type TableData } from "./columns";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BorderTrail } from "@/components/motion-primitives/border-trail";
import { animate } from "animejs";
import { useCreateCellPvComponentMutation } from "@/redux/componentsManageApi/cellPVComponent/cellPVComponentApi";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

const PVTechnology = {
  Monocristallin: "Monocristallin",
  Polycristallin: "Polycristallin",
  CIS_CIGS: "CIS/CIGS",
  CdTe: "CdTe",
  Organique: "Organique",
};

export const PVForm = ({
  isDesktop,
  open,
  setOpen,
}: {
  isDesktop: boolean;
  open: boolean;
  setOpen: any;
}) => {
  // 1. Create the mutation

  const [createCellPvComponent, { isLoading, error }] =
    useCreateCellPvComponentMutation();

  const [showAdvanced, setShowAdvanced] = useState(false);
  // 1. Define your form.
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TableData>({
    resolver: zodResolver(Shema),
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: TableData) => {
    toast.promise(createCellPvComponent(data).unwrap(), {
      loading: "Création en cours...",
      error: (error: any) => {
        console.error("Error:create cell pv ", error);
        if (error) {
          const error_custom: any = error;
          return (
            error_custom?.data?.message ||
            "Erreur lors de la création du composant"
          );
        }
      },
      success: () => {
        setOpen(false);
        return "Composant cellule PV créé avec success";
      },
    });
  };

  useEffect(() => {
    // if (!open) {
    reset({ id: null });
    // }
  }, [open]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6 p-6 overflow-y-auto"
    >
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">
          Informations principales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="fabricant"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Fabricant
            </Label>
            <Input
              id="fabricant"
              placeholder="Ex: SunPower, LG Solar..."
              className="h-10"
              {...register("fabricant")}
            />
            {errors.fabricant && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.fabricant.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="model"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Modèle
            </Label>
            <Input
              id="model"
              placeholder="Ex: SPR-X22-370"
              className="h-10"
              {...register("model")}
            />
            {errors.model && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.model.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Technologie
          </Label>
          <Controller
            name="technologie"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Sélectionnez une technologie" />
                </SelectTrigger>
                <SelectContent className="z-[19999]">
                  <SelectGroup>
                    <SelectLabel className="px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Technologies disponibles
                    </SelectLabel>
                    {Object.values(PVTechnology).map((tech) => (
                      <SelectItem
                        key={tech}
                        value={tech}
                        className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      >
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.technologie && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.technologie.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="puissance_crete"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Puissance crête (Wc)
            </Label>
            <Input
              id="puissance_crete"
              type="number"
              placeholder="370"
              className="h-10"
              {...register("puissance_crete", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            {errors.puissance_crete && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.puissance_crete.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="rendement_module"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Rendement (%)
            </Label>
            <Input
              id="rendement_module"
              type="number"
              step="0.01"
              placeholder="22.8"
              className="h-10"
              {...register("rendement_module", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            {errors.rendement_module && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.rendement_module.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="prix"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Prix (FCFA)
            </Label>
            <Input
              id="prix"
              type="number"
              step="0.01"
              placeholder="450.00"
              className="h-10"
              {...register("prix", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            {errors.prix && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.prix.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 py-4 border-t border-zinc-100 dark:border-zinc-800">
        <Checkbox
          id="showAdvanced"
          checked={showAdvanced}
          onCheckedChange={(checked) => setShowAdvanced(!!checked)}
          className="h-4 w-4"
        />
        <Label
          htmlFor="showAdvanced"
          className="text-sm font-medium cursor-pointer flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Paramètres avancés
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </Label>
      </div>

      {showAdvanced && (
        <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
              Caractéristiques électriques
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Tension Pmax (V)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="37.2"
                  className="h-9 text-sm"
                  {...register("tension_puissance_maximale", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />{" "}
                {errors.tension_puissance_maximale && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.tension_puissance_maximale.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Courant Pmax (A)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="9.95"
                  className="h-9 text-sm"
                  {...register("courant_puissance_maximale", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.courant_puissance_maximale && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.courant_puissance_maximale.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Tension à vide (Voc)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="45.5"
                  className="h-9 text-sm"
                  {...register("tension_a_vide", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.tension_a_vide && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.tension_a_vide.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Courant court-circuit (Isc)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="10.6"
                  className="h-9 text-sm"
                  {...register("courant_court_circuit", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.courant_court_circuit && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.courant_court_circuit.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
              Dimensions et spécifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Longueur (mm)
                </Label>
                <Input
                  type="number"
                  placeholder="1690"
                  className="h-9 text-sm"
                  {...register("dimension_module_longueur", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.dimension_module_longueur && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.dimension_module_longueur.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Largeur (mm)
                </Label>
                <Input
                  type="number"
                  placeholder="1046"
                  className="h-9 text-sm"
                  {...register("dimension_module_largeur", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.dimension_module_largeur && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.dimension_module_largeur.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Hauteur (mm)
                </Label>
                <Input
                  type="number"
                  placeholder="40"
                  className="h-9 text-sm"
                  {...register("dimension_module_hauteur", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.dimension_module_hauteur && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.dimension_module_hauteur.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Poids (kg)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="18.5"
                  className="h-9 text-sm"
                  {...register("poids_module", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.poids_module && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.poids_module.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Nombre de cellules
                </Label>
                <Input
                  type="number"
                  placeholder="96"
                  className="h-9 text-sm"
                  {...register("nombre_cellule", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.nombre_cellule && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.nombre_cellule.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Rendement cellule (%)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="24.2"
                  className="h-9 text-sm"
                  {...register("rendement_cellule", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.rendement_cellule && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.rendement_cellule.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
              Coefficients de température
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Coeff. T° Courant
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.05"
                  className="h-9 text-sm"
                  {...register("coefficient_temperature_courant", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.coefficient_temperature_courant && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.coefficient_temperature_courant.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Coeff. T° Tension
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="-0.29"
                  className="h-9 text-sm"
                  {...register("coefficient_temperature_tension", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.coefficient_temperature_tension && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.coefficient_temperature_tension.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                  Coeff. T° Puissance
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="-0.38"
                  className="h-9 text-sm"
                  {...register("coefficient_temperature_puissance", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.coefficient_temperature_puissance && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.coefficient_temperature_puissance.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                Tolérance de puissance (%)
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="±3"
                className="h-9 text-sm"
                {...register("tolerance_puissance", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              {errors.tolerance_puissance && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.tolerance_puissance.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                Plage de température
              </Label>
              <Input
                type="text"
                placeholder="-40°C à +85°C"
                className="h-9 text-sm"
                {...register("plage_temperature_fonctionnement")}
              />
              {errors.plage_temperature_fonctionnement && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.plage_temperature_fonctionnement.message}
                </p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs text-zinc-600 dark:text-zinc-400">
                Conditions de test standard
              </Label>
              <Input
                type="text"
                placeholder="STC: 1000 W/m², 25°C, AM 1.5"
                className="h-9 text-sm"
                {...register("condition_standard_test")}
              />
              {errors.condition_standard_test && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.condition_standard_test.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-6 gap-4 border-t border-zinc-100 dark:border-zinc-800">
        {isDesktop && (
          <Button
            type="button"
            //   variant="destructive"
            onClick={() => {
              setOpen(false);
              reset();
            }}
            className="w-full md:w-auto bg-transparent border border-red-600 text-red-600 font-medium  hover:text-white hover:bg-red-600 px-8 py-2.5 rounded-5 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-8 py-2.5 rounded-5 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Ajout en cours..." : "Ajouter le module"}
        </Button>
      </div>
    </form>
  );
};

export default function AddPvModuleModal() {
  const contentRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fonction d’ouverture
  const animateIn = () => {
    if (!contentRef.current) return;
    animate(contentRef.current, {
      scale: [0.9, 1],
      translateY: ["100%", "0%"],
      filter: ["blur(10px)", "blur(0px)"],
      opacity: [0, 1],
      duration: 400,
      easing: "spring(1, 80, 10, 0)", // spring-like easing
    });
  };

  // Fonction de fermeture
  const animateOut = (onFinish: () => void) => {
    if (!contentRef.current) return;
    animate(contentRef.current, {
      scale: [1, 0.9],
      translateY: ["0%", "100%"],
      filter: ["blur(0px)", "blur(10px)"],
      opacity: [1, 0],
      duration: 300,
      easing: "easeInQuad",
    });
    onFinish();
  };

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (newOpen) {
            animateIn();
          } else {
            animateOut(() => setOpen(false));
          }
        }}
      >
        <DialogTrigger>
          <Button
            size="lg"
            className="  relative inline-flex bg-transparent items-center text-black dark:text-white gap-2  hover:cursor-pointer hover:bg-transparent "
          >
            <BorderTrail
              className="bg-linear-to-l from-blue-300 via-orange-500 to-blue-300 animate-pulse blur-xl hover:blur-3xl dark:from-orange-500 dark:via-blue-500 dark:to-blue-700  "
              size={300}
            />
            <Plus className="w-4 h-4" />
            Ajouter Cellule
          </Button>
        </DialogTrigger>

        <DialogContent
          ref={contentRef}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl dark:bg-zinc-900 p-4"
        >
          <DialogHeader className="space-y-3 p-3 pb-4 border-b border-zinc-100 dark:border-zinc-800 text-center">
            <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-white">
              Ajouter une nouvelle cellule PV
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
              Configurez les spécifications techniques de votre module
              photovoltaïque
            </DialogDescription>
          </DialogHeader>
          <PVForm isDesktop={isDesktop} open={open} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="  relative inline-flex bg-transparent items-center text-black dark:text-white gap-2  hover:cursor-pointer hover:bg-transparent "
        >
          <BorderTrail
            className="bg-linear-to-l from-blue-300 via-orange-500 to-blue-300 animate-pulse blur-xl hover:blur-3xl dark:from-orange-500 dark:via-blue-500 dark:to-blue-700  "
            size={300}
          />
          <Plus className="w-4 h-4" />
          Ajouter Cellule
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle> Ajouter une nouvelle cellule PV</DrawerTitle>
          <DrawerDescription>
            Configurez les spécifications techniques de votre module
            photovoltaïque
          </DrawerDescription>
        </DrawerHeader>
        <PVForm isDesktop={isDesktop} open={open} setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button className="border border-destructive text-destructive bg-transparent hover:bg-red-500 hover:text-white">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
