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

export default function Student() {
  return (
    <main style={{
      maxWidth: 700,
      margin: "40px auto",
      padding: 32,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
    }}>
      <img
        src="/images/student.jpg"
        alt="A diverse group of students collaborating on a project"
        style={{
          width: "100%",
          borderRadius: 12,
          marginBottom: 24,
          objectFit: "cover",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}
      />
      <h1 style={{ fontSize: 32, marginBottom: 12 }}>Student Portal</h1>
      <p style={{ fontSize: 18, color: "#444", marginBottom: 24 }}>
        Welcome to the Elevate for Humanity Student Portal. Here, you can access a wide range of interactive courses designed to empower you with knowledge and practical skills. Track your learning progress, participate in discussions, and connect with instructors and fellow students from around the world. Our mission is to provide accessible, high-quality education that fosters personal growth and community impact.
      </p>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, marginBottom: 10 }}>How to Get Started</h2>
        <ol style={{ fontSize: 16, color: "#333", marginLeft: 20 }}>
          <li>Browse our <strong>Course Catalog</strong> to find topics that interest you.</li>
          <li>Enroll in a course and begin learning at your own pace.</li>
          <li>Join our student forums to ask questions and share insights.</li>
          <li>Track your achievements and download certificates upon completion.</li>
        </ol>
      </section>
      <section>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Our Sister Sites</h2>
        <ul style={{ listStyle: "none", padding: 0, fontSize: 16 }}>
          <li style={{ marginBottom: 8 }}>
            <a href="https://www.sistersite1.org" target="_blank" rel="noopener noreferrer">
              Sister Site 1
            </a>
            <br />
            <span style={{ color: "#666" }}>
              Sister Site 1 is dedicated to providing mentorship programs and career guidance for students seeking professional development.
            </span>
          </li>
          <li style={{ marginBottom: 8 }}>
            <a href="https://www.sistersite2.org" target="_blank" rel="noopener noreferrer">
              Sister Site 2
            </a>
            <br />
            <span style={{ color: "#666" }}>
              Sister Site 2 offers a global network for volunteering opportunities and community service projects.
            </span>
          </li>
          <li>
            <a href="https://www.sistersite3.org" target="_blank" rel="noopener noreferrer">
              Sister Site 3
            </a>
            <br />
            <span style={{ color: "#666" }}>
              Sister Site 3 focuses on mental health resources and peer support for students and young adults.
            </span>
          </li>
        </ul>
      </section>
    </main>
  );
}