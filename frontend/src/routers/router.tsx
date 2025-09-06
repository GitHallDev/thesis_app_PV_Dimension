import React from "react";
import { Route, Routes } from "react-router";
import { publicRoutes, privateRoutes } from "./router.link";
import LoginPage from "@/auth/Login";
import Features from "@/Features";
import AuthFeatures from "@/AuthFeatures";
import SidebarPage from "@/core/common/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoutes from "@/components/autorisations/protectedRoutes";

const AllRoutes: React.FC = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster position="top-center" richColors />
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}

          {/* private routes */}
          <Route element={<ProtectedRoutes/>}>
          <Route element={<Features />}>
            <Route element={<SidebarPage />}>
              {privateRoutes.map((route, idx) => (
                <Route path={route.path} element={route.element} key={idx} />
              ))}
            </Route>
          </Route>
          </Route>
          {/* public routes */}
          <Route element={<AuthFeatures />}>
            {publicRoutes.map((route, idx) => (
              <Route path={route.path} element={route.element} key={idx} />
            ))}
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default AllRoutes;
