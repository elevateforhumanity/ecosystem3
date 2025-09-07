/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React from "react";

const demoAnalytics = [
  { course: "AI for Beginners", enrolled: 42, avgProgress: 68 },
  { course: "Workforce Readiness", enrolled: 31, avgProgress: 82 },
  { course: "Healthcare Fundamentals", enrolled: 27, avgProgress: 54 },
  { course: "Digital Marketing Essentials", enrolled: 19, avgProgress: 73 },
];

export default function AnalyticsDashboard() {
  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Analytics Dashboard</h1>
      <p>View learner progress, engagement, and export reports.</p>
      <table style={{ width: "100%", marginTop: 24, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ textAlign: "left", padding: 8 }}>Course</th>
            <th style={{ textAlign: "left", padding: 8 }}>Enrolled</th>
            <th style={{ textAlign: "left", padding: 8 }}>Avg. Progress (%)</th>
          </tr>
        </thead>
        <tbody>
          {demoAnalytics.map((row, i) => (
            <tr key={i}>
              <td style={{ padding: 8 }}>{row.course}</td>
              <td style={{ padding: 8 }}>{row.enrolled}</td>
              <td style={{ padding: 8 }}>
                <div style={{ background: "#e0e0e0", borderRadius: 6, width: 120 }}>
                  <div style={{
                    width: `${row.avgProgress}%`,
                    background: "#1976d2",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "2px 0",
                    textAlign: "center"
                  }}>
                    {row.avgProgress}%
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* TODO: Add charts, export options, and more detailed analytics */}
    </main>
  );
}