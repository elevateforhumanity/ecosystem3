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
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";

const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const Quiz = lazy(() => import("./pages/Quiz"));
const MentorDirectory = lazy(() => import("./pages/sisters/MentorDirectory"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Home() {
  return (
    <div>
      <h1>Elevate</h1>
      <nav><Link to="/about">About</Link></nav>
    </div>
  );
}
function About() {
  return <h2>About</h2>;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/mentors" element={<MentorDirectory />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  );
}
