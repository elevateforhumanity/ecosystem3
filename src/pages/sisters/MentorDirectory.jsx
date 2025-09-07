import React from "react";
import AppLayout from "../../layouts/AppLayout";
import { useAnalytics } from "../../hooks/useAnalytics";

export default function MentorDirectory() {
  useAnalytics("Mentors");
  const mentors = [
    { name: "Jane Smith", area: "Construction Industry Mentor" },
    { name: "Michael Johnson", area: "Financial Literacy Mentor" },
    { name: "Maria Garcia", area: "Music & Dance Mentor" }
  ];
  return (
    <AppLayout title="Mentors">
      <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
        <h1>Mentor Directory</h1>
        <ul>
          {mentors.map(m => (
            <li key={m.name}>{m.name} – {m.area}</li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}