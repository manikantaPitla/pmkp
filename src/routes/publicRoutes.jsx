import { lazy } from "react";
import { ROUTE_PATHS } from "./config";

// Lazy load pages
const QuickChat = lazy(() => import("../pages/QuickChat"));
const NotFound = lazy(() => import("../components/NotFound"));

export const publicRoutes = [
  {
    path: ROUTE_PATHS.HOME,
    element: QuickChat,
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    element: NotFound,
  },
];
