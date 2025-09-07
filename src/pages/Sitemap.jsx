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
export default function Sitemap() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Site Map</h1>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/courses">Course Library</a></li>
        <li><a href="/student">Student Portal</a></li>
        <li><a href="/instructor">Instructor Portal</a></li>
        <li><a href="/analytics">Analytics</a></li>
        <li><a href="/ecosystem">Ecosystem</a></li>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
        <li><a href="/refund-policy">Refund Policy</a></li>
        <li><a href="/terms-of-service">Terms of Service</a></li>
        <li><a href="/accessibility">Accessibility</a></li>
        <li><a href="/student-handbook">Student Handbook</a></li>
      </ul>
      <img
        src="/images/handbook-cover.jpg"
        alt="Elevate for Humanity Student Handbook cover"
        title="Student Handbook - Elevate for Humanity"
        style={{ width: "100%", borderRadius: 8 }}
      />
      <footer style={{ marginTop: 48, textAlign: "center", color: "#888" }}>
        <div>
          <a href="/privacy-policy">Privacy Policy</a> |{" "}
          <a href="/refund-policy">Refund Policy</a> |{" "}
          <a href="/terms-of-service">Terms of Service</a> |{" "}
          <a href="/accessibility">Accessibility</a> |{" "}
          <a href="/sitemap">Sitemap</a>
        </div>
      </footer>
    </main>
  );
}