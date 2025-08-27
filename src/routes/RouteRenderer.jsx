import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { publicRoutes, protectedRoutes, authRoutes } from "./index";
import { SquareLoader } from "../utils/loader";
import { ProtectedRoute as ProtectedRouteWrapper } from "../components";
import { AuthRedirect } from "../components";

const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%",
      backgroundColor: "#000000",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <SquareLoader />
    </div>
  </div>
);

const RouteRenderer = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(route => (
          <Route key={route.path} path={route.path} element={<route.element />} />
        ))}

        {/* Protected Routes */}
        {protectedRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRouteWrapper>
                <route.element />
              </ProtectedRouteWrapper>
            }
          />
        ))}

        {/* Auth Routes */}
        {authRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AuthRedirect>
                <route.element />
              </AuthRedirect>
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export default RouteRenderer;
