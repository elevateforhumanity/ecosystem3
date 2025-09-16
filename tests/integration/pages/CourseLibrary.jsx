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

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

export default function CourseLibrary() {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("/api/checkout/courses")
      .then((res) => res.json())
      .then(setCourses);
    fetch("https://your-durable-blog-api.com/posts?limit=3")
      .then((res) => res.json())
      .then(setBlogs);
  }, []);

  return (
    <main style={{ padding: 32, background: "#f8fafc", minHeight: "100vh" }}>
      <Helmet>
        <title>Course Library | Elevate for Humanity</title>
        <meta name="description" content="Explore our dynamic, DOL-compliant course library. Download reports, view course covers, and access the best government-ready LMS." />
        <meta name="keywords" content="LMS, government LMS, DOL compliant, workforce development, online courses, best LMS, LearnWorlds alternative, LearnKey alternative, government contractor, digital binder, reporting, scholarship, dynamic LMS" />
        <meta property="og:title" content="Course Library | Elevate for Humanity" />
        <meta property="og:description" content="The #1 government-ready LMS for workforce development, DOL/DOE/DWD compliance, and dynamic reporting. Outperform LearnWorlds and LearnKey." />
        <meta property="og:image" content="https://yourdomain.com/cover.jpg" />
        <meta property="og:url" content="https://yourdomain.com/courses" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <header>
        <div style={{ background: "#e3f2fd", padding: 12, borderRadius: 8, margin: "16px 0", fontWeight: "bold", textAlign: "center" }}>
          <span role="img" aria-label="government">🏛️</span> Official U.S. Government Contractor | DOL/DOE/DWD Compliant | SAM Registered
        </div>
        <nav style={{ marginBottom: 32, textAlign: "center" }}>
          <a href="/" style={{ margin: "0 12px", fontWeight: "bold" }}>Home</a>
          <a href="/ecosystem" style={{ margin: "0 12px" }}>Ecosystem</a>
          <a href="/student" style={{ margin: "0 12px" }}>Student</a>
          <a href="/instructor" style={{ margin: "0 12px" }}>Instructor</a>
          <a href="/analytics" style={{ margin: "0 12px" }}>Analytics</a>
          <a href="/courses" style={{ margin: "0 12px" }}>Course Library</a>
        </nav>
      </header>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Course Library</h1>
      <p style={{ fontSize: 18, color: "#444", marginBottom: 32 }}>
        Discover our full catalog of partner courses, each DOL/DOE/DWD compliant and ready for workforce development. Download digital binders and Excel reports for every course. All prices reflect a transparent 50% markup for platform sustainability and partner support.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              width: 320,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            {course.image && (
              <img
                src={course.image}
                alt={course.name}
                style={{ width: "100%", borderRadius: 6, marginBottom: 12, objectFit: "cover", height: 140 }}
              />
            )}
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>{course.name}</h2>
            <p style={{ color: "#555", marginBottom: 8 }}>{course.description}</p>
            <p style={{ marginBottom: 8 }}>
              <strong>Price:</strong> ${course.markedUpPrice.toFixed(2)}
            </p>
            <button
              style={{
                background: "#1976d2",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: 8
              }}
              onClick={() => {
                // Implement buy logic here
              }}
            >
              Buy Now
            </button>
            <a
              href={`/api/checkout/report/${course.id}`}
              style={{
                display: "block",
                marginTop: 8,
                color: "#388e3c",
                fontWeight: "bold",
              }}
              download
            >
              Download Course Report (Excel)
            </a>
            <a
              href={`/api/checkout/binder/${course.id}`}
              style={{
                display: "block",
                marginTop: 4,
                color: "#1976d2",
                fontWeight: "bold",
              }}
              download
            >
              Download Digital Binder (PDF)
            </a>
          </div>
        ))}
      </div>
      <section style={{ marginTop: 48 }}>
        <h2>Latest Blog Posts</h2>
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id} style={{ marginBottom: 16 }}>
              <a href={blog.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold" }}>
                {blog.title}
              </a>
              <div>
                <a href={`https://linkedin.com/shareArticle?url=${encodeURIComponent(blog.url)}`} target="_blank" rel="noopener noreferrer">Share on LinkedIn</a> |{" "}
                <a href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(blog.url)}`} target="_blank" rel="noopener noreferrer">Facebook</a> |{" "}
                <a href={`https://youtube.com`} target="_blank" rel="noopener noreferrer">YouTube</a>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section style={{ marginTop: 48, textAlign: "center" }}>
        <h2>Support Scholarships</h2>
        <p>
          Help us provide access to education for all. Your donation supports scholarships for students in need.
        </p>
        <a
          href="https://buy.stripe.com/test_donation_link"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#388e3c",
            color: "#fff",
            padding: "16px 32px",
            borderRadius: 8,
            fontWeight: "bold",
            textDecoration: "none",
            fontSize: 20,
            marginTop: 12,
          }}
        >
          Donate Now & Support Scholarships
        </a>
      </section>
      <footer style={{ marginTop: 48, textAlign: "center", color: "#888" }}>
        <div>
          <a href="https://linkedin.com/company/yourcompany" target="_blank" rel="noopener noreferrer">LinkedIn</a> |{" "}
          <a href="https://facebook.com/yourcompany" target="_blank" rel="noopener noreferrer">Facebook</a> |{" "}
          <a href="https://youtube.com/yourcompany" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
        <div style={{ marginTop: 8 }}>
          &copy; {new Date().getFullYear()} Elevate for Humanity. All rights reserved.
        </div>
      </footer>
    </main>
  );
}