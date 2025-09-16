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
      <div className="p-4">
        <h1>Mentor Directory</h1>
        <p>Find mentors here.</p>
        <ul>
          {mentors.map(m => (
            <li key={m.name}>{m.name} – {m.area}</li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}