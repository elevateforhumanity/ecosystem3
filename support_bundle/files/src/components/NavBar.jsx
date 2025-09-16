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
    <nav className="bg-blue-800 text-white px-4 py-2 flex flex-wrap items-center justify-between">
      <div className="font-bold text-lg">Elevate for Humanity</div>
      <div className="flex gap-4 flex-wrap">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/programs" className="hover:underline">Programs</Link>
        <Link to="/hub" className="hover:underline">Hub</Link>
        <Link to="/lms" className="hover:underline">LMS</Link>
        <Link to="/connect" className="hover:underline">Connect</Link>
        <Link to="/donate" className="hover:underline">Donate</Link>
        <Link to="/partners" className="hover:underline">Partners</Link>
        <Link to="/account" className="hover:underline">Account</Link>
      </div>
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