import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="iw-footer">
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/privacy-policy">Privacy Policy</Link>|
        <Link to="/terms-of-service">Terms of Service</Link>|
        <Link to="/accessibility">Accessibility</Link>|
        <Link to="/sitemap">Sitemap</Link>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <a href="https://www.indwes.edu/" target="_blank" rel="noopener noreferrer">Indiana Wesleyan University</a>|
        <a href="https://www.facebook.com/IndianaWesleyan" target="_blank" rel="noopener noreferrer">Facebook</a>|
        <a href="https://twitter.com/indwes" target="_blank" rel="noopener noreferrer">Twitter</a>|
        <a href="https://www.youtube.com/user/IndianaWesleyan" target="_blank" rel="noopener noreferrer">YouTube</a>
      </div>
      <div>
        &copy; {new Date().getFullYear()} Indiana Wesleyan University. All rights reserved.
      </div>
    </footer>
  );
}