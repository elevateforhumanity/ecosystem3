/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React from "react";
import { useNavigate } from "react-router-dom";

const demoCourses = [
  {
    id: "ai-for-beginners",
    title: "AI for Beginners",
    coverUrl: "/images/ai-course.jpg",
    description: "Learn the basics of AI and machine learning.",
  },
  {
    id: "workforce-readiness",
    title: "Workforce Readiness",
    coverUrl: "/images/workforce.jpg",
    description: "Prepare for the modern workforce with essential skills.",
  },
  {
    id: "healthcare-fundamentals",
    title: "Healthcare Fundamentals",
    coverUrl: "/images/healthcare.jpg",
    description: "Essential knowledge for entering the healthcare industry.",
  },
  {
    id: "digital-marketing-essentials",
    title: "Digital Marketing Essentials",
    coverUrl: "/images/marketing.jpg",
    description: "Master digital marketing strategies and tools.",
  },
];

export default function CourseCatalog() {
  const navigate = useNavigate();
  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Course Catalog</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "flex-start",
        }}
      >
        {demoCourses.map((course) => (
          <div
            key={course.id}
            style={{
              width: 260,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: 16,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "box-shadow 0.2s",
            }}
          >
            <img
              src={course.coverUrl}
              alt={course.title}
              title={course.title}
              style={{
                width: "100%",
                borderRadius: 8,
                objectFit: "cover",
                height: 140,
                marginBottom: 12,
              }}
            />
            <h2 style={{ fontSize: 20, margin: "12px 0 8px" }}>
              {course.title}
            </h2>
            <p style={{ color: "#555", fontSize: 15, minHeight: 48 }}>
              {course.description}
            </p>
            <button
              style={{
                marginTop: "auto",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "10px 18px",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(25,118,210,0.08)",
                transition: "background 0.2s",
              }}
              onClick={() => navigate(`/course/${course.id}`)}
            >
              View Course
            </button>
          </div>
        ))}
      </div>
      <style>
        {`
          @media (max-width: 700px) {
            main {
              padding: 12px !important;
            }
            div[style*="display: flex"] {
              flex-direction: column !important;
              align-items: center !important;
            }
            div[style*="width: 260px"] {
              width: 98vw !important;
              margin-bottom: 18px !important;
            }
          }
        `}
      </style>
    </main>
  );
}

// In your main application file, you would have the route like this:
// import CourseCatalog from "./pages/CourseCatalog";
// ...
// <Route path="/courses" element={<CourseCatalog />} />