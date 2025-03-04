import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DefaultPage from "./pages/DefaultPage";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/profile/:userId" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "15px",
            padding: "6px 10px",
            fontSize: "14px",
          },
        }}
      />
    </>
  );
}

export default App;
