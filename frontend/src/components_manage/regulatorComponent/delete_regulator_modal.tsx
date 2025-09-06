import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import { animate } from "animejs";
import { useDeleteRegulatorComponentMutation } from "@/redux/componentsManageApi/regulatorComponent/regulatorComponentApi";
import { Button } from "@/components/ui/button";

export default function DeleteRegulatorModal({
  open,
  setOpen,
  idComponent,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  idComponent: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Ouverture
  const animateIn = () => {
    if (!contentRef.current) return;
    animate(contentRef.current, {
      scale: [0.9, 1],
      translateY: ["100%", "0%"],
      filter: ["blur(10px)", "blur(0px)"],
      opacity: [0, 1],
      duration: 400,
      easing: "spring(1, 80, 10, 0)",
    });
  };

  // Fermeture
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

  // 1. Delete the mutation

  const [deleteRegulatorComponent, { isLoading }] =
    useDeleteRegulatorComponentMutation();

  //   fonction pour supprimer un composant
  const onDelete = async () => {
    toast.promise(deleteRegulatorComponent(idComponent).unwrap(), {
      loading: "Suppression en cours...",
      error: (error: any) => {
        console.error("Error:delete regulator pv ", error);
        if (error) {
          const error_custom: any = error;
          return (
            error_custom?.data?.message ||
            "Erreur lors de la suppression du composant"
          );
        }
      },
      success: () => {
        setOpen(false);
        return "Composant regulateur supprimé avec success";
      },
    });
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
        <DialogContent
          ref={contentRef}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white border-0 shadow-2xl dark:bg-zinc-900 p-4"
        >
          <DialogHeader className="space-y-3 p-3 pb-4 border-b border-zinc-100 dark:border-zinc-800 text-center">
            <DialogTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
              Supprimer un regulateur
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
              Êtes-vous sûr de vouloir supprimer ce regulateur ? Cette action
              est{" "}
              <span className="font-semibold text-red-600">irréversible</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3 mt-4">
            {isLoading ? (
              <Button
                disabled
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Suppression...
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onDelete();
                }}
                className="bg-red-600  border border-red-600 hover:bg-transparent hover:text-red-600  hover:cursor-pointer text-white"
              >
                Supprimer
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setOpen(false)}
              className="border border-gray-300 hover:cursor-pointer"
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Version mobile Drawer
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-red-600">
            Supprimer un régulateur
          </DrawerTitle>
          <DrawerDescription>
            Êtes-vous sûr de vouloir supprimer ce régulateur ? Cette action est
            irréversible.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex gap-3 pt-2">
          {isLoading ? (
            <Button disabled className="bg-red-600 hover:bg-red-700 text-white">
              Supprission...
            </Button>
          ) : (
            <Button
              onClick={() => {
                onDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white flex-1"
            >
              Supprimer
            </Button>
          )}
          <DrawerClose asChild>
            <Button className="border border-gray-300 bg-transparent flex-1">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
