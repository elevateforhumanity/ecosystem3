import React, { useState, useMemo } from "react";

export default function StudentDashboard() {
  const [courses] = useState([
    { id: 1, title: "Workforce Readiness 101", progress: 65, updatedAt: "2025-09-01" },
    { id: 2, title: "Financial Literacy Basics", progress: 20, updatedAt: "2025-09-05" }
  ]);

  const avgProgress = useMemo(
    () =>
      courses.length
        ? Math.round(
            courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
          )
        : 0,
    [courses]
  );

  return (
    <main style={{ padding: 32, maxWidth: 960, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1 style={{ marginTop: 0 }}>Student Dashboard</h1>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Overview</h2>
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            background: "#f8fafc",
            padding: 16,
            borderRadius: 8,
            border: "1px solid #e2e8f0"
          }}
        >
          <Stat label="Enrolled Courses" value={courses.length} />
          <Stat label="Average Progress" value={avgProgress + "%"} />
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Enrolled Courses</h2>
        {courses.length === 0 ? (
          <p>No enrollments yet.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {courses.map(c => (
              <li
                key={c.id}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  marginBottom: 12,
                  background: "#ffffff"
                }}
              >
                <strong>{c.title}</strong>
                <div
                  style={{
                    background: "#e2e8f0",
                    height: 8,
                    borderRadius: 4,
                    marginTop: 6,
                    overflow: "hidden",
                    maxWidth: 320
                  }}
                >
                  <div
                    style={{
                      width: `${c.progress}%`,
                      background: "#2563eb",
                      height: "100%",
                      transition: "width .3s"
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                  {c.progress}% complete • Updated {c.updatedAt}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* TODO: Recent activity, certificates earned, announcements feed */}
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 12, textTransform: "uppercase", color: "#64748b", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}