import React from "react";

export default function StudentHandbook() {
  return (
    <main style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1>Student Handbook</h1>
      <p>
        Welcome to the Student Handbook. Here you will find important information about our LMS, student policies, code of conduct, and resources to help you succeed.
      </p>
      <ul>
        <li>Getting Started</li>
        <li>Code of Conduct</li>
        <li>Attendance & Participation</li>
        <li>Academic Integrity</li>
        <li>Support & Resources</li>
      </ul>
      {/* TODO: Add more detailed handbook sections as needed */}
    </main>
  );
}