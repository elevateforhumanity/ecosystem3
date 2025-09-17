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

import React, { useState } from "react";
import { Link } from "react-router-dom";

const sisterSites = [
  {
    name: "Mentorship Hub",
    path: "/mentorship",
    subpages: [
      { name: "Main", path: "/mentorship" },
      { name: "Mentor Directory", path: "/mentorship/directory" },
      { name: "Mentor Signup", path: "/mentorship/signup" },
    ],
  },
  {
    name: "Volunteer Network",
    path: "/volunteer",
    subpages: [
      { name: "Main", path: "/volunteer" },
      { name: "Opportunities", path: "/volunteer/opportunities" },
      { name: "Stories", path: "/volunteer/stories" },
    ],
  },
  {
    name: "Wellness & Support",
    path: "/wellness",
    subpages: [
      { name: "Main", path: "/wellness" },
      { name: "Resources", path: "/wellness/resources" },
      { name: "Peer Support", path: "/wellness/peersupport" },
    ],
  },
];

export default function NavBar() {
  const [open, setOpen] = useState(null);

  return (
    <nav style={{ display: "flex", gap: 24, padding: 16, background: "#f5f5f5" }}>
      <Link to="/">Home</Link>
      <Link to="/ecosystem">Ecosystem</Link>
      <Link to="/student">Student</Link>
      <Link to="/instructor">Instructor</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/course/demo-course">Course</Link>
      <Link to="/government">Government</Link>
      <Link to="/philanthropy">Philanthropy</Link>
      <div style={{ position: "relative" }}>
        <span
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setOpen("sisters")}
          onMouseLeave={() => setOpen(null)}
        >
          Sister Sites ▼
        </span>
        {open === "sisters" && (
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 0,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              zIndex: 10,
              minWidth: 180,
            }}
            onMouseEnter={() => setOpen("sisters")}
            onMouseLeave={() => setOpen(null)}
          >
            {sisterSites.map((site) => (
              <div key={site.name} style={{ padding: 8 }}>
                <Link to={site.path} style={{ fontWeight: "bold" }}>
                  {site.name}
                </Link>
                <div style={{ marginLeft: 12 }}>
                  {site.subpages.map((sub) => (
                    <div key={sub.path}>
                      <Link to={sub.path} style={{ fontSize: 14 }}>
                        {sub.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}