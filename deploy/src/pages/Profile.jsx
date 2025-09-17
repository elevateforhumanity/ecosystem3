/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React from "react";

export default function Profile() {
  return (
    <main style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      <h1>My Profile</h1>
      <p>Name: Jane Doe</p>
      <p>Email: jane@example.com</p>
      <p>Role: Student</p>
      {/* TODO: Add avatar upload, settings, password change */}
    </main>
  );
}