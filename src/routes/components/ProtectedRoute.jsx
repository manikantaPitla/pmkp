import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute as ProtectedRouteWrapper } from "../../components";

const ProtectedRouteComponent = ({ path, element: Element }) => {
  return (
    <Route
      path={path}
      element={
        <ProtectedRouteWrapper>
          <Element />
        </ProtectedRouteWrapper>
      }
    />
  );
};

export default ProtectedRouteComponent;
