import React from "react";
import { Route, Routes } from "react-router-dom";
import { DefaultPage, Login, Home } from "./pages";

import { Toaster } from "react-hot-toast";
import { NotFound, AuthRedirect, ProtectedRoute } from "./components";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <AuthRedirect>
              <DefaultPage />
            </AuthRedirect>
          }
        />

        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "10px",
            padding: "6px 10px",
            fontSize: "12px",
            textAlign: "center",
          },
        }}
      />
    </>
  );
}

export default App;
