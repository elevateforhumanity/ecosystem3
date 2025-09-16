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

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Home() {
  // Load chat widget (Tidio public key is present)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.tidio.co/3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch latest Durable blog posts
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    fetch("https://api.durable.co/v1/blogs/elevateforhumanity/posts?limit=3")
      .then((res) => res.json())
      .then((data) => setBlogs(data.posts || []))
      .catch(() => setBlogs([]));
  }, []);

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <Helmet>
        <title>Elevate for Humanity | Nonprofit Partnership with Selfish Inc. dba</title>
        <meta name="description" content="Elevate for Humanity, in partnership with Selfish Inc. dba, delivers DOL-compliant, dynamic online learning and workforce development. Contact us via chat or SMS." />
        <meta name="keywords" content="LMS, nonprofit, Selfish Inc, Elevate for Humanity, DOL compliant, Google Ad Grant, workforce development, online courses, chat, Twilio, government contractor, best LMS, LearnWorlds alternative, LearnKey alternative" />
        <meta property="og:title" content="Elevate for Humanity | Nonprofit Partnership with Selfish Inc. dba" />
        <meta property="og:description" content="Elevate for Humanity, in partnership with Selfish Inc. dba, delivers DOL-compliant, dynamic online learning and workforce development." />
        <meta property="og:url" content="https://elevateforhumanity.org/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <header>
        <div style={{ background: "#e3f2fd", padding: 12, borderRadius: 8, margin: "16px 0", fontWeight: "bold", textAlign: "center" }}>
          <span role="img" aria-label="government">🏛️</span> Official U.S. Government Contractor | DOL/DOE/DWD Compliant | SAM Registered
        </div>
        <nav style={{ marginBottom: 32, textAlign: "center" }}>
          <Link to="/" style={{ margin: "0 12px", fontWeight: "bold" }}>Home</Link>
          <Link to="/ecosystem" style={{ margin: "0 12px" }}>Ecosystem</Link>
          <Link to="/student" style={{ margin: "0 12px" }}>Student</Link>
          <Link to="/instructor" style={{ margin: "0 12px" }}>Instructor</Link>
          <Link to="/analytics" style={{ margin: "0 12px" }}>Analytics</Link>
          <Link to="/courses" style={{ margin: "0 12px" }}>Course Library</Link>
        </nav>
      </header>
      <section style={{ background: "#fffde7", padding: 24, borderRadius: 12, marginBottom: 32, textAlign: "center" }}>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Elevate for Humanity</h1>
        <h2 style={{ fontSize: 24, marginBottom: 8, color: "#1976d2" }}>
          In Proud Partnership with Selfish Inc. dba
        </h2>
        <p style={{ fontSize: 18, color: "#444" }}>
          Our nonprofit partnership delivers accessible, DOL-compliant online learning and workforce development solutions. Powered by a Google Ad Grant, we reach more learners and empower communities nationwide.
        </p>
        <div style={{ marginTop: 16 }}>
          <a
            href="https://selfishinc.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#1976d2",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 8,
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: 18,
              marginRight: 12,
            }}
          >
            Learn More About Selfish Inc. dba
          </a>
          <Link
            to="/courses"
            style={{
              background: "#388e3c",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 8,
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: 18,
            }}
          >
            Explore Courses
          </Link>
        </div>
      </section>
      <section style={{ marginTop: 32, textAlign: "center" }}>
        <h2>Contact Us</h2>
        <p>
          Chat with us using the chat assistant (bottom right) or text us at <strong>(555) 123-4567</strong> (powered by Twilio).
        </p>
      </section>
      <section style={{ marginTop: 48 }}>
        <h2>Latest News & Updates</h2>
        <ul>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <li key={blog.id}>
                <a href={blog.url} target="_blank" rel="noopener noreferrer">
                  {blog.title}
                </a>
              </li>
            ))
          ) : (
            <>
              <li>
                <a href="https://blog.elevateforhumanity.org/post1" target="_blank" rel="noopener noreferrer">
                  How Elevate for Humanity Empowers Communities
                </a>
              </li>
              <li>
                <a href="https://blog.elevateforhumanity.org/post2" target="_blank" rel="noopener noreferrer">
                  Selfish Inc. dba Partnership: Expanding Our Impact
                </a>
              </li>
              <li>
                <a href="https://blog.elevateforhumanity.org/post3" target="_blank" rel="noopener noreferrer">
                  DOL Compliance: What It Means for Our Learners
                </a>
              </li>
            </>
          )}
        </ul>
      </section>
      <footer style={{ marginTop: 48, textAlign: "center", color: "#888" }}>
        <div>
          <a href="https://linkedin.com/company/elevateforhumanity" target="_blank" rel="noopener noreferrer">LinkedIn</a> |{" "}
          <a href="https://facebook.com/elevateforhumanity" target="_blank" rel="noopener noreferrer">Facebook</a> |{" "}
          <a href="https://youtube.com/elevateforhumanity" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
        <div style={{ marginTop: 8 }}>
          &copy; {new Date().getFullYear()} Elevate for Humanity &amp; Selfish Inc. dba. All rights reserved.
        </div>
      </footer>
      <div style={{ background: "#fff3cd", padding: 16, borderRadius: 8, marginTop: 32, textAlign: "center", color: "#856404" }}>
        <strong>License Notice:</strong> By purchasing, you agree not to resell, sublicense, or redistribute this codebase. All rights reserved. Violators will be prosecuted. See the LICENSE file for full terms.
      </div>
    </main>
  );
}
