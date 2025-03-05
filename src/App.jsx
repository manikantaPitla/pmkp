import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DefaultPage from "./pages/DefaultPage";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRedirect>
              <DefaultPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
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
      </Routes>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: "10px",
            padding: "6px 10px",
            fontSize: "14px",
          },
        }}
      />
    </>
  );
}

export default App;
