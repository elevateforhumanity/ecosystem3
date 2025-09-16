import React, { useState, useMemo } from "react";
import AppLayout from "../layouts/AppLayout";
import { useAnalytics } from "../hooks/useAnalytics";

export default function StudentDashboard() {
  useAnalytics("Dashboard");
  const [courses] = useState([
    { id: 1, title: "Workforce Readiness 101", progress: 65, updatedAt: "2025-09-01" },
    { id: 2, title: "Financial Literacy Basics", progress: 20, updatedAt: "2025-09-05" }
  ]);

  const avgProgress = useMemo(
    () => (courses.length ? Math.round(courses.reduce((s, c) => s + c.progress, 0) / courses.length) : 0),
    [courses]
  );

  return (
    <AppLayout title="Dashboard">
      <div className="p-4" style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>Student Dashboard</h1>
        <p>Welcome to your dashboard.</p>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18 }}>Overview</h2>
          <div style={cardRow}>
            <Stat label="Enrolled Courses" value={courses.length} />
            <Stat label="Average Progress" value={avgProgress + "%"} />
          </div>
        </section>
        <section>
          <h2 style={{ fontSize: 18 }}>Enrolled Courses</h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {courses.map(c => (
              <li key={c.id} style={courseItem}>
                <strong>{c.title}</strong>
                <div style={barOuter}>
                  <div style={{ ...barInner, width: `${c.progress}%` }} />
                </div>
                <div style={meta}>{c.progress}% complete • Updated {c.updatedAt}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={statLabel}>{label}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

const cardRow = { display: "flex", gap: 24, flexWrap: "wrap", background: "#f8fafc", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0" };
const courseItem = { padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: 12, background: "#fff" };
const barOuter = { background: "#e2e8f0", height: 8, borderRadius: 4, marginTop: 6, overflow: "hidden", maxWidth: 320 };
const barInner = { background: "#2563eb", height: "100%", transition: "width .3s" };
const meta = { fontSize: 12, color: "#64748b", marginTop: 6 };
const statLabel = { fontSize: 12, textTransform: "uppercase", color: "#64748b", letterSpacing: 0.5 };
const statValue = { fontSize: 22, fontWeight: 600 };