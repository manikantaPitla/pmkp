import { lazy } from "react";
import { ROUTE_PATHS } from "./config";

// Lazy load pages
const Login = lazy(() => import("../pages/Login"));

export const authRoutes = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: Login,
  },
];
