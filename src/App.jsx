/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import AccessibilitySettings from "./components/AccessibilitySettings";
import "./styles/accessibility.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const Government = lazy(() => import("./pages/Government"));
const Philanthropy = lazy(() => import("./pages/Philanthropy"));
const Compliance = lazy(() => import("./pages/Compliance"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AskWidget = lazy(() => import('./components/AskWidget'));
const NavBar = lazy(() => import('./components/NavBar'));

export default function App() {
  return (
    <HelmetProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
              <NavBar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/government" element={<Government />} />
                <Route path="/philanthropy" element={<Philanthropy />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AskWidget />
              <AccessibilitySettings />
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </AccessibilityProvider>
    </HelmetProvider>
  );
}
