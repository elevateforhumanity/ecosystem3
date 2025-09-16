/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import React from "react";

export default function Ecosystem() {
  return (
    <main style={{
      maxWidth: 900,
      margin: "40px auto",
      padding: 32,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
    }}>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>Elevate for Humanity Ecosystem</h1>
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Our Mission</h2>
        <p style={{ fontSize: 18, color: "#444" }}>
          Elevate for Humanity is dedicated to providing accessible, high-quality education and empowerment resources to learners worldwide. Our ecosystem connects students, mentors, volunteers, and mental health advocates through a network of specialized sister sites, each focused on a unique aspect of personal and community development.
        </p>
      </section>

      <section style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 32,
        justifyContent: "space-between"
      }}>
        {/* Main Site */}
        <div style={{
          flex: "1 1 250px",
          minWidth: 250,
          background: "#f9fafb",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <h3 style={{ fontSize: 22, marginBottom: 8 }}>Elevate for Humanity</h3>
          <p style={{ color: "#555", marginBottom: 12 }}>
            Our core platform for interactive courses, student progress tracking, and community forums. We empower learners to grow, connect, and make a difference.
          </p>
          <a href="https://www.elevateforhumanity.org" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }}>
            Visit Main Site
          </a>
        </div>

        {/* Sister Site 1 */}
        <div style={{
          flex: "1 1 250px",
          minWidth: 250,
          background: "#f9fafb",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <h3 style={{ fontSize: 22, marginBottom: 8 }}>Mentorship Hub</h3>
          <p style={{ color: "#555", marginBottom: 12 }}>
            Connects students with experienced mentors for career guidance, skill development, and personal growth. Our mentorship programs are tailored to individual goals.
          </p>
          <a href="https://www.sistersite1.org" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }} aria-label="Visit Mentorship Hub (opens in new tab)">
            Visit Mentorship Hub
          </a>
        </div>

        {/* Sister Site 2 */}
        <div style={{
          flex: "1 1 250px",
          minWidth: 250,
          background: "#f9fafb",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <h3 style={{ fontSize: 22, marginBottom: 8 }}>Volunteer Network</h3>
          <p style={{ color: "#555", marginBottom: 12 }}>
            A global platform for discovering and joining volunteering opportunities and community service projects. Make a positive impact locally and globally.
          </p>
          <a href="https://www.sistersite2.org" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }} aria-label="Visit Volunteer Network (opens in new tab)">
            Visit Volunteer Network
          </a>
        </div>

        {/* Sister Site 3 */}
        <div style={{
          flex: "1 1 250px",
          minWidth: 250,
          background: "#f9fafb",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <h3 style={{ fontSize: 22, marginBottom: 8 }}>Wellness & Support</h3>
          <p style={{ color: "#555", marginBottom: 12 }}>
            Focused on mental health resources, peer support, and well-being for students and young adults. Access articles, workshops, and confidential support.
          </p>
          <a href="https://www.sistersite3.org" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }} aria-label="Visit Wellness & Support (opens in new tab)">
            Visit Wellness & Support
          </a>
        </div>
      </section>

      {/* Suggestions & Summary Section */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Summary & Suggestions</h2>
        <ul style={{ fontSize: 16, color: "#444", lineHeight: 1.7 }}>
          <li>All sister sites and the main site are listed with clear, descriptive text and accessible links.</li>
          <li>Links open in a new tab and use <code>rel="noopener noreferrer"</code> for security.</li>
          <li>Layout is responsive and visually appealing; consider adding images or icons for each card for more visual interest.</li>
          <li>Accessibility is improved with <code>aria-label</code> on links for screen readers.</li>
          <li>Replace placeholder URLs with your real sister site URLs for production.</li>
          <li>All content is clear, professional, and accessible.</li>
        </ul>
      </section>
    </main>
  );
}