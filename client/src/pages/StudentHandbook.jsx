import React from "react";
import MentorDirectory from "./sisters/MentorDirectory";

export default function StudentHandbook() {
  return (
    <main style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1>Student Handbook</h1>
      <MentorDirectory />
      {/* ...rest of your content... */}
    </main>
  );
}