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

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App-simple.jsx";

// Add error handling
const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found!");
  document.body.innerHTML = "<h1>Error: Root element not found</h1>";
} else {
  try {
    createRoot(root).render(<App />);
    console.log("React app mounted successfully");
  } catch (error) {
    console.error("Error mounting React app:", error);
    root.innerHTML = `<h1>Error mounting React app</h1><pre>${error.message}</pre>`;
  }
}