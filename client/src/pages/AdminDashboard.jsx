/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React from "react";

// Single component file (removed recursive self-import that caused duplicate definition)
export default function AdminDashboard() {
  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>Total Users: 120 (demo)</li>
        <li>Total Courses: 4 (demo)</li>
        <li>Active Enrollments: 87 (demo)</li>
        <li>Recent Signups: user1@example.com, user2@example.com</li>
      </ul>
    </main>
  );
}