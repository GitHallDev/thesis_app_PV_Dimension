import { Route } from "react-router";
import { all_routes } from "./all_routes";

// auth elements
import LoginPage from "@/auth/Login";
import Register from "@/auth/Register";
import ForgotPasssword from "@/auth/ForgotPassword";
import RecoverPassword from "@/auth/RecoverPassword";

// map element
import Map from "@/location/map";
import Profil from "@/auth/Profil";
import App from "@/App";
import CreateProject from "@/projects/createProject";
import CellPVComponentManagePage from "@/components_manage/cellPVComponent";
import Dashboard from "@/dashboard";
import InverterComponentManagePage from "@/components_manage/inverterComponent";
import RegulatorComponentManagePage from "@/components_manage/regulatorComponent";
import ProjectManagePage from "@/projects";
const routes = all_routes;

export const publicRoutes = [
  { path: "/", element: <App />, route: Route, permissions: [] },
  { path: routes.Home, element: <App />, route: Route, permissions: [] },
  { path: routes.login, element: <LoginPage />, route: Route, permissions: [] },
  {
    path: routes.register,
    element: <Register />,
    route: Route,
    permissions: [],
  },
  {
    path: routes.forgotPassword,
    element: <ForgotPasssword />,
    route: Route,
    permissions: [],
  },
  {
    path: routes.recoverPassword,
    element: <RecoverPassword />,
    route: Route,
    permissions: [],
  },
];

export const privateRoutes = [
  {
    path: routes.dashboard,
    element: <Dashboard />,
    route: Route,
    permissions: [],
  },
  {
    path: routes.map,
    element: <Map />,
    route: Route,
    permissions: [],
  },
  {
    path: routes.profileSetting,
    element: <CreateProject />,
    // <Profil />,
    route: Route,
    permissions: [],
  },
  {
    path: routes.manageCellPV,
    element: <CellPVComponentManagePage />,
    route: Route,
    permissions: [],
  },
  {
    path: routes.manageInverter,
    element: <InverterComponentManagePage />,
    route: Route,
    permissions: [],
  },
  {
    path: routes.manageRegulator,
    element: <RegulatorComponentManagePage />,
    route: Route,
    permissions: [],
  },
  {
    path: routes.manageProject,
    element: <ProjectManagePage />,
    // <CreateProject />,
    route: Route,
    permissions: [],
  },
];
