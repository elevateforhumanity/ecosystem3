/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React from "react";

export default function Certificates() {
  return (
    <main style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}>
      <h1>Certificates</h1>
      <ul>
        <li>
          <strong>AI for Beginners</strong> – <button>Download PDF</button>
        </li>
        <li>
          <strong>Workforce Readiness</strong> – <button>Download PDF</button>
        </li>
      </ul>
      {/* TODO: Generate and download certificates */}
    </main>
  );
}