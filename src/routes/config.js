import { ROUTES } from "../utils/constants";

// Route Paths
export const ROUTE_PATHS = {
  // Public Routes
  HOME: ROUTES.HOME,
  NOT_FOUND: ROUTES.NOT_FOUND,

  // Auth Routes
  LOGIN: ROUTES.LOGIN,

  // Protected Routes
  PROFILE: ROUTES.PROFILE,
};

// Route Types
export const ROUTE_TYPES = {
  PUBLIC: "public",
  PROTECTED: "protected",
  AUTH: "auth",
};

// Route Utilities
export const createProfilePath = userId => ROUTES.PROFILE.replace(":userId", userId);

export const isProtectedRoute = pathname => {
  return pathname.startsWith("/profile/");
};

export const isAuthRoute = pathname => {
  return [ROUTE_PATHS.LOGIN].includes(pathname);
};

export const isPublicRoute = pathname => {
  return pathname === ROUTE_PATHS.HOME || pathname === ROUTE_PATHS.NOT_FOUND;
};
