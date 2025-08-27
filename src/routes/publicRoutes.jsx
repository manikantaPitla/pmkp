import { lazy } from "react";
import { ROUTE_PATHS } from "./config";

// Lazy load pages
const DefaultPage = lazy(() => import("../pages/DefaultPage"));
const NotFound = lazy(() => import("../components/NotFound"));

export const publicRoutes = [
  {
    path: ROUTE_PATHS.HOME,
    element: DefaultPage,
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    element: NotFound,
  },
];
