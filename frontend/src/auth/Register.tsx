"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, User, Building, Sun } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { animate } from "animejs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegisterMutation } from "@/redux/userApi/authApi";

// shema de notre userForm
const Shema = z.object({
  nom: z.string().nonempty("Le nom est obligatoire"),
  prenom: z.string().nonempty("Le prenom est obligatoire"),
  email: z.string().email("L'email est invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  entreprise: z.string().optional(),
});

type FormData = z.infer<typeof Shema>;

const Register = ({ className, ...props }: React.ComponentProps<"div">) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const [register, { isLoading }] = useRegisterMutation();
  // 1. Define your form.
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(Shema),
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: FormData) => {
    // console.log(data);
    toast.promise(register(data).unwrap(), {
      loading: "Inscription en cours...",
      error: (error: any) => {
        console.error("Error:inscription ", error);
        if (error) {
          const error_custom: any = error;
          return error_custom?.data?.message || "Erreur lors de l'inscription";
        }
      },
      success: "Inscription réussie",
    });
  };

  useEffect(() => {
    if (animate && logoRef.current) {
      // Animate logo
      animate(logoRef.current, {
        rotate: [0, 360],
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1200,
        easing: "easeOutElastic(1, .8)",
        delay: 300,
      });
    }
  }, []);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (animate) {
      animate(e.target, {
        scale: [1, 1.02, 1],
        duration: 300,
        easing: "easeOutQuad",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div
        ref={formRef}
        className={cn("w-full max-w-4xl", className)}
        {...props}
      >
        <Card className="p-0 overflow-hidden shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
              className="p-6 md:p-12 space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="text-center space-y-2 form-field">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-sans">
                  Créer un compte
                </h1>
                <p className="text-muted-foreground">
                  Rejoignez Solar Dimension pour commencer
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 form-field">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    Prénom <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Jean"
                      className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary"
                      onFocus={handleInputFocus}
                      {...registerForm("prenom")}
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.prenom && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {errors.prenom.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 form-field">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Dupont"
                      className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary"
                      onFocus={handleInputFocus}
                      {...registerForm("nom")}
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.nom && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {errors.nom.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 form-field">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@exemple.com"
                    className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary"
                    onFocus={handleInputFocus}
                    {...registerForm("email")}
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 form-field">
                <Label htmlFor="company" className="text-sm font-medium">
                  Entreprise (optionnel)
                </Label>
                <div className="relative">
                  <Input
                    id="company"
                    type="text"
                    placeholder="Solar Tech Solutions"
                    className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary"
                    onFocus={handleInputFocus}
                    {...registerForm("entreprise")}
                  />
                  <Building className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.entreprise && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.entreprise.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 form-field">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary"
                    onFocus={handleInputFocus}
                    {...registerForm("password")}
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {isLoading ? (
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base transition-all duration-200 hover:shadow-lg form-field"
                  disabled
                >
                  Chargement...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base transition-all duration-200 hover:shadow-lg form-field"
                >
                  Créer mon compte
                </Button>
              )}

              <div className="text-center text-sm text-muted-foreground form-field">
                Déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium"
                >
                  Se connecter
                </Link>
              </div>
            </form>

            <div className="bg-gradient-to-br from-primary/10 to-amber-100 dark:from-primary/20 dark:to-gray-700 relative hidden md:flex items-center justify-center p-12">
              <div ref={logoRef} className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Sun className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Solar Dimension
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 max-w-sm">
                    Rejoignez des milliers d'ingénieurs qui font confiance à
                    notre plateforme
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground mt-6">
          En créant un compte, vous acceptez nos{" "}
          <Link
            to="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Conditions d'utilisation
          </Link>{" "}
          et notre{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Politique de confidentialité
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Register;
