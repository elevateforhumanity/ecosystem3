import React from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function AppLayout({ title, children }) {
  return (
    <>
      <Helmet>
        <title>{title ? `${title} | App` : "App"}</title>
        <meta name="description" content="Workforce readiness and learning platform." />
      </Helmet>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header style={{ padding: "12px 24px", background: "#0f172a" }}>
        <nav style={{ display: "flex", gap: 16 }}>
          <NavLink style={linkStyle} to="/">Dashboard</NavLink>
          <NavLink style={linkStyle} to="/quiz">Quiz</NavLink>
          <NavLink style={linkStyle} to="/mentors">Mentors</NavLink>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer style={{ padding: 24, textAlign: "center", fontSize: 12, color: "#64748b" }}>
        © {new Date().getFullYear()} App
      </footer>
    </>
  );
}

const linkStyle = ({ isActive }) => ({
  color: isActive ? "#38bdf8" : "#e2e8f0",
  textDecoration: "none",
  fontWeight: 500
});