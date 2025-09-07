/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React from "react";

export default function Notifications() {
  return (
    <main style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}>
      <h1>Notifications</h1>
      <ul>
        <li>New assignment posted in AI for Beginners</li>
        <li>Your quiz in Workforce Readiness has been graded</li>
      </ul>
      {/* TODO: In-app and email notification settings */}
    </main>
  );
}