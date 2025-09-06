"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Sun } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { animate } from "animejs";

import { useLoginMutation } from "@/redux/userApi/authApi";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { all_routes } from "@/routers/all_routes";

// shema de notre userForm
const Shema = z.object({
  email: z.string().email("L'email est invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type FormData = z.infer<typeof Shema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const routes = all_routes;
  const [showPassword, setShowPassword] = React.useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  const [login, { isLoading }] = useLoginMutation();
  // 1. Define your form.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(Shema),
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: FormData) => {
    // console.log(data);
    toast.promise(login(data).unwrap(), {
      loading: "Connexion en cours...",
      error: (error: any) => {
        console.error("Error:connexion ", error);
        if (error) {
          const error_custom: any = error;
          return error_custom?.data?.message || "Erreur lors de la connexion";
        }
      },
      success: () => {
        navigate(routes.dashboard);
        return "Connexion réussie";
      },
    });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
    <div className={cn("w-full max-w-4xl", className)} {...props}>
      <Card className="p-0 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-8 md:p-12 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-sans">
                Bon retour
              </h1>
              <p className="text-muted-foreground">
                Connectez-vous à votre compte Solar Dimension
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@solardimension.com"
                    className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary"
                    onFocus={handleInputFocus}
                    {...register("email")}
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe <span className="text-red-500">*</span>
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 underline-offset-2 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10 h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary"
                    onFocus={handleInputFocus}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <Button
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base transition-all duration-200 hover:shadow-lg"
                disabled
              >
                Connexion...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base transition-all duration-200 hover:shadow-lg"
              >
                Se connecter
              </Button>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium"
              >
                Créer un compte
              </Link>
            </div>
          </form>

          <div className="h-full  bg-gradient-to-br from-primary/10 to-amber-100 dark:from-primary/20 dark:to-gray-700 relative hidden md:flex items-center justify-center p-12">
            <div ref={logoRef} className="text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Sun className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Solar Dimension
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-sm">
                  Concevez et simulez vos systèmes photovoltaïques avec
                  précision et efficacité
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground mt-6">
        En continuant, vous acceptez nos{" "}
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
  );
}
