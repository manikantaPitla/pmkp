import { lazy } from "react";
import { ROUTE_PATHS } from "./config";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));

export const protectedRoutes = [
  {
    path: ROUTE_PATHS.PROFILE,
    element: Home,
  },
];
