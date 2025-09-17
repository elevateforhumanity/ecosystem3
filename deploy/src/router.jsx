import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DonatePage from "./pages/DonatePage";
import Government from "./pages/Government";
import Philanthropy from "./pages/Philanthropy";
import NotFound from "./pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/donate.html" element={<DonatePage />} />
      <Route path="/government" element={<Government />} />
      <Route path="/philanthropy" element={<Philanthropy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}