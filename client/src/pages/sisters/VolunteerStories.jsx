import React from "react";

export default function VolunteerStories() {
  return (
    <main style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1>Volunteer Stories</h1>
      <p>
        Read inspiring stories from our volunteers about their experiences and impact.
      </p>
      <ul>
        <li>
          <strong>Alex:</strong> "Mentoring students has been incredibly rewarding!"
        </li>
        <li>
          <strong>Samira:</strong> "I loved helping organize the community event."
        </li>
        <li>
          <strong>Jordan:</strong> "Volunteering opened new career opportunities for me."
        </li>
      </ul>
      {/* TODO: Add more stories and allow volunteers to submit their own */}
    </main>
  );
}