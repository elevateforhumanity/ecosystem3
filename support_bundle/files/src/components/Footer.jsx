import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-8 border-t">
      <div style={{ marginBottom: 8 }}>
        <Link to="/privacy-policy" style={{ color: "#fff", margin: "0 8px" }}>Privacy Policy</Link>|
        <Link to="/refund-policy" style={{ color: "#fff", margin: "0 8px" }}>Refund Policy</Link>|
        <Link to="/terms-of-service" style={{ color: "#fff", margin: "0 8px" }}>Terms of Service</Link>|
        <Link to="/accessibility" style={{ color: "#fff", margin: "0 8px" }}>Accessibility</Link>|
        <Link to="/sitemap" style={{ color: "#fff", margin: "0 8px" }}>Sitemap</Link>|
        <Link to="/student-handbook" style={{ color: "#fff", margin: "0 8px" }}>Student Handbook</Link>
      </div>
      <div style={{ marginBottom: 8 }}>
        <a href="https://linkedin.com/company/elevateforhumanity" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", margin: "0 8px" }}>LinkedIn</a>|
        <a href="https://facebook.com/elevateforhumanity" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", margin: "0 8px" }}>Facebook</a>|
        <a href="https://youtube.com/elevateforhumanity" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", margin: "0 8px" }}>YouTube</a>
      </div>
      <div>
        &copy; {new Date().getFullYear()} Elevate for Humanity. All rights reserved.
        {" | "}
        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Sitemap</a>
      </div>
    </footer>
  );
}