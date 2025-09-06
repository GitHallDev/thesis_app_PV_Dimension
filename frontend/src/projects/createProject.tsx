import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { InfoIcon, ArrowLeftIcon, ArrowRightIcon, Loader2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OrientationDial from "@/components/orientationDial";
import InclinationDial from "@/components/inclinationDial";

const createProject = () => {
  // Initalisation des states nécessaire
  const [currentStep, setCurrentStep] = useState(1);
  const maxStep = 6;

  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // test
  const [inclination, setInclination] = useState(0);
  const [orientation, setOrientation] = useState(0);

  const nextStep = () => {
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  // fonction pour lancer le calcul
  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
    }, 3000);
  };

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
                <BreadcrumbLink href="#">
                  {/* Building Your Application */}
                  Dashboard App
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {/* Data Fetching */}
                  Create Project
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Calculateur Solaire Interactif
            </h2>
            <p className="text-xl">
              Suivez ces étapes simples pour dimensionner votre installation
              solaire
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Étape {currentStep} sur {maxStep}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round((currentStep / maxStep) * 100)}%
              </span>
            </div>
            <Progress value={(currentStep / maxStep) * 100} className="h-2" />
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <i className="fas fa-cog mr-3 text-primary"></i>
                {currentStep === 1 && "Surface Disponible"}
                {currentStep === 2 && "Inclinaison & Orientation"}
                {currentStep === 3 && "Localisation Géographique"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surface disponible pour l'installation (m²)
                    </label>
                    <Input
                      type="number"
                      placeholder="Ex: 50"
                      //   value={formData.surface}
                      onChange={() => {}}
                      className="text-lg p-4"
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 flex">
                      {/* <i className="fas fa-info-circle mr-2"></i> */}
                      <InfoIcon className="size-4" />
                      Mesurez la surface de votre toiture ou terrain disponible
                      pour l'installation des panneaux solaires.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <>
                  <div className="flex ">
                    <InclinationDial
                      inclination={inclination}
                      onChange={setInclination}
                    />
                    <OrientationDial
                      orientation={orientation}
                      onChange={setOrientation}
                    />
                  </div>
                </>
              )}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="!rounded-button whitespace-nowrap cursor-pointer"
                >
                  <ArrowLeftIcon />
                  Précédent
                </Button>

                {currentStep < maxStep ? (
                  <Button
                    onClick={nextStep}
                    className="!rounded-button whitespace-nowrap cursor-pointer bg-orange-500 hover:bg-orange-600"
                  >
                    Suivant
                    <ArrowRightIcon />
                  </Button>
                ) : (
                  <Button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="!rounded-button whitespace-nowrap cursor-pointer bg-green-500 hover:bg-green-600"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="size-4 shrink-0 text-primary animate-spin" />
                        Calcul en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calculator mr-2"></i>
                        Calculer
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default createProject;
