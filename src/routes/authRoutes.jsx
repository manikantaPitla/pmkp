import { lazy } from "react";
import { ROUTE_PATHS } from "./config";

// Lazy load pages
const Login = lazy(() => import("../pages/Login"));
const Registration = lazy(() => import("../pages/Registration"));

export const authRoutes = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: Login,
  },
  {
    path: ROUTE_PATHS.REGISTRATION,
    element: Registration,
  },
];
